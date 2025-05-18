const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");

router.get("/", memberController.getAllMembers);
router.post("/", memberController.createMember);
router.put("/:nim", memberController.updateMember);
router.delete("/:nim", memberController.deleteMember);
<<<<<<< HEAD
=======
router.get("/search", memberController.searchMembers);

>>>>>>> 847180b (feat(book,member): adding feature to search book,search member and get book by category id)

module.exports = router;
