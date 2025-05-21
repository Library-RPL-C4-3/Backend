const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post("/borrow", authenticateToken, loanController.borrowBook);
router.post("/return/:id", authenticateToken, loanController.returnBook);
router.get("/", authenticateToken, loanController.getAllLoans);


module.exports = router;
