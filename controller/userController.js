const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const crypto = require("crypto");

function makeSalt() {
  return crypto.randomBytes(10).toString("base64");
}

function makeHashPassword(password, salt) {
  return crypto
    .pbkdf2Sync(password, salt, 5321, 32, "sha512")
    .toString("base64");
}

const join = (req, res) => {
  let { email, password } = req.body;

  const salt = makeSalt();
  const hashPassword = makeHashPassword(password, salt);

  const sql = `INSERT INTO users (email, password, salt) VALUES (?, ?, ?)`;
  const values = [email, hashPassword, salt];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users Where email = ?";
  const values = [email, password];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    let loginUser = results[0];
    const rawPassword = makeHashPassword(password, loginUser.salt);

    if (loginUser && loginUser.password === rawPassword) {
      const token = jwt.sign(
        {
          email: loginUser.email,
        },
        config.jwt.privateKey,
        { expiresIn: "5m", issuer: "SilTaRae" }
      );

      res.cookie("token", token, { httpOnly: true });

      console.log(token);

      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "아이디 또는 비밀번호가 일치하지 않습니다.",
      });
    }
  });
};

const resetPasswordRequest = (req, res) => {
  const { email } = req.body;
  const sql = "SELECT * FROM users Where email = ?";
  const values = [email];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const user = results[0];
    if (user) {
      return res.status(StatusCodes.OK).json({ email: email });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const resetPassword = (req, res) => {
  const { email, password } = req.body;

  const salt = makeSalt();
  const hashPassword = makeHashPassword(password, salt);

  const sql = "UPDATE users SET password = ? , salt = ? WHERE email = ?";
  const values = [hashPassword, salt, email];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.affectedRows === 0) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  join,
  login,
  resetPasswordRequest,
  resetPassword,
};
