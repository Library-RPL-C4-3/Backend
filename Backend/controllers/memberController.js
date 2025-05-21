const memberService = require("../services/memberService");

class MemberController {
  static async getAllMembers(req, res, next) {
    try {
      const members = await memberService.getAllMembers();
      res.status(200).json({ success: true, data: members });
    } catch (err) {
      next(err);
    }
  }

  static async createMember(req, res, next) {
    try {
      const member = await memberService.createMember(req.body);
      res.status(201).json({ success: true, data: member });
    } catch (err) {
      next(err);
    }
  }

  static async updateMember(req, res, next) {
    try {
      const member = await memberService.updateMember(req.params.nim, req.body);
      res.status(200).json({ success: true, data: member });
    } catch (err) {
      next(err);
    }
  }

  static async deleteMember(req, res, next) {
    try {
      await memberService.deleteMember(req.params.nim);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  static async searchMembers(req, res, next) {
    try {
      const members = await memberService.searchMembers(req.query.q || "");
      res.status(200).json({ success: true, data: members });
    } catch (err) {
      next(err);
    }
  }

  static async getMemberDetail(req, res, next) {
    try {
      const data = await memberService.getMemberDetail(req.params.nim);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }


}

module.exports = MemberController;
