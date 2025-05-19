const db = require("../config/db");
const ApiError = require("../errors/apiError");
const dayjs = require("dayjs");

async function getAllMembers() {
  const [rows] = await db.query("SELECT * FROM members");
  return rows;
}

async function createMember(data) {
  const { nim, name, email, phone, address } = data;
  try {
    const [result] = await db.query(
      `INSERT INTO members (nim, name, email, phone, address, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [nim, name, email, phone, address]
    );
    return data;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw ApiError.conflict(`Anggota dengan NIM ${nim} sudah terdaftar`);
    }
    throw ApiError.internalServerError(error.message);
  }
}

async function updateMember(nim, newData) {
  const [rows] = await db.query("SELECT * FROM members WHERE nim = ?", [nim]);
  if (rows.length === 0) {
    throw ApiError.notFound(`Anggota dengan NIM ${nim} tidak ditemukan`);
  }

  const old = rows[0];

  const updated = {
    name: newData.name ?? old.name,
    email: newData.email ?? old.email,
    phone: newData.phone ?? old.phone,
    address: newData.address ?? old.address,
  };

  const [result] = await db.query(
    "UPDATE members SET name=?, email=?, phone=?, address=? WHERE nim=?",
    [updated.name, updated.email, updated.phone, updated.address, nim]
  );

  if (result.affectedRows === 0) {
    throw ApiError.internalServerError("Gagal mengupdate anggota");
  }

  return { nim, ...updated };
}


async function deleteMember(nim) {
  const [result] = await db.query("DELETE FROM members WHERE nim=?", [nim]);

  if (result.affectedRows === 0) {
    throw ApiError.notFound(`Anggota dengan NIM ${nim} tidak ditemukan`);
  }
}

async function searchMembers(keyword) {
  const like = `%${keyword}%`;
  const [rows] = await db.query(
    `SELECT * FROM members
     WHERE nim LIKE ? OR name LIKE ? OR email LIKE ?`,
    [like, like, like]
  );

  if (rows.length === 0) {
    throw ApiError.notFound(`Anggota dengan keyword "${keyword}" tidak ditemukan`);
  }

  return rows;
}

async function getMemberDetail(nim) {
  // Ambil data member
  const [memberRows] = await db.query("SELECT * FROM members WHERE nim = ?", [nim]);
  if (memberRows.length === 0) throw ApiError.notFound(`Anggota dengan NIM ${nim} tidak ditemukan`);
  const member = memberRows[0];

  // 2. Ambil semua peminjaman aktif
  const [loanRows] = await db.query(
    `SELECT 
      b.title AS book_title,
      l.id AS loan_id,
      l.loan_date,
      l.due_date,
      l.return_date,
      l.status
    FROM loans l
    JOIN books b ON l.book_id = b.id
    WHERE l.member_nim = ? AND l.status = 'borrowed'
    ORDER BY l.loan_date DESC`,
    [nim]
  );

  //Ambil denda dari semua pinjaman milik member
  const [penaltyRows] = await db.query(
    `SELECT 
      p.loan_id,
      p.amount,
      p.is_paid,
      l.loan_date,
      l.due_date,
      l.return_date,
      b.title AS book_title
    FROM penalties p
    JOIN loans l ON p.loan_id = l.id
    JOIN books b ON l.book_id = b.id
    WHERE l.member_nim = ?`,
    [nim]
  );

  let total_penalty = 0;

  const penalties = penaltyRows.map(p => {
    const days_late = dayjs(p.return_date || new Date()).diff(dayjs(p.due_date), 'day');
    total_penalty += Number(p.amount);
    return {
      loan_id: p.loan_id,
      book_title: p.book_title,
      loan_date: p.loan_date,
      due_date: p.due_date,
      return_date: p.return_date,
      days_late,
      amount: p.amount,
      is_paid: !!p.is_paid
    };
  });

  return {
    member,
    loans: loanRows,
    penalties,
    total_penalty
  };
}


module.exports = {
  getAllMembers,
  createMember,
  updateMember,
  deleteMember,
  searchMembers,
  getMemberDetail
};
