import ListItem from "./ListItem";
import { useState, useEffect } from "react";

export default function List({
  items,
  selectedItem,
  menuOptions,
  onSelect,
  emptyMessage = "No items",
}) {
  if (items.length === 0) return <div className="italic">{emptyMessage}</div>;

  return (
    <ul className="flex flex-col gap-2 overflow-x-hidden">
      {items.map((item) => (
        <ListItem
          key={item.id}
          clickHandler={onSelect}
          item={item}
          isActive={item.id === selectedItem?.id}
          options={menuOptions}
        />
      ))}
    </ul>
  );
}
