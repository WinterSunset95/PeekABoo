import React from 'react';

interface ListVertProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const ListVert = <T,>({ items, renderItem }: ListVertProps<T>) => {
  return (
    <div className="space-y-4">
      {items.map((item) => renderItem(item))}
    </div>
  );
};

export default ListVert;
