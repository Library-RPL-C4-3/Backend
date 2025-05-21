const express = require("express");
const router = express.Router();
const penaltyController = require("../controllers/penaltyController");

router.post("/check-overdues", penaltyController.checkAndApplyPenalties); // Untuk manual/test

module.exports = router;
