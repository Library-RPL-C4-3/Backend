const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");

router.get("/", memberController.getAllMembers);
router.post("/", memberController.createMember);
router.put("/:nim", memberController.updateMember);
router.delete("/:nim", memberController.deleteMember);
router.get("/search", memberController.searchMembers);
router.get("/:nim/detail", memberController.getMemberDetail);



module.exports = router;
