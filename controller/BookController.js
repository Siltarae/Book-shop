const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const searchBooks = (req, res) => {
  let { category_id, news, limit, currentPage } = req.query;
  let values = [];

  news = news === "true";

  let sql =
    "SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id=books.book_id) AS likes FROM books";

  if (category_id || news) {
    sql += " WHERE";

    if (category_id) {
      category_id = parseInt(category_id);
      sql += " category_id = ?";
      values.push(category_id);
      if (news) {
        sql += " AND";
      }
    }

    if (news) {
      sql += ` pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW()`;
    }
  }

  if (limit && currentPage) {
    limit = parseInt(limit);
    currentPage = parseInt(currentPage);
    const offset = limit * (currentPage - 1);

    if (currentPage < 1) {
      currentPage = 1;
    }
    sql += ` LIMIT ? OFFSET ?`;
    values.push(limit, offset);
  }

  conn.query(sql, values, (err, results) => {
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
};

const getBookById = (req, res) => {
  let { user_id } = req.body;
  let book_id = req.params.id;
  console.log(book_id);
  book_id = parseInt(book_id);

  const sql = `SELECT *,
  (SELECT count(*) FROM likes WHERE liked_book_id=books.book_id) AS likes,
  (SELECT EXISTS(SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked 
  FROM books
  LEFT JOIN category On books.category_id=category.category_id
  WHERE books.book_id = 1`;

  const values = [user_id, book_id, book_id];

  conn.query(sql, values, (err, results) => {
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
