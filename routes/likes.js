const express = require("express");
const router = express.Router();

router.use(express.json());

router
  .route("/:id")
  //좋아요 추가
  .post((req, res) => {
    res.json("좋아요 추가");
  })
  //좋아요 삭제
  .delete((req, res) => {
    res.json("좋아요 삭제");
  });

module.exports = router;
