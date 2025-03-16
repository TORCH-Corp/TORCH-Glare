'use client';
import { useState, useEffect } from "react";

export function useActiveTreeItem(itemIds: string[]) {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        if (!itemIds || itemIds.length === 0) {
            console.warn("No itemIds provided to useActiveTreeItem.");
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                let mostVisibleEntry: any = null;

                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Track the most visible entry (highest intersection ratio)
                        if (
                            !mostVisibleEntry ||
                            entry.intersectionRatio > mostVisibleEntry.intersectionRatio
                        ) {
                            mostVisibleEntry = entry;
                        }
                    }
                });

                if (mostVisibleEntry) {
                    setActiveId(mostVisibleEntry.target.id);
                }
            },
            {
                rootMargin: '-10% 0% -5% 0%', // Adjust based on your layout
                threshold: [0, 0.25, 0.5, 0.75, 1], // Multiple thresholds for better accuracy
            }
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