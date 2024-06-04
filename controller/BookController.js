const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const ensureAuthorization = require("../auth");

const searchBooks = (req, res) => {
  let allBooksRes = {};
  let { categoryId, news, limit, currentPage } = req.query;
  let values = [];

  news = news === "true";

  let sql =
    "SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE liked_book_id=books.book_id) AS likes FROM books";

  if (categoryId || news) {
    sql += " WHERE";

    if (categoryId) {
      categoryId = parseInt(categoryId);
      sql += " category_id = ?";
      values.push(categoryId);
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
      allBooksRes.books = results;
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });

  sql = "SELECT found_rows()";
  conn.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    let pagination = {};
    pagination.currentPage = currentPage;
    pagination.totalCount = results[0]["found_rows()"];

    allBooksRes.pagination = pagination;

    return res.status(StatusCodes.OK).json(allBooksRes);
  });
};

const getBookById = (req, res) => {
  let bookId = req.params.id;
  bookId = parseInt(bookId);

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
  } else if (authorization instanceof ReferenceError) {
    const sql = `SELECT *,
    (SELECT count(*) FROM likes WHERE liked_book_id=books.book_id) AS likes
    FROM books
    LEFT JOIN category On books.category_id=category.category_id
    WHERE books.book_id = 1`;

    const values = [bookId];

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
  } else {
    const sql = `SELECT *,
  (SELECT count(*) FROM likes WHERE liked_book_id=books.book_id) AS likes,
  (SELECT EXISTS(SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked 
  FROM books
  LEFT JOIN category On books.category_id=category.category_id
  WHERE books.book_id = 1`;

    const values = [userId, bookId, bookId];

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
  }
};

module.exports = {
  searchBooks,
  getBookById,
};
