const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const privatekey = require("../config/config").jwt.privateKey;

function ensureAuthorization(req) {
  let recevedJWT = req.headers["authorization"];
  console.log("recevedJWT : ", recevedJWT);

  let decodedJWT = jwt.verify(recevedJWT, privatekey);

  return decodedJWT;
}

const addLike = (req, res) => {
  const bookId = req.params.id;

  const authorization = ensureAuthorization(req);
  const userId = authorization.id;

  const sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?);";
  const values = [userId, bookId];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

const removeLike = (req, res) => {
  const bookId = req.params.id;

  const authorization = ensureAuthorization(req);
  const userId = authorization.id;

  const sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;";
  const values = [userId, bookId];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  addLike,
  removeLike,
};
