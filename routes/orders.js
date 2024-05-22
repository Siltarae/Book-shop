const express = require("express");
const router = express.Router();

router.use(express.json());

router
  .route("/")
  // 결제하기
  .post((req, res) => {
    res.json("결제하기");
  })
  // 주문 목록 조회
  .get((req, res) => {
    res.json("주문 목록 조회");
  });

router
  .route("/:id")
  // 주문 상세 조회
  .get((req, res) => {
    res.json("주문 상세 조회");
  });
module.exports = router;
