const db = require("../config/db");
const ApiError = require("../errors/apiError");

async function getAllBooks() {
  const [rows] = await db.query("SELECT * FROM books");
  return rows;
}

async function createBook(data) {
  const { title, author, category_id, stock, status } = data;
  try {
    const [result] = await db.query(
      `INSERT INTO books (title, author, category_id, stock, status, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [title, author, category_id, stock, status]
    );
    return { id: result.insertId, ...data };
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw ApiError.badRequest(`Kategori dengan ID ${category_id} tidak ditemukan`);
    }
    if (error.code === "ER_DUP_ENTRY") {
      throw ApiError.conflict("Buku sudah ada atau terdapat duplikasi");
    }
    throw ApiError.internalServerError(error.message);
  }
}

async function updateBook(id, newData) {
  // ambil data lama
  const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [id]);
  if (rows.length === 0) {
    throw ApiError.notFound(`Buku dengan id ${id} tidak ditemukan`);
  }

  const oldData = rows[0];

  //merge data baru dengan data lama
  const updatedData = {
    title: newData.title ?? oldData.title,
    author: newData.author ?? oldData.author,
    category_id: newData.category_id ?? oldData.category_id,
    stock: newData.stock ?? oldData.stock,
    status: newData.status ?? oldData.status,
  };

  // Update ke database
  const [result] = await db.query(
    `UPDATE books SET title=?, author=?, category_id=?, stock=?, status=? WHERE id=?`,
    [
      updatedData.title,
      updatedData.author,
      updatedData.category_id,
      updatedData.stock,
      updatedData.status,
      id,
    ]
  );

  if (result.affectedRows === 0) {
    throw ApiError.notFound(`Buku dengan id ${id} tidak ditemukan atau tidak ada perubahan`);
  }

  return { id, ...updatedData };
}

async function deleteBook(id) {
  const [result] = await db.query("DELETE FROM books WHERE id=?", [id]);

  if (result.affectedRows === 0) {
    throw ApiError.notFound(`Buku dengan id ${id} tidak ditemukan`);
  }
}

module.exports = {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
};
