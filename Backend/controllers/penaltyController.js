const penaltyService = require("../services/penaltyService");

class PenaltyController {
  static async checkAndApplyPenalties(req, res, next) {
    try {
      const result = await penaltyService.checkAndApplyPenalties();
      res.status(200).json({ success: true, message: "Cek denda selesai", data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PenaltyController;
