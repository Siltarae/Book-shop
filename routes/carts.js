const express = require("express");
const router = express.Router();

router.use(express.json());

router
  .route("/")
  //장바구니 담기
  .post((req, res) => {
    res.json("장바구니 담기");
  })
  //장바구니 조회
  .get((req, res) => {
    res.json("장바구니 조회");
  });
//장바구니 도서 삭제

router.delete("/:id", (req, res) => {
  res.json("장바구니 도서 삭제");
});
//장바구니에서 선택한 상품 목록 조회
// .get((req, res) => {
//   res.json("장바구니 조회");
//   })
module.exports = router;
