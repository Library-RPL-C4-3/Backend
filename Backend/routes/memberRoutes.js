const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, memberController.getAllMembers);
router.post("/", authenticateToken, memberController.createMember);
router.put("/:nim", authenticateToken, memberController.updateMember);
router.delete("/:nim", authenticateToken, memberController.deleteMember);
router.get("/search", authenticateToken, memberController.searchMembers);
router.get("/:nim/detail", authenticateToken, memberController.getMemberDetail);



module.exports = router;
