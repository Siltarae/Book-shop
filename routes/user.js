const express = require("express");
const router = express.Router();

router.use(express.json());

//회원가입
router.post("/join", (req, res) => {
  res.json("회원가입");
});

//로그인
router.post("/login", (req, res) => {
  res.json("로그인");
});

router
  .route("/reset")
  //비밀번호 초기화 요청
  .post((req, res) => {
    res.json("비밀번호 초기화 요청");
  })
  //비밀번호 초기화
  .put((req, res) => {
    res.json("비밀번호 초기화");
  });

module.exports = router;
