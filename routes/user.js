const express = require("express");
const router = express.Router();
const {
  join,
  login,
  resetPasswordRequest,
  resetPassword,
} = require("../controller/UserController");

router.use(express.json());

//회원가입
router.post("/join", join);

//로그인
router.post("/login", login);

router
  .route("/reset")
  //비밀번호 초기화 요청
  .post(resetPasswordRequest)
  //비밀번호 초기화
  .put(resetPassword);

module.exports = router;
