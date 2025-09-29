import React from 'react';

interface ListVertProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const ListVert = <T,>({ items, renderItem }: ListVertProps<T>) => {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => renderItem(item))}
    </div>
  );
};

export default ListVert;
