const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");

router.post("/borrow", loanController.borrowBook);
router.post("/return/:id", loanController.returnBook);
router.get("/", loanController.getAllLoans);


module.exports = router;
