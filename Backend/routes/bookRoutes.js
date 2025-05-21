const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, bookController.getAllBooks);
router.post("/", authenticateToken, bookController.createBook);
router.put("/:id", authenticateToken, bookController.updateBook);
router.delete("/:id", authenticateToken, bookController.deleteBook);
router.get("/search", authenticateToken, bookController.searchBooks);
router.get("/category/:id", authenticateToken, bookController.getBooksByCategory);


module.exports = router;
