import { useState, useEffect } from "react";

export interface Tag {
    id: string;
    name: string;
    variant?: string;
    value?: string;
    isSelected: boolean;
    [key: string]: any;
}

export const useTagSelection = ({
    Tags,
    onTagsChange,
    inputRef
}: {
    Tags: Tag[],
    onTagsChange?: (selectedTags: Tag[]) => void,
    inputRef?: React.RefObject<HTMLInputElement | null>
}) => {
    // Initialize with available tags (excluding any initially selected ones)
    const [tags, setTags] = useState<Tag[]>(Tags);

    // Initialize with any pre-selected tags
    const [selectedTagsStack, setSelectedTagsStack] = useState<Tag[]>([]);
    const [searchTags, filterTagsBySearch] = useState('');
    const [focusedTagIndex, setFocusedTagIndex] = useState<number | null>(null);
    const [focusedPopoverIndex, setFocusedPopoverIndex] = useState<number | null>(null);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    // Update internal state when Tags prop changes
    useEffect(() => {
        // Only update if the Tags array reference has changed
        const selectedIds = selectedTagsStack.map(tag => tag.id);
        setTags(Tags.filter(tag => !selectedIds.includes(tag.id)));
    }, [Tags]);

    // Notify parent component when tags change
    useEffect(() => {
        if (onTagsChange) {
            onTagsChange(selectedTagsStack);
        }
    }, [selectedTagsStack]);

    // Filter tags based on search input
    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchTags.toLowerCase())
    );

    const handleSelectTag = (id: string) => {
        const tagToSelect = tags.find(tag => tag.id === id);
        if (tagToSelect) {
            setSelectedTagsStack(prev => [...prev, { ...tagToSelect, isSelected: true }]);
            setTags(prev => prev.filter(tag => tag.id !== id));
        }
        filterTagsBySearch('');
        setFocusedPopoverIndex(null);
    };

    const handleUnselectTag = (id: string) => {
        const tagToUnselect = selectedTagsStack.find(tag => tag.id === id);
        if (tagToUnselect) {
            setSelectedTagsStack(prev => prev.filter(tag => tag.id !== id));
            setTags(prev => [...prev, { ...tagToUnselect, isSelected: false }]);
        }
        setFocusedTagIndex(null);
    };

    // Reset the hook state with new data
    const reset = (newTags: Tag[] = [], newSelectedTags: Tag[] = []) => {
        setTags(newTags);
        setSelectedTagsStack(newSelectedTags);
        filterTagsBySearch('');
        setFocusedTagIndex(null);
        setFocusedPopoverIndex(null);
    };

    const handleNavigationWithinSelectedTags = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setFocusedTagIndex((prev: any) => (prev === 0 ? selectedTagsStack.length - 1 : prev - 1));
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            setFocusedTagIndex((prev: any) => (prev === selectedTagsStack.length - 1 ? 0 : prev + 1));
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
            e.preventDefault();
            const tagToRemove = selectedTagsStack[focusedTagIndex!];
            handleUnselectTag(tagToRemove.id);
            if (selectedTagsStack.length > 1) {
                setFocusedTagIndex(Math.min(focusedTagIndex!, selectedTagsStack.length - 2));
            } else {
                setFocusedTagIndex(null);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setFocusedTagIndex(null);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setIsPopoverOpen(true);
            setFocusedPopoverIndex(0);
            setFocusedTagIndex(null);
        } else {
            inputRef?.current?.focus();
        }
    };

    const handleNavigationWithinPopover = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'ArrowUp') {
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
                setFocusedPopoverIndex(prev => (prev === null ? 0 : prev - 1));
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedPopoverIndex(prev =>
                prev === null ? 0 : (prev === filteredTags.length - 1 ? 0 : prev + 1)
            );
        } else if (e.key === 'Enter' && focusedPopoverIndex !== null) {
            e.preventDefault();
            handleSelectTag(filteredTags[focusedPopoverIndex].id);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsPopoverOpen(false);
            setFocusedPopoverIndex(null);
        } else {
            inputRef?.current?.focus();
        }
    };

    const handleInitialFocus = (e: React.KeyboardEvent<HTMLElement>) => {
        if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && selectedTagsStack.length > 0) {
            e.preventDefault();
            setFocusedTagIndex(e.key === 'ArrowLeft' ? selectedTagsStack.length - 1 : 0);
        } else if (e.key === 'ArrowDown' && !isPopoverOpen && filteredTags.length > 0) {
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
        handleKeyDown,
        setFocusedTagIndex,
        setFocusedPopoverIndex,
        filterTagsBySearch,
        filteredTags,
        focusedTagIndex,
        focusedPopoverIndex,
        isPopoverOpen,
        setIsPopoverOpen,
        reset
    };
};

