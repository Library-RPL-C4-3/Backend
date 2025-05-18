const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.get("/", bookController.getAllBooks);
router.post("/", bookController.createBook);
router.put("/:id", bookController.updateBook);
router.delete("/:id", bookController.deleteBook);
<<<<<<< HEAD
=======
router.get("/search", bookController.searchBooks);
router.get("/category/:id", bookController.getBooksByCategory);

>>>>>>> 847180b (feat(book,member): adding feature to search book,search member and get book by category id)

module.exports = router;
