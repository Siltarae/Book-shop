const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const ensureAuthorization = require("../auth");

const addToCart = (req, res) => {
  const { bookId, quantity } = req.body;

  const authorization = ensureAuthorization(req, res);
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
    const sql =
      "INSERT INTO cartItems (book_id,quantity, user_id) VALUES (?, ?, ?);";
    const values = [bookId, quantity, userId];

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    });
  }
};

const getCartItems = (req, res) => {
  const { selected } = req.body;

  const authorization = ensureAuthorization(req, res);
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
    let sql = `SELECT cartItem_id, cartItems.book_id,title,summary,quantity,price
    FROM cartItems LEFT JOIN books 
    ON cartItems.book_id=books.book_id 
    WHERE cartItems.user_id = ?`;
    const values = [userId];
    if (selected && selected?.length) {
      sql += ` AND cartItem_id IN (?);`;
      values.push(selected);
    }
    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    });
  }
};

const deleteCartItem = (req, res) => {
  const authorization = ensureAuthorization(req);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요" });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "잘못된 토큰 입니다." });
  } else {
    const cartItemId = req.params.id;

    const sql = "DELETE FROM cartItems WHERE cartItem_id = ?;";
    conn.query(sql, cartItemId, (err, results) => {
      s;
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    });
  }
};

module.exports = { addToCart, getCartItems, deleteCartItem };
