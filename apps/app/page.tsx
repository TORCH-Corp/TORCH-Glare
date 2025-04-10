'use client'
import { useState } from 'react';
import { BadgeField } from '@/components/BadgeField';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';


export default function page() {
  // Product tags with categories and colors
  const [tags, setTags] = useState([
    { id: '1', name: 'Electronics', isSelected: false, variant: 'blue' },
    { id: '2', name: 'Books', isSelected: false, variant: 'green' },
    { id: '3', name: 'Clothing', isSelected: false, variant: 'purple' },
    { id: '4', name: 'Home', isSelected: false, variant: 'yellow' },
    { id: '5', name: 'Sports', isSelected: false, variant: 'navy' },
    { id: '8', name: 'Limited Edition', isSelected: false, variant: 'cocktailGreen' },
  ]);

  // Separate array for selected tags (as a stack)
  const [selectedTagsStack, setSelectedTagsStack] = useState([
    { id: '6', name: 'Sale', variant: 'rose' },
    { id: '7', name: 'New Arrival', variant: 'greenLight' },
  ]);

  const [error, setError] = useState<string | undefined>(undefined);
  const [searchInput, setSearchInput] = useState('');
  const [focusedTagIndex, setFocusedTagIndex] = useState<number | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [focusedPopoverIndex, setFocusedPopoverIndex] = useState<number | null>(null);

  // Filter tags based on search input
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  // Handle selecting a tag - add to stack
  const handleSelectTag = (id: string) => {
    const tagToSelect = tags.find(tag => tag.id === id);
    if (tagToSelect) {
      // Add to selected stack
      setSelectedTagsStack(prev => [...prev, {
        id: tagToSelect.id,
        name: tagToSelect.name,
        variant: tagToSelect.variant
      }]);

      // Remove from available tags
      setTags(prev => prev.filter(tag => tag.id !== id));
    }
    setSearchInput('');
    setFocusedPopoverIndex(null);
  };

  // Handle unselecting a tag - remove from stack
  const handleUnselectTag = (id: string) => {
    const tagToUnselect = selectedTagsStack.find(tag => tag.id === id);
    if (tagToUnselect) {
      // Remove from selected stack
      setSelectedTagsStack(prev => prev.filter(tag => tag.id !== id));

      // Add back to available tags
      setTags(prev => [...prev, {
        id: tagToUnselect.id,
        name: tagToUnselect.name,
        variant: tagToUnselect.variant,
        isSelected: false
      }]);
    }
    setFocusedTagIndex(null);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Navigation within selected tags
    if (focusedTagIndex !== null && !isPopoverOpen) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusedTagIndex((prev: any) => (prev === 0 ? selectedTagsStack.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedTagIndex((prev: any) => (prev === selectedTagsStack.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        const tagToRemove = selectedTagsStack[focusedTagIndex];
        handleUnselectTag(tagToRemove.id);
        if (selectedTagsStack.length > 1) {
          setFocusedTagIndex(Math.min(focusedTagIndex, selectedTagsStack.length - 2));
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
      }
    }
    // Navigation within popover items
    else if (isPopoverOpen && filteredTags.length > 0) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (focusedPopoverIndex === 0 || focusedPopoverIndex === null) {
          // Move focus back to selected tags if available
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
      }
    }
    // Initial focus handling
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if (selectedTagsStack.length > 0) {
        e.preventDefault();
        setFocusedTagIndex(e.key === 'ArrowLeft' ? selectedTagsStack.length - 1 : 0);
      }
    } else if (e.key === 'ArrowDown' && !isPopoverOpen) {
      if (filteredTags.length > 0) {
        e.preventDefault();
        setIsPopoverOpen(true);
        setFocusedPopoverIndex(0);
      }
    }
  };

  return (
    <div className="p-4 w-full flex flex-col gap-2">
      <BadgeField
        size="M"
        variant="PresentationStyle"
        placeholder="Add product tags..."
        value={searchInput}
        onChange={(e) => { setSearchInput(e.target.value) }}
        onFocus={() => {
          setError(undefined);
          setFocusedTagIndex(null);
        }}
        onKeyDown={handleKeyDown}
        errorMessage={error}
        badgesChildren={
          <>
            {selectedTagsStack.map((tag, index) => (
              <Badge
                key={tag.id}
                size="M"
                variant={tag.variant as any}
                label={tag.name}
                isSelected={true}
                onUnselect={() => handleUnselectTag(tag.id)}
                className={focusedTagIndex === index ? "ring-2 ring-blue-500" : ""}
                tabIndex={focusedTagIndex === index ? 0 : -1}
              />
            ))}
          </>
        }
        popoverChildren={
          <>
            {filteredTags.length > 0 ? (
              filteredTags.map((tag, index) => (
                <Badge
                  key={tag.id}
                  size="M"
                  variant={tag.variant as any}
                  label={tag.name}
                  isSelected={false}
                  onClick={() => handleSelectTag(tag.id)}
                  className={`cursor-pointer ${focusedPopoverIndex === index ? "ring-2 ring-blue-500" : ""}`}
                  tabIndex={focusedPopoverIndex === index ? 0 : -1}
                />
              ))
            ) : (
              <div className="text-sm text-gray-500 py-1 px-2">
                {tags.length === 0 ? "All tags selected" : "No matching tags found"}
              </div>
            )}
          </>
        }
      />
    </div>
  );
};

