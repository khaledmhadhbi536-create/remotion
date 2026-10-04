// Everything a marketer would want to change without touching the animation code.
export const STORE_NAME = "AURA BIO"; // brand on the products — replace if your page has another name
export const WEBSITE = ""; // ← your page, site or WhatsApp number (empty = "send us a message")

// 5-piece pack pricing (TND). See PLAN-MARKETING.md for the reasoning.
export const PRICES = {
  dermaRoller: 35,
  rosemaryOil: 25,
  applicator: 15,
  sidr: 15,
  brush: 20,
  pack: 79,
};
export const PACK_PIECES = 5;
export const VALUE_TOTAL =
  PRICES.dermaRoller +
  PRICES.rosemaryOil +
  PRICES.applicator +
  PRICES.sidr +
  PRICES.brush; // 110
