import React from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";

const MenuItem = ({ text, selected }) => {
  return (
    <div className={`scroll_menu_item ${selected ? "active" : ""}`}>
      {`${text} ml`}
    </div>
  );
};


const Menu = (listItem, selected) =>
  listItem.map((element) => {
    return <MenuItem text={element} key={element} selected={selected} />;
  });

export const Move = ({ listItem, selected, diffAmountSelected }) => {
  return (
    <div>
      <ScrollMenu
        data={Menu(listItem, selected)}
        selected={selected}
        onSelect={diffAmountSelected}
        scrollToSelected={true}
        inertiaScrolling={true}
      />
    </div>
  );
};
