const loanService = require("../services/loanService");

class LoanController {
  static async borrowBook(req, res, next) {
    try {
      const result = await loanService.borrowBook(req.body);
      res.status(201).json({ success: true, message: "Buku berhasil dipinjam", data: result });
    } catch (err) {
      next(err);
    }
  }

  static async returnBook(req, res, next) {
    try {
      const result = await loanService.returnBook(req.params.id);
      res.status(200).json({ success: true, message: "Buku berhasil dikembalikan", data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LoanController;
