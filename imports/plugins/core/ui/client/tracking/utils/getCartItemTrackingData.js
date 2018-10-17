import { Router } from "/client/api";
import { Tags } from "/lib/collections";

/**
 * @name getCartItemTrackingData
 * @summary Transforms a CartItem object into a partial representation of the Segment product schema
 * @param {Object} cartItem Object of the `CartItem` type
 * @param {String} [cartId] _id of user's cart
 * @returns {Object} Data suitable for tracking a `CartItem`
 */
export default function getCartItemTrackingData(cartItem, cartId) {
  let tag;
  if (cartItem.productTagIds && cartItem.productTagIds.length) {
    // Use first tag as category
    tag = Tags.findOne({ _id: cartItem.productTagIds[0] });
  }

  const { variantId, sku, title, productVendor, variantTitle, priceWhenAdded, quantity, productSlug } = cartItem;

  // Include cart_id in returned data if provided
  const cartIdObj = {};
  if (cartId) {
    cartIdObj.cart_id = cartId; // eslint-disable-line camelcase
  }
  return {
    ...cartIdObj,
    product_id: variantId, // eslint-disable-line camelcase
    sku,
    category: (tag && tag.name) || undefined,
    name: title,
    brand: productVendor,
    variant: variantTitle,
    price: priceWhenAdded && priceWhenAdded.amount,
    quantity,
    url: Router.pathFor("product", { hash: { handle: productSlug } })
  };
}
