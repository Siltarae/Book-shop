const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const searchBooks = (req, res) => {
  const query = req.query;
  const hasQuery = Object.keys(query).length > 0;

  if (hasQuery) {
    let { category_id } = query;
    category_id = parseInt(category_id);
    let sql = "SELECT * FROM books WHERE category_id = ?";

    conn.query(sql, category_id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      const hasBooks = results.length > 0;
      if (hasBooks) {
        return res.status(StatusCodes.OK).json(results);
      } else {
        return res.status(StatusCodes.NOT_FOUND).end();
      }
    });
  } else {
    const sql = "SELECT * FROM books";
    conn.query(sql, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    });
  }
};

const getBookById = (req, res) => {
  let { id } = req.params;
  id = parseInt(id);

  const sql = "SELECT * FROM books WHERE id = ?";

  conn.query(sql, id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const book = results[0];

    if (book) {
      return res.status(StatusCodes.OK).json(book);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

module.exports = {
  searchBooks,
  getBookById,
};
