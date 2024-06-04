const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const ensureAuthorization = require("../auth");
const jwt = require("jsonwebtoken");

const addLike = (req, res) => {
  const bookId = req.params.id;

  const authorization = ensureAuthorization(req);
  const userId = authorization.id;

  if (authorization instanceof jwt.TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요" });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "잘못된 토큰 입니다." });
  } else {
    const sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?);";
    const values = [userId, bookId];
    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    });
  }
};

const removeLike = (req, res) => {
  const bookId = req.params.id;

  const authorization = ensureAuthorization(req);
  const userId = authorization.id;

  if (authorization instanceof jwt.TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요" });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "잘못된 토큰 입니다." });
  } else {
    const sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;";
    const values = [userId, bookId];
    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    });
  }
};

module.exports = {
  addLike,
  removeLike,
};
