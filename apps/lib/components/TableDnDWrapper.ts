/**
 * TableDnDWrapper
 *
 * Wraps @editorjs/table and adds drag-and-drop reordering for rows
 * and columns by hijacking the existing .tc-toolbox toggler elements.
 *
 * - Click the toggler → opens the original popover menu (unchanged)
 * - Drag the toggler → reorders the row/column (new behavior)
 *
 * No extra UI elements are injected — we reuse what the table plugin
 * already renders.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TableClass = any;

const DRAG_THRESHOLD = 5; // px before a pointerdown becomes a drag

interface DragState {
  active: boolean;
  pending: boolean; // pointerdown happened but haven't passed threshold
  type: "row" | "col" | null;
  index: number;
  dropIndex: number;
  pointerId: number;
  startX: number;
  startY: number;
}

export default function createTableDnDClass(
  OriginalTable: TableClass,
): TableClass {
  return class TableDnD extends OriginalTable {
    private _drag: DragState = {
      active: false,
      pending: false,
      type: null,
      index: -1,
      dropIndex: -1,
      pointerId: -1,
      startX: 0,
      startY: 0,
    };

    private _indicator: HTMLDivElement | null = null;
    private _wrapperRef: HTMLElement | null = null;
    private _onMoveBound = this._onPointerMove.bind(this);
    private _onUpBound = this._onPointerUp.bind(this);
    private _mutationObs: MutationObserver | null = null;
    private _rafId: number | null = null;
    private _attachedTogglers = new WeakSet<HTMLElement>();

    // ─── Lifecycle ──────────────────────────────────────────────────────

    render(): HTMLElement {
      const wrapper: HTMLElement = super.render();
      this._wrapperRef = wrapper;

      if (this.readOnly) return wrapper;

      this._waitForLayout(wrapper, () => this._setup(wrapper));
      return wrapper;
    }

    destroy(): void {
      this._teardown();
      if (super.destroy) super.destroy();
    }

    // ─── Wait for DOM ───────────────────────────────────────────────────

    private _waitForLayout(el: HTMLElement, cb: () => void): void {
      const check = () => {
        if (el.offsetHeight > 0 && el.querySelector(".tc-row")) {
          cb();
        } else {
          this._rafId = requestAnimationFrame(check);
        }
      };
      this._rafId = requestAnimationFrame(check);
    }

    // ─── Setup ──────────────────────────────────────────────────────────

    private _setup(wrapper: HTMLElement): void {
      wrapper.classList.add("tc-dnd-wrap");

      // Drop indicator
      this._indicator = document.createElement("div");
      this._indicator.className = "tc-dnd__indicator";
      wrapper.appendChild(this._indicator);

      // Attach to existing togglers
      this._attachTogglers(wrapper);

      // Re-attach when DOM changes (new rows/cols might create new togglers)
      this._mutationObs = new MutationObserver(() => {
        this._attachTogglers(wrapper);
      });
      this._mutationObs.observe(wrapper, { childList: true, subtree: true });

      // Proximity-based toolbox visibility:
      // Only show row handle near left edge, column handle near top edge
      wrapper.addEventListener("mousemove", (e) =>
        this._onWrapperMouseMove(e),
      );
      wrapper.addEventListener("mouseleave", () => {
        wrapper.classList.remove("tc-dnd--show-row", "tc-dnd--show-col");
      });
    }

    // ─── Attach to .tc-toolbox__toggler elements ────────────────────────

    private _attachTogglers(wrapper: HTMLElement): void {
      // Row toolbox toggler
      const rowToolbox = wrapper.querySelector<HTMLElement>(
        ".tc-toolbox--row .tc-toolbox__toggler",
      );
      if (rowToolbox && !this._attachedTogglers.has(rowToolbox)) {
        this._attachedTogglers.add(rowToolbox);
        rowToolbox.style.cursor = "grab";
        rowToolbox.addEventListener("pointerdown", (e) => {
          this._onTogglerDown("row", wrapper, e);
        });
      }

      // Column toolbox toggler
      const colToolbox = wrapper.querySelector<HTMLElement>(
        ".tc-toolbox--column .tc-toolbox__toggler",
      );
      if (colToolbox && !this._attachedTogglers.has(colToolbox)) {
        this._attachedTogglers.add(colToolbox);
        colToolbox.style.cursor = "grab";
        colToolbox.addEventListener("pointerdown", (e) => {
          this._onTogglerDown("col", wrapper, e);
        });
      }
    }

    // ─── Proximity-based toolbox visibility ──────────────────────────────

    private _onWrapperMouseMove(e: MouseEvent): void {
      const tableEl =
        this._wrapperRef?.querySelector<HTMLElement>(".tc-table");
      if (!tableEl || !this._wrapperRef) return;

      const tableRect = tableEl.getBoundingClientRect();
      const distFromLeft = e.clientX - tableRect.left;
      const distFromTop = e.clientY - tableRect.top;

      const LEFT_THRESHOLD = 50;
      const TOP_THRESHOLD = 35;

      const nearLeft = distFromLeft <= LEFT_THRESHOLD && distFromLeft >= -30;
      const nearTop = distFromTop <= TOP_THRESHOLD && distFromTop >= -25;

      if (nearLeft && nearTop) {
        // Corner: pick the proportionally closer edge
        const leftRatio = Math.abs(distFromLeft) / LEFT_THRESHOLD;
        const topRatio = Math.abs(distFromTop) / TOP_THRESHOLD;
        if (leftRatio < topRatio) {
          this._wrapperRef.classList.add("tc-dnd--show-row");
          this._wrapperRef.classList.remove("tc-dnd--show-col");
        } else {
          this._wrapperRef.classList.add("tc-dnd--show-col");
          this._wrapperRef.classList.remove("tc-dnd--show-row");
        }
      } else if (nearLeft) {
        this._wrapperRef.classList.add("tc-dnd--show-row");
        this._wrapperRef.classList.remove("tc-dnd--show-col");
      } else if (nearTop) {
        this._wrapperRef.classList.add("tc-dnd--show-col");
        this._wrapperRef.classList.remove("tc-dnd--show-row");
      } else {
        this._wrapperRef.classList.remove(
          "tc-dnd--show-row",
          "tc-dnd--show-col",
        );
      }
    }

    // ─── Toggler pointerdown (start pending drag) ───────────────────────

    private _onTogglerDown(
      type: "row" | "col",
      wrapper: HTMLElement,
      e: PointerEvent,
    ): void {
      // Detect which row/col is currently hovered by the table plugin
      const index = this._detectHoveredIndex(type, wrapper);
      if (index < 0) return;

      this._drag = {
        active: false,
        pending: true,
        type,
        index,
        dropIndex: index,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
      };

      document.addEventListener("pointermove", this._onMoveBound);
      document.addEventListener("pointerup", this._onUpBound);
      document.addEventListener("pointercancel", this._onUpBound);
    }

    // ─── Detect hovered row/col index ───────────────────────────────────

    private _detectHoveredIndex(
      type: "row" | "col",
      wrapper: HTMLElement,
    ): number {
      const tableEl = wrapper.querySelector<HTMLElement>(".tc-table");
      if (!tableEl) return -1;

      if (type === "row") {
        // The row toolbox is positioned at the hovered row.
        // Find which row by comparing toolbox top to row tops.
        const toolbox = wrapper.querySelector<HTMLElement>(".tc-toolbox--row");
        if (!toolbox) return -1;
        const toolboxRect = toolbox.getBoundingClientRect();
        const toolboxMid = toolboxRect.top + toolboxRect.height / 2;

        const rows = tableEl.querySelectorAll<HTMLElement>(".tc-row");
        for (let i = 0; i < rows.length; i++) {
          const r = rows[i].getBoundingClientRect();
          if (toolboxMid >= r.top && toolboxMid <= r.bottom) return i;
        }
        return -1;
      } else {
        const toolbox = wrapper.querySelector<HTMLElement>(
          ".tc-toolbox--column",
        );
        if (!toolbox) return -1;
        const toolboxRect = toolbox.getBoundingClientRect();
        const toolboxMid = toolboxRect.left + toolboxRect.width / 2;

        const firstRow = tableEl.querySelector<HTMLElement>(".tc-row");
        if (!firstRow) return -1;
        const cells = firstRow.querySelectorAll<HTMLElement>(".tc-cell");
        for (let i = 0; i < cells.length; i++) {
          const r = cells[i].getBoundingClientRect();
          if (toolboxMid >= r.left && toolboxMid <= r.right) return i;
        }
        return -1;
      }
    }

    // ─── Pointer Move ───────────────────────────────────────────────────

    private _onPointerMove(e: PointerEvent): void {
      const d = this._drag;
      if (!d.pending && !d.active) return;

      // Check threshold to start drag
      if (d.pending && !d.active) {
        const dx = e.clientX - d.startX;
        const dy = e.clientY - d.startY;
        if (Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD) return;

        // Passed threshold → start real drag
        d.pending = false;
        d.active = true;

        // Close any open popover from the table plugin
        const openPopover =
          this._wrapperRef?.querySelector<HTMLElement>(".tc-popover--opened");
        openPopover?.classList.remove("tc-popover--opened");

        this._highlight(d.type!, d.index, true);
        document.body.style.cursor = "grabbing";
        document.body.style.userSelect = "none";
      }

      if (!d.active || !this._wrapperRef) return;
      e.preventDefault();

      const drop = this._calcDrop(this._wrapperRef, e.clientX, e.clientY);
      if (drop !== d.dropIndex) {
        d.dropIndex = drop;
        this._showIndicator(this._wrapperRef, drop);
      }
    }

    // ─── Pointer Up ─────────────────────────────────────────────────────

    private _onPointerUp(e: PointerEvent): void {
      const d = this._drag;
      const wasDragging = d.active;

      if (wasDragging) {
        e.preventDefault();
        e.stopPropagation();

        this._highlight(d.type!, d.index, false);
        if (this._indicator) this._indicator.style.display = "none";

        document.body.style.cursor = "";
        document.body.style.userSelect = "";

        if (d.dropIndex !== d.index && d.dropIndex !== -1) {
          if (d.type === "row") this._moveRow(d.index, d.dropIndex);
          else this._moveCol(d.index, d.dropIndex);
        }

        // Swallow the click event that the browser fires after pointerup
        // so the popover menu doesn't open after a drag.
        const swallowClick = (ev: Event) => {
          ev.preventDefault();
          ev.stopPropagation();
          ev.stopImmediatePropagation();
        };
        document.addEventListener("click", swallowClick, {
          capture: true,
          once: true,
        });
        // Safety: remove after a short delay in case click never fires
        setTimeout(() => {
          document.removeEventListener("click", swallowClick, {
            capture: true,
          });
        }, 200);
      }

      // If pending (no drag threshold met) — let the click go through
      // to the original popover menu handler.

      // Reset
      d.active = false;
      d.pending = false;
      document.removeEventListener("pointermove", this._onMoveBound);
      document.removeEventListener("pointerup", this._onUpBound);
      document.removeEventListener("pointercancel", this._onUpBound);
    }

    // ─── Move Row / Column ──────────────────────────────────────────────

    private _moveRow(from: number, to: number): void {
      const tableEl =
        this._wrapperRef?.querySelector<HTMLElement>(".tc-table");
      if (!tableEl) return;

      const rows = Array.from(
        tableEl.querySelectorAll<HTMLElement>(".tc-row"),
      );
      if (from < 0 || from >= rows.length) return;

      const target = to > from ? to - 1 : to;
      if (target === from) return;

      const row = rows[from];
      const ref = rows[target];
      if (target > from) {
        ref.parentElement!.insertBefore(row, ref.nextSibling);
      } else {
        ref.parentElement!.insertBefore(row, ref);
      }
    }

    private _moveCol(from: number, to: number): void {
      const tableEl =
        this._wrapperRef?.querySelector<HTMLElement>(".tc-table");
      if (!tableEl) return;

      const target = to > from ? to - 1 : to;
      if (target === from) return;

      tableEl.querySelectorAll<HTMLElement>(".tc-row").forEach((row) => {
        const cells = Array.from(
          row.querySelectorAll<HTMLElement>(".tc-cell"),
        );
        if (from >= cells.length) return;

        const cell = cells[from];
        const ref = cells[target];
        if (target > from) {
          row.insertBefore(cell, ref.nextSibling);
        } else {
          row.insertBefore(cell, ref);
        }
      });
    }

    // ─── Drop Index Calc ────────────────────────────────────────────────

    private _calcDrop(
      wrapper: HTMLElement,
      cx: number,
      cy: number,
    ): number {
      const tableEl = wrapper.querySelector<HTMLElement>(".tc-table");
      if (!tableEl) return this._drag.index;

      if (this._drag.type === "row") {
        const rows = tableEl.querySelectorAll<HTMLElement>(".tc-row");
        for (let i = 0; i < rows.length; i++) {
          const r = rows[i].getBoundingClientRect();
          if (cy < r.top + r.height / 2) return i;
        }
        return rows.length;
      } else {
        const first = tableEl.querySelector<HTMLElement>(".tc-row");
        if (!first) return this._drag.index;
        const cells = first.querySelectorAll<HTMLElement>(".tc-cell");
        for (let i = 0; i < cells.length; i++) {
          const r = cells[i].getBoundingClientRect();
          if (cx < r.left + r.width / 2) return i;
        }
        return cells.length;
      }
    }

    // ─── Visual Feedback ────────────────────────────────────────────────

    private _highlight(
      type: "row" | "col",
      idx: number,
      on: boolean,
    ): void {
      const tableEl =
        this._wrapperRef?.querySelector<HTMLElement>(".tc-table");
      if (!tableEl) return;

      if (type === "row") {
        const rows = tableEl.querySelectorAll<HTMLElement>(".tc-row");
        rows[idx]?.classList.toggle("tc-dnd__row--dragging", on);
      } else {
        tableEl.querySelectorAll<HTMLElement>(".tc-row").forEach((row) => {
          const cells = row.querySelectorAll<HTMLElement>(".tc-cell");
          cells[idx]?.classList.toggle("tc-dnd__cell--dragging", on);
        });
      }
    }

    private _showIndicator(wrapper: HTMLElement, dropIdx: number): void {
      if (!this._indicator) return;
      const tableEl = wrapper.querySelector<HTMLElement>(".tc-table");
      if (!tableEl) return;

      const { type, index } = this._drag;
      if (dropIdx === index || dropIdx === index + 1) {
        this._indicator.style.display = "none";
        return;
      }

      const wrapRect = wrapper.getBoundingClientRect();
      this._indicator.style.display = "block";

      if (type === "row") {
        const rows = tableEl.querySelectorAll<HTMLElement>(".tc-row");
        const tableRect = tableEl.getBoundingClientRect();
        let y: number;
        if (dropIdx >= rows.length) {
          y = rows[rows.length - 1].getBoundingClientRect().bottom;
        } else {
          y = rows[dropIdx].getBoundingClientRect().top;
        }
        this._indicator.style.left = `${tableRect.left - wrapRect.left}px`;
        this._indicator.style.top = `${y - wrapRect.top - 2}px`;
        this._indicator.style.width = `${tableRect.width}px`;
        this._indicator.style.height = "4px";
      } else {
        const first = tableEl.querySelector<HTMLElement>(".tc-row");
        if (!first) return;
        const cells = first.querySelectorAll<HTMLElement>(".tc-cell");
        const tableRect = tableEl.getBoundingClientRect();
        let x: number;
        if (dropIdx >= cells.length) {
          x = cells[cells.length - 1].getBoundingClientRect().right;
        } else {
          x = cells[dropIdx].getBoundingClientRect().left;
        }
        this._indicator.style.left = `${x - wrapRect.left - 2}px`;
        this._indicator.style.top = `${tableRect.top - wrapRect.top}px`;
        this._indicator.style.width = "4px";
        this._indicator.style.height = `${tableRect.height}px`;
      }
    }

    // ─── Cleanup ────────────────────────────────────────────────────────

    private _teardown(): void {
      if (this._rafId) cancelAnimationFrame(this._rafId);
      document.removeEventListener("pointermove", this._onMoveBound);
      document.removeEventListener("pointerup", this._onUpBound);
      document.removeEventListener("pointercancel", this._onUpBound);
      this._mutationObs?.disconnect();
      this._indicator?.remove();
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  };
}
