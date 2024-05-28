const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const addToCart = (req, res) => {
  const { book_id, quantity, user_id } = req.body;

  const sql =
    "INSERT INTO cartItems (book_id,quantity, user_id) VALUES (?, ?, ?);";
  const values = [book_id, quantity, user_id];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

const getCartItems = (req, res) => {
  const { user_id, selected } = req.body;
  let sql = `SELECT cartItem_id, cartItems.book_id,title,summary,quantity,price
  FROM cartItems LEFT JOIN books 
  ON cartItems.book_id=books.book_id 
  WHERE cartItems.user_id = ?`;

  const values = [user_id];

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
};

const deleteCartItem = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM cartItems WHERE cartItem_id = ?;";
  conn.query(sql, id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { addToCart, getCartItems, deleteCartItem };
