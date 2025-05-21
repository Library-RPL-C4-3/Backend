const db = require("../config/db");
const ApiError = require("../errors/apiError");
const dayjs = require("dayjs");

async function borrowBook({ book_id, member_nim, admin_id }) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Validasi Buku
    const [bookRows] = await conn.query("SELECT * FROM books WHERE id = ?", [book_id]);
    if (bookRows.length === 0) throw ApiError.notFound("Buku tidak ditemukan");
    const book = bookRows[0];

    if (book.stock <= 0) throw ApiError.badRequest("Stok buku habis");

    // 2. Validasi Member
    const [memberRows] = await conn.query("SELECT * FROM members WHERE nim = ?", [member_nim]);
    if (memberRows.length === 0) throw ApiError.notFound("Anggota tidak ditemukan");

    const now = dayjs();
    const loan_date = now.format("YYYY-MM-DD HH:mm:ss");
    const due_date = now.add(3, "day").hour(23).minute(0).second(0).format("YYYY-MM-DD HH:mm:ss");

    // 3. Insert Loan
    await conn.query(
      `INSERT INTO loans (member_nim, book_id, admin_id, loan_date, due_date, status) 
       VALUES (?, ?, ?, ?, ?, 'borrowed')`,
      [member_nim, book_id, admin_id, loan_date, due_date]
    );

    // 4. Update stok buku
    await conn.query("UPDATE books SET stock = stock - 1 WHERE id = ?", [book_id]);

    await conn.commit();
    return {
      book_id,
      book_title: book.title,
      member_nim,
      member_name: memberRows[0].name,
      admin_id,
      loan_date,
      due_date
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function returnBook(loan_id) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Ambil data loan
    const [rows] = await conn.query("SELECT * FROM loans WHERE id = ?", [loan_id]);
    if (rows.length === 0) throw ApiError.notFound("Peminjaman tidak ditemukan");

    const loan = rows[0];
    if (loan.status !== "borrowed") {
      throw ApiError.badRequest("Buku sudah dikembalikan");
    }

    const return_date = dayjs().format("YYYY-MM-DD HH:mm:ss");

    // 2. Update loans
    await conn.query(
      `UPDATE loans SET return_date=?, status='returned' WHERE id=?`,
      [return_date, loan_id]
    );

    // 3. Tambah stok buku
    await conn.query("UPDATE books SET stock = stock + 1 WHERE id = ?", [loan.book_id]);

    await conn.commit();
    return { loan_id, return_date };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function getAllLoans(status) {
  let query = `
    SELECT 
      l.id,
      l.book_id,
      b.title AS book_title,
      l.member_nim,
      m.name AS member_name,
      l.loan_date,
      l.due_date,
      l.return_date,
      l.status
    FROM loans l
    JOIN books b ON l.book_id = b.id
    JOIN members m ON l.member_nim = m.nim
  `;

  const values = [];

  if (status === "borrowed" || status === "returned") {
    query += " WHERE l.status = ?";
    values.push(status);
  }

  query += " ORDER BY l.loan_date DESC";

  const [rows] = await db.query(query, values);
  return rows;
}


module.exports = {
  borrowBook,
  returnBook,
  getAllLoans
};
