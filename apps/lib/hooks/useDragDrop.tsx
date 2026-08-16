"use client";

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import {
  DndContext,
  DragOverlay,
  useDroppable,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * Drag and drop, once, for every surface that needs it.
 *
 * It exists because the same thing was written three times — the board, the config rail's column
 * list and the tree each had their own — all three on the **HTML5 drag and drop API**, which
 * mobile browsers do not drive from touch. A finger never fires `dragstart`, so on a phone none of
 * it worked at all, and there was no keyboard path either.
 *
 * This is built on `@dnd-kit`, already used by `DataTable` and `FormBuilder.Table`. Its pointer
 * sensor speaks Pointer Events, which cover mouse, touch and pen alike, and its keyboard sensor
 * makes a drag reachable without a pointing device.
 *
 * The hook does not move anything. It reports a `DragMove` and the caller decides — the same
 * contract the rest of DataViews keeps, and the reason a failed save leaves the UI showing the
 * truth rather than a lie.
 */

// Re-exported so a surface can render the provider without also importing @dnd-kit directly —
// the point of this file is that it is the only place that does.
export { DndContext };

/**
 * The thing that follows the pointer.
 *
 * A list does not need one: its items slide apart, so the gap says where the drop will land. A
 * board does. Once a card is dragged over a *different* column, dnd-kit stops transforming it —
 * it has left the list that was arranging it — and without an overlay the card just sits faded in
 * its old column while the pointer moves off alone.
 *
 * Render whatever the item looks like inside; it is drawn above everything, at the pointer.
 */
export function DragGhost({ children }: { children: ReactNode }) {
  return (
    <DragOverlay dropAnimation={null}>
      {children ? <div data-dnd-overlay>{children}</div> : null}
    </DragOverlay>
  );
}

export type DropPosition = "before" | "inside" | "after";

export interface DragMove {
  /** The item being dragged. */
  id: string;
  /** The container it started in. `null` for a flat list, which has only one. */
  from: string | null;
  /** The container it was dropped on. */
  to: string | null;
  /** Its position within `to`, when the surface has an order. */
  index?: number;
  /** Trees only: dropped above the target, into it, or below it. */
  position?: DropPosition;
}

export type DragMode =
  /** Items move between containers — a kanban board. */
  | "board"
  /** One ordered list — the column rail, table rows. */
  | "list"
  /** A hierarchy, where a drop can also mean "inside". */
  | "tree";

export interface UseDragDropOptions {
  mode: DragMode;
  /** Called on drop. Nothing has moved yet; that is your job. */
  onMove: (move: DragMove) => void;
  disabled?: boolean;
  /**
   * Veto a drop before it is reported — a tree uses this to refuse a node dropped into its own
   * descendant, which would detach the branch from the root.
   */
  canDrop?: (move: DragMove) => boolean;
  /**
   * Which container an item currently belongs to. Board mode needs it to report `from`, since the
   * drop target only knows where the item landed.
   */
  containerOf?: (id: string) => string | null;
  /** Where in `to` the item landed. Supplied by the caller, which knows its own ordering. */
  indexOf?: (id: string) => number;
  /**
   * Tree mode: can this row hold children? A leaf has no inside, so its middle band collapses and
   * the whole row reads as before-or-after — otherwise a drop on a file would silently do nothing.
   */
  canNestInto?: (id: string) => boolean;
}

/** How far the mouse travels before a press becomes a drag, so a click stays a click. */
const MOUSE_DISTANCE = 8;

/**
 * Touch is deliberately *not* handled by the pointer sensor.
 *
 * A finger has one gesture for two intentions: dragging an item and scrolling the list it is in.
 * A distance threshold cannot separate them — whichever wins, the other becomes impossible. So
 * touch drags start on a long press instead, which is the convention every mobile list uses: hold
 * to pick up, swipe to scroll.
 *
 * `tolerance` is how far the finger may wander during the hold before it is treated as a scroll
 * rather than an impatient drag.
 */
const TOUCH_DELAY_MS = 200;
const TOUCH_TOLERANCE = 8;

/** Within this fraction of a row's top or bottom edge, a tree drop means "beside", not "into". */
const EDGE_BAND = 0.25;

/**
 * Where the pointer is, in viewport coordinates.
 *
 * dnd-kit reports a *delta* from wherever the drag was activated, so the absolute position is the
 * activator plus that delta. A touch activator carries its coordinates on `touches`, a keyboard
 * activator carries none at all — hence the null, which the caller reads as "aim at the middle".
 */
function pointerY(activator: Event | null, delta: number): number | null {
  const e = activator as (MouseEvent & TouchEvent) | null;
  const start = e?.clientY ?? e?.touches?.[0]?.clientY;
  return typeof start === "number" ? start + delta : null;
}

/**
 * `CSS.escape`, reached through `window` because `CSS` in this file is dnd-kit's transform helper.
 * The fallback covers environments without it (jsdom, older Safari).
 */
const escapeId = (v: string) =>
  typeof window !== "undefined" && window.CSS?.escape
    ? window.CSS.escape(v)
    : v.replace(/["\\]/g, "\\$&");

export function useDragDrop({
  mode,
  onMove,
  disabled = false,
  canDrop,
  containerOf,
  indexOf,
  canNestInto,
}: UseDragDropOptions) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [position, setPosition] = useState<DropPosition | null>(null);
  // The state paints the drop indicator; the ref is what the drop itself reads. See `onDragEnd`.
  const positionRef = useRef<DropPosition | null>(null);
  const setPositionState = useCallback((next: DropPosition | null) => {
    positionRef.current = next;
    setPosition((prev) => (prev === next ? prev : next));
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: MOUSE_DISTANCE } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: TOUCH_DELAY_MS, tolerance: TOUCH_TOLERANCE },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const onDragOver = useCallback((event: DragOverEvent) => {
    setOverId(event.over ? String(event.over.id) : null);
  }, []);

  /**
   * A tree's drop position changes *within* one row — top edge means "before", middle means
   * "inside" — and `onDragOver` fires only when the row underneath changes. So the position is
   * tracked on every move instead.
   */
  const onDragMove = useCallback(
    (event: DragMoveEvent) => {
      if (mode !== "tree") return;
      const over = event.over;
      setOverId(over ? String(over.id) : null);
      if (!over) {
        setPositionState(null);
        return;
      }
      // Measured live off the row itself: dnd-kit's cached rect predates any scrolling the drag
      // has caused, and near a scrolling edge is exactly where a tree drop is hardest to aim.
      const el = document.querySelector(`[data-dnd-item="${escapeId(String(over.id))}"]`);
      const rect = el?.getBoundingClientRect() ?? over.rect;
      const y = pointerY(event.activatorEvent, event.delta.y) ?? rect.top + rect.height / 2;
      const offset = (y - rect.top) / (rect.height || 1);

      const nests = canNestInto ? canNestInto(String(over.id)) : true;
      setPositionState(
        !nests
          ? offset < 0.5
            ? "before"
            : "after"
          : offset < EDGE_BAND
            ? "before"
            : offset > 1 - EDGE_BAND
              ? "after"
              : "inside",
      );
    },
    [mode, canNestInto, setPositionState],
  );

  const reset = useCallback(() => {
    setActiveId(null);
    setOverId(null);
    setPositionState(null);
  }, [setPositionState]);

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      // Read before resetting: `reset` clears this, and it is the whole answer to "before, inside
      // or after".
      const dropped = positionRef.current;
      reset();
      if (!over) return;

      const id = String(active.id);
      const to = String(over.id);
      if (id === to && mode !== "list") return;

      const move: DragMove = {
        id,
        from: containerOf?.(id) ?? null,
        to,
        ...(indexOf ? { index: indexOf(to) } : null),
        // From the ref, not the state: the drop lands in the same tick as the last move, and the
        // handler dnd-kit is holding was built before that move could re-render.
        ...(mode === "tree" && dropped ? { position: dropped } : null),
      };

      if (canDrop && !canDrop(move)) return;
      onMove(move);
    },
    [canDrop, containerOf, indexOf, mode, onMove, reset],
  );

  const contextProps = useMemo(
    () => ({
      sensors,
      // A board's columns are large targets, so the *corner* nearest the pointer identifies the
      // intended one better than its centre; a list wants the centre.
      collisionDetection: mode === "board" ? closestCorners : closestCenter,
      onDragStart,
      onDragOver,
      onDragMove,
      onDragEnd,
      onDragCancel: reset,
    }),
    [sensors, mode, onDragStart, onDragOver, onDragMove, onDragEnd, reset],
  );

  return {
    /** Spread onto `<DndContext>`. */
    contextProps,
    DndContext,
    activeId,
    overId,
    position,
    disabled,
  };
}

/**
 * The ordered part of a surface — a column list, a table body, a tree's visible rows.
 *
 * `ids` must be in the order they are painted; that is how a drop position is worked out.
 *
 * `makeRoom` is the list's answer to "where will this land?". A flat list answers by sliding its
 * items apart to open a gap. A tree cannot: its rows have to stay put for a drop to mean *inside*
 * one of them rather than between two, and the gap would move the very row the pointer is being
 * measured against. It draws an indicator line instead.
 */
export function DragList({
  ids,
  children,
  makeRoom = true,
}: {
  ids: string[];
  children: ReactNode;
  makeRoom?: boolean;
}) {
  return (
    <SortableContext items={ids} strategy={makeRoom ? verticalListSortingStrategy : NO_SHIFT}>
      {children}
    </SortableContext>
  );
}

/** A sorting strategy that moves nothing. */
const NO_SHIFT = () => null;

/**
 * One draggable item.
 *
 * `handleProps` go on whatever should start the drag — spread them on the row for a
 * drag-anywhere feel, or on a grip so the rest of the row stays clickable.
 */
export function useDragItem(id: string, disabled = false, { follow = true } = {}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });

  // `follow` is whether the item travels with the pointer. A card should — it is the thing being
  // moved and there is nothing else to look at. A tree row should not: the drop indicator is
  // painted on the *target* row, and a ghost sliding over it hides the very answer it is giving.
  const moving = follow ? transform : null;

  return {
    ref: setNodeRef,
    handleProps: {
      ...attributes,
      ...listeners,
      // A stable hook for styling and for tests. dnd-kit sets no `draggable` attribute — it
      // works on pointer events — so there is otherwise nothing in the DOM saying "this drags".
      "data-dnd-item": id,
    },
    style: {
      transform: CSS.Transform.toString(moving),
      transition: follow ? transition : undefined,
      // `manipulation` keeps panning and scrolling working while suppressing the double-tap
      // zoom delay. `none` would kill scrolling on the item entirely, which is the usual
      // mistake — the long-press constraint above is what separates drag from scroll.
      touchAction: "manipulation" as const,
    },
    isDragging,
  };
}

/**
 * A container an item can be dropped into — one board column.
 *
 * A list does not need this: its items are their own drop targets. A board does, or dropping on
 * an empty column would have nothing to hit.
 */
export function useDropContainer(id: string, disabled = false) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled });
  return { ref: setNodeRef, isOver, containerProps: { "data-dnd-container": id } };
}
