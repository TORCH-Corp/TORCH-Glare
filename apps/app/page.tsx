'use client'
import { BadgeField } from '@/components/BadgeField';
import { Tag } from '@/hooks/useTagSelection';


export default function page() {

  const tags: Tag[] = [
    { id: '1', name: 'Electronics', isSelected: true, variant: 'blue', value: 'Electronics', live: false },
    { id: '2', name: 'Books', isSelected: false, variant: 'green', value: 'Books', live: false },
    { id: '3', name: 'Clothing', isSelected: false, variant: 'purple', value: 'Clothing', live: false },
    { id: '4', name: 'Home', isSelected: false, variant: 'yellow', value: 'Home', live: false },
    { id: '5', name: 'Sports', isSelected: false, variant: 'navy', value: 'Sports', live: false },
    { id: '8', name: 'Limited Edition', isSelected: false, variant: 'cocktailGreen', value: 'Limited Edition', live: false },
  ];
  return (
    <div className="p-4 w-full flex flex-col gap-2">
      <BadgeField
        size="M"
        placeholder="Add product tags..."
        tags={tags}
        onValueChange={(tags) => {
          console.log(tags)
        }}
      />
    </div>
  );
};

