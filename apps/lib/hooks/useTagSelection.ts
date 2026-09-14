import { useState, useEffect, useRef } from "react";

export interface Tag {
  id: string;
  name: string;
  variant?: string;
  value?: string;
  isSelected: boolean;
  [key: string]: unknown;
}

/** Stable key for a selection, used to tell an external change from one we just made. */
const signatureOf = (tags: Tag[]) => tags.map((t) => t.id).join("\0");

export const useTagSelection = ({
  Tags,
  onTagsChange,
  inputRef,
  singleSelect = false,
  creatable = false,
}: {
  Tags: Tag[];
  onTagsChange?: (selectedTags: Tag[]) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  singleSelect?: boolean;
  /** Allow typed text to become a selected tag that was never in `Tags`. */
  creatable?: boolean;
}) => {
  // Split initial tags into selected and unselected
  const initialSelectedTags = Tags.filter((tag) => tag.isSelected);
  const initialUnselectedTags = Tags.filter((tag) => !tag.isSelected);

  // Initialize with available tags (excluding any initially selected ones)
  const [tags, setTags] = useState<Tag[]>(initialUnselectedTags);

  // Initialize with any pre-selected tags
  const [selectedTagsStack, setSelectedTagsStack] = useState<Tag[]>(
    singleSelect && initialSelectedTags.length > 0 ? [initialSelectedTags[0]] : initialSelectedTags,
  );
  const [searchTags, filterTagsBySearch] = useState("");
  const [focusedTagIndex, setFocusedTagIndex] = useState<number | null>(null);
  const [focusedPopoverIndex, setFocusedPopoverIndex] = useState<number | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // LOCAL PATCH (Contact Center): key both effects below off a SIGNATURE of `Tags`, not the array
  // reference. A caller that builds its tag list inline — `MultiSelectField` does, from the form
  // value — hands over a fresh array every render, so the upstream `[Tags]` dependency changed on
  // every pass: effect → setTags → re-render → new array → effect, an infinite render loop.
  const tagsSignature = Tags.map((tag) => `${tag.id}:${tag.isSelected ? 1 : 0}`).join(" ");

  // Update internal state when Tags actually changes.
  //
  // Filter against the INCOMING selection as well as the one we hold: on an external sync (the
  // hydration case below) `selectedTagsStack` is still the pre-sync value at this point, so
  // filtering by it alone left the freshly selected values sitting in the dropdown as if they
  // were still available to add.
  useEffect(() => {
    const selectedIds = new Set([
      ...selectedTagsStack.map((tag) => tag.id),
      ...Tags.filter((tag) => tag.isSelected).map((tag) => tag.id),
    ]);
    setTags(Tags.filter((tag) => !selectedIds.has(tag.id)));
  }, [tagsSignature]);

  // LOCAL PATCH (Contact Center): follow the incoming selection.
  //
  // Upstream seeded `selectedTagsStack` from `Tags` ONCE, and the effect above refreshed only the
  // AVAILABLE list — never the selection. That made the component effectively uncontrolled: on an
  // edit form, react-hook-form's `reset()` hydration lands after mount, so a person's saved emails
  // and tags rendered as an empty field. Re-sync whenever the incoming selected set differs from
  // what we hold, and mark the change as external so it isn't echoed straight back to the parent.
  const incomingSelected = Tags.filter((tag) => tag.isSelected);
  const incomingSignature = signatureOf(incomingSelected);
  const lastSyncedRef = useRef<string | null>(null);
  // Starts true so the mount pass below is swallowed — see the notify effect.
  const skipNotifyRef = useRef(true);

  useEffect(() => {
    if (lastSyncedRef.current === incomingSignature) return;
    lastSyncedRef.current = incomingSignature;
    // Already matches (we made this change ourselves) — don't re-set state, so the notify flag
    // stays untouched and the user's next real edit still reaches the parent.
    if (signatureOf(selectedTagsStack) === incomingSignature) return;
    skipNotifyRef.current = true;
    setSelectedTagsStack(
      singleSelect && incomingSelected.length > 0 ? [incomingSelected[0]] : incomingSelected,
    );
  }, [incomingSignature]);

  // Notify parent component when tags change.
  //
  // LOCAL PATCH (Contact Center): upstream fired this on MOUNT too, so an untouched field wrote
  // `[]` into the form — marking it dirty and adding an empty-array key to the request payload for
  // a value nobody entered. It also fires for a sync from the parent, which would echo the value
  // straight back. Both are skipped via the flag.
  useEffect(() => {
    if (skipNotifyRef.current) {
      skipNotifyRef.current = false;
      return;
    }
    onTagsChange?.(selectedTagsStack);
  }, [selectedTagsStack]);

  // Filter tags based on search input
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTags.toLowerCase()),
  );

  // Filter selected tags based on search input
  const filteredSelectedTags =
    searchTags.length > 0
      ? selectedTagsStack.filter((tag) => tag.name.toLowerCase().includes(searchTags.toLowerCase()))
      : selectedTagsStack;

  const handleSelectTag = (id: string) => {
    const tagToSelect = tags.find((tag) => tag.id === id);
    if (tagToSelect) {
      // If in single select mode, replace the current selection
      if (singleSelect) {
        // Move any currently selected tag back to available tags
        if (selectedTagsStack.length > 0) {
          const currentSelected = selectedTagsStack[0];
          setTags((prev) => [...prev, { ...currentSelected, isSelected: false }]);
        }
        setSelectedTagsStack([{ ...tagToSelect, isSelected: true }]);
        setTags((prev) => prev.filter((tag) => tag.id !== id));
      } else {
        // Multi-select behavior (original)
        setSelectedTagsStack((prev) => [...prev, { ...tagToSelect, isSelected: true }]);
        setTags((prev) => prev.filter((tag) => tag.id !== id));
      }
    }
    filterTagsBySearch("");
    setFocusedPopoverIndex(null);
  };

  const handleUnselectTag = (id: string) => {
    const tagToUnselect = selectedTagsStack.find((tag) => tag.id === id);
    if (tagToUnselect) {
      setSelectedTagsStack((prev) => prev.filter((tag) => tag.id !== id));
      setTags((prev) => [...prev, { ...tagToUnselect, isSelected: false }]);
    }
    setFocusedTagIndex(null);
  };

  /**
   * LOCAL PATCH (Contact Center): turn typed text into a selected tag.
   *
   * Upstream had no way in but `handleSelectTag(id)` against the fixed `Tags` list, so a free-text
   * list (a person's emails, an organization's aliases) could not be expressed as a badge field at
   * all — which is why those lists were built as one-column tables instead. Matching an existing
   * tag by name selects it rather than creating a duplicate; the id IS the text, so a value the
   * caller round-trips keeps a stable identity.
   */
  const handleCreateTag = (rawName: string) => {
    const name = rawName.trim();
    if (!name) return;
    const sameName = (tag: Tag) => tag.name.toLowerCase() === name.toLowerCase();

    // Already chosen — just clear the box so the user sees their text was accepted.
    if (selectedTagsStack.some(sameName)) {
      filterTagsBySearch("");
      return;
    }
    // Offered in the list — select it instead of creating a look-alike.
    const existing = tags.find(sameName);
    if (existing) {
      handleSelectTag(existing.id);
      return;
    }

    const created: Tag = { id: name, name, value: name, isSelected: true };
    setSelectedTagsStack((prev) => (singleSelect ? [created] : [...prev, created]));
    filterTagsBySearch("");
    setFocusedPopoverIndex(null);
  };

  // Reset the hook state with new data
  const reset = (newTags: Tag[] = [], newSelectedTags: Tag[] = []) => {
    // In single select mode, ensure we only have at most one selected tag
    const selectedTags =
      singleSelect && newSelectedTags.length > 0 ? [newSelectedTags[0]] : newSelectedTags;

    setTags(newTags);
    setSelectedTagsStack(selectedTags);
    filterTagsBySearch("");
    setFocusedTagIndex(null);
    setFocusedPopoverIndex(null);
  };

  const handleNavigationWithinSelectedTags = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setFocusedTagIndex((prev: number | null) =>
        prev === 0 ? selectedTagsStack.length - 1 : prev! - 1,
      );
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setFocusedTagIndex((prev: number | null) =>
        prev === selectedTagsStack.length - 1 ? 0 : prev! + 1,
      );
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      const tagToRemove = selectedTagsStack[focusedTagIndex!];
      handleUnselectTag(tagToRemove.id);
      if (selectedTagsStack.length > 1) {
        setFocusedTagIndex(Math.min(focusedTagIndex!, selectedTagsStack.length - 2));
      } else {
        setFocusedTagIndex(null);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setFocusedTagIndex(null);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsPopoverOpen(true);
      setFocusedPopoverIndex(0);
      setFocusedTagIndex(null);
    } else {
      inputRef?.current?.focus();
    }
  };

  const handleNavigationWithinPopover = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (focusedPopoverIndex === 0 || focusedPopoverIndex === null) {
        if (selectedTagsStack.length > 0) {
          setIsPopoverOpen(false);
          setFocusedTagIndex(0);
          setFocusedPopoverIndex(null);
        } else {
          setFocusedPopoverIndex(filteredTags.length - 1);
        }
      } else {
        setFocusedPopoverIndex((prev) => (prev === null ? 0 : prev - 1));
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedPopoverIndex((prev) =>
        prev === null ? 0 : prev === filteredTags.length - 1 ? 0 : prev + 1,
      );
    } else if (e.key === "Enter" && focusedPopoverIndex !== null) {
      e.preventDefault();
      handleSelectTag(filteredTags[focusedPopoverIndex].id);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsPopoverOpen(false);
      setFocusedPopoverIndex(null);
    } else {
      inputRef?.current?.focus();
    }
  };

  const handleInitialFocus = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && selectedTagsStack.length > 0) {
      e.preventDefault();
      setFocusedTagIndex(e.key === "ArrowLeft" ? selectedTagsStack.length - 1 : 0);
    } else if (e.key === "ArrowDown" && !isPopoverOpen && filteredTags.length > 0) {
      e.preventDefault();
      setIsPopoverOpen(true);
      setFocusedPopoverIndex(0);
    } else {
      inputRef?.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (focusedTagIndex !== null && !isPopoverOpen) {
      handleNavigationWithinSelectedTags(e);
    } else if (isPopoverOpen && filteredTags.length > 0) {
      handleNavigationWithinPopover(e);
    } else {
      handleInitialFocus(e);
    }
  };

  return {
    tags,
    selectedTagsStack,
    searchTags,
    handleSelectTag,
    handleUnselectTag,
    // LOCAL PATCH (Contact Center) — see above.
    handleCreateTag,
    creatable,
    handleKeyDown,
    setFocusedTagIndex,
    setFocusedPopoverIndex,
    filterTagsBySearch,
    filteredTags,
    filteredSelectedTags,
    focusedTagIndex,
    focusedPopoverIndex,
    isPopoverOpen,
    setIsPopoverOpen,
    reset,
    singleSelect,
  };
};
