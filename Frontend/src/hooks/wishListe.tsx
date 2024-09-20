interface WishlistItem {
  id: number;
  name: string;
}

export function putWishList(object: WishlistItem) {
  let items = localStorage.getItem("wishlist");

  if (items) {
    let itemsArray = JSON.parse(items);
    itemsArray.push(object);

    localStorage.setItem("wishlist", JSON.stringify(itemsArray));
  } else {
    localStorage.setItem("wishlist", JSON.stringify([object]));
  }
}

export function getWishListItems(): Array<{ id: number; name: string }> {
  const items = localStorage.getItem("wishlist");
  return items ? JSON.parse(items) : [];
}
