const express = require("express");
const {
  addToCart,
  getCartItems,
  deleteCartItem,
} = require("../controller/CartController");
const router = express.Router();

router.use(express.json());

router
  .route("/")

  //장바구니 담기
  .post(addToCart)

  //장바구니 조회
  .get(getCartItems);

//장바구니 도서 삭제
router.delete("/:id", deleteCartItem);

module.exports = router;
