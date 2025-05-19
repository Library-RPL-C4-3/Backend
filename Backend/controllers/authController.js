const authService = require("../services/authService");

class AuthController {
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      res.status(200).json({ success: true, message: "Login berhasil", data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
