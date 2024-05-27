const express = require("express");
const { addLike, removeLike } = require("../controller/LikeController");
const router = express.Router();

router.use(express.json());

router
  .route("/:id")
  //좋아요 추가
  .post(addLike)
  //좋아요 삭제
  .delete(removeLike);

module.exports = router;
