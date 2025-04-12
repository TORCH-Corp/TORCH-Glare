'use client'
import { BadgeField, Tag } from '@/components/BadgeField';


export default function page() {

  const tags: Tag[] = [
    { id: '1', name: 'Electronics', isSelected: false, variant: 'blue', value: 'Electronics', live: false },
    { id: '2', name: 'Books', isSelected: false, variant: 'green', value: 'Books', live: false },
    { id: '3', name: 'Clothing', isSelected: false, variant: 'purple', value: 'Clothing', live: false },
    { id: '4', name: 'Home', isSelected: false, variant: 'yellow', value: 'Home', live: false },
    { id: '5', name: 'Sports', isSelected: false, variant: 'navy', value: 'Sports', live: false },
    { id: '8', name: 'Limited Edition', isSelected: false, variant: 'cocktailGreen', value: 'Limited Edition', live: false },
  ];
  return (
    <div className="p-4 w-full flex flex-col gap-2">
      <BadgeField
        size="XS"
        placeholder="Add product tags..."
        tags={tags}
        onTagChange={(tags) => {
          console.log(tags)
        }}
      />
    </div>
  );
};

