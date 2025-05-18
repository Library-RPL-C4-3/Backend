const bookService = require("../services/bookService");
const ApiError = require("../errors/apiError");

class BookController {
  static async getAllBooks(req, res, next) {
    try {
      const books = await bookService.getAllBooks();
      res.status(200).json({ success: true, data: books });
    } catch (err) {
      next(err);
    }
  }

  static async createBook(req, res, next) {
    try {
      const book = await bookService.createBook(req.body);
      res.status(201).json({ success: true, data: book });
    } catch (err) {
      next(err);
    }
  }

  static async updateBook(req, res, next) {
    try {
      const book = await bookService.updateBook(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: book,
      });
    } catch (err) {
      next(err);
    }
  }


  static async deleteBook(req, res, next) {
    try {
      await bookService.deleteBook(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
<<<<<<< HEAD
=======

  static async searchBooks(req, res, next) {
    try {
      const books = await bookService.searchBooks(req.query.q || "");
      res.status(200).json({ success: true, data: books });
    } catch (err) {
      next(err);
    }
  }

  static async getBooksByCategory(req, res, next) {
    try {
      const books = await bookService.getBooksByCategory(req.params.id);
      res.status(200).json({ success: true, data: books });
    } catch (err) {
      next(err);
    }
  }

>>>>>>> 847180b (feat(book,member): adding feature to search book,search member and get book by category id)
}

module.exports = BookController;
