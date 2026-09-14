"use client";
import { useState, useEffect } from "react";

export function useActiveTreeItem(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    // An empty list is a legitimate answer — a page with no Quick Nav has nothing to track. Only a
    // missing list is a caller mistake worth a warning.
    if (!itemIds) {
      console.warn("No itemIds provided to useActiveTreeItem.");
      return;
    }
    if (itemIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisibleEntry: IntersectionObserverEntry | null = null;

        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Track the most visible entry (highest intersection ratio)
            if (!mostVisibleEntry || entry.intersectionRatio > mostVisibleEntry.intersectionRatio) {
              mostVisibleEntry = entry;
            }
          }
        }

        if (mostVisibleEntry) {
          setActiveId(mostVisibleEntry.target.id);
        }
      },
      {
        rootMargin: "-10% 0% -5% 0%", // Adjust based on your layout
        threshold: [0, 0.25, 0.5, 0.75, 1], // Multiple thresholds for better accuracy
      },
    );

    // Observe all elements
    itemIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      } else {
        console.warn(`Element with id "${id}" not found.`);
      }
    });

    // Cleanup observer
    return () => {
      itemIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [itemIds]);

  return { activeId };
}
