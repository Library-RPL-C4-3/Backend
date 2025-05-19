const db = require("../config/db");
const dayjs = require("dayjs");


async function checkAndApplyPenalties() {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const today = dayjs().format("YYYY-MM-DD");

    // Ambil loan yang lewat due_date dan belum dikembalikan
    const [overdueLoans] = await conn.query(
      `SELECT * FROM loans 
       WHERE due_date < ? AND status = 'borrowed'`,
      [today]
    );

    const results = [];

    for (const loan of overdueLoans) {
      // Cek apakah sudah ada denda sebelumnya
      const [existing] = await conn.query(
        `SELECT * FROM penalties WHERE loan_id = ?`,
        [loan.id]
      );

      if (existing.length > 0) {
        continue; // Sudah didenda sebelumnya
      }

      const daysLate = dayjs().diff(dayjs(loan.due_date), "day");

      const amount = daysLate * 5000;

      await conn.query(
        `INSERT INTO penalties (loan_id, amount, is_paid, created_at) 
         VALUES (?, ?, 0, NOW())`,
        [loan.id, amount]
      );

      results.push({
        loan_id: loan.id,
        member_nim: loan.member_nim,
        book_id: loan.book_id,
        days_late: daysLate,
        amount
      });
    }

    await conn.commit();
    return results;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = {
  checkAndApplyPenalties
};
