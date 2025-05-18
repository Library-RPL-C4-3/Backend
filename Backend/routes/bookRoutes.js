const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.get("/", bookController.getAllBooks);
router.post("/", bookController.createBook);
router.put("/:id", bookController.updateBook);
router.delete("/:id", bookController.deleteBook);
router.get("/search", bookController.searchBooks);
router.get("/category/:id", bookController.getBooksByCategory);


module.exports = router;
