import React from 'react';
import { IonList } from "@ionic/react";

interface ListVertProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const ListVert = <T,>({ items, renderItem }: ListVertProps<T>) => {
  return (
    <IonList style={{ padding: "0.5rem" }}>
      {items.map((item) => renderItem(item))}
    </IonList>
  );
};

export default ListVert;
