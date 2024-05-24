const express = require("express");
const router = express.Router();
const { searchBooks, getBookById } = require("../controller/BookController");

router.use(express.json());

router.get("/", searchBooks);

router.get("/:id", getBookById);

module.exports = router;
