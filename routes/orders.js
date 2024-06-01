const express = require("express");
const {
  order,
  getOrders,
  getOrderDetail,
} = require("../controller/OrderController");
const router = express.Router();

router.use(express.json());

router
  .route("/")
  // 결제하기
  .post(order)
  // 주문 목록 조회
  .get(getOrders);

router
  .route("/:id")
  // 주문 상세 조회
  .get(getOrderDetail);
module.exports = router;
