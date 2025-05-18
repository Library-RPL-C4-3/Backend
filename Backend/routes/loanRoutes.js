const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");

router.post("/borrow", loanController.borrowBook);
router.post("/return/:id", loanController.returnBook);

module.exports = router;
