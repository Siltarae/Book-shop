const conn = require("../mariadb").promise();
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const ensureAuthorization = require("../auth");

const order = async (req, res) => {
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
    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } =
      req.body;

    let sql =
      "INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?);";
    let values = [delivery.address, delivery.receiver, delivery.contact];

    let deliveryId;

    let orderId;

    let [results] = await conn.execute(sql, values);
    deliveryId = results.insertId;

    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
  VALUES (?, ?, ?, ?, ?);`;

    values = [firstBookTitle, totalQuantity, totalPrice, userId, deliveryId];

    [results] = await conn.execute(sql, values);
    orderId = results.insertId;

    // items를 가지고, 장바구니에서 book_id와 quantity 조회
    sql = `SELECT book_id, quantity FROM cartItems WHERE cartItem_id IN (?)`;

    let [orderItems] = await conn.query(sql, [items]);

    sql = `INSERT INTO orderedBook (order_id, book_id, quantity)
  VALUES ?;`;

    values = [];

    orderItems.forEach((item) => {
      values.push([orderId, item.book_id, item.quantity]);
    });

    [results] = await conn.query(sql, [values]);

    let result = await deleteCartItems(conn, items);

    return res.status(StatusCodes.OK).json(result);
  }
};

const deleteCartItems = async (conn, items) => {
  let sql = `DELETE FROM cartItems WHERE cartItem_id IN (?)`;

  let [results] = await conn.query(sql, [items]);
  return results;
};

const getOrders = async (req, res) => {
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
    sql = `SELECT order_id,created_at,address,receiver,contact, book_title, total_price ,total_quantity
  FROM orders
  LEFT JOIN delivery
  ON orders.delivery_id = delivery.delivery_id`;

    let [results] = await conn.query(sql);

    return res.status(StatusCodes.OK).json(results);
  }
};

const getOrderDetail = async (req, res) => {
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
    const orderId = req.params.id;

    sql = `SELECT orderedBook.book_id,title as book_title,author,price,quantity
  FROM orderedBook
  LEFT JOIN books
  ON orderedBook.book_id = books.book_id
  WHERE orderedBook.order_id = ?`;

    let [results] = await conn.query(sql, orderId);

    return res.status(StatusCodes.OK).json(results);
  }
};

module.exports = { order, getOrders, getOrderDetail };
