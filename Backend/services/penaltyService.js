const db = require("../config/db");
const dayjs = require("dayjs");


async function checkAndApplyPenalties() {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const today = dayjs().startOf('day').toDate();

    const [overdueLoans] = await conn.query(
      `SELECT * FROM loans 
       WHERE due_date < ? AND status = 'borrowed'`,
      [today]
    );

    console.log(`[DEBUG] Total yang lewat batas: ${overdueLoans.length}`);

    const results = [];

    for (const loan of overdueLoans) {
      const [existing] = await conn.query(
        `SELECT * FROM penalties WHERE loan_id = ?`,
        [loan.id]
      );

      if (existing.length > 0) continue;

      if (!loan.due_date || !dayjs(loan.due_date).isValid()) {
        console.warn(`Loan ID ${loan.id} punya due_date invalid, dilewati.`);
        continue;
      }

      const daysLate = dayjs().diff(dayjs(loan.due_date), "day");
      const amount = daysLate * 5000;

      if (existing.length > 0) {
        // Sudah ada denda → Update nominal sesuai keterlambatan sekarang
        await conn.query(
          `UPDATE penalties SET amount = ?, updated_at = NOW() WHERE loan_id = ?`,
          [amount, loan.id]
        );
      } else {
        // Belum ada denda → buat baru
        await conn.query(
          `INSERT INTO penalties (loan_id, amount, is_paid, created_at)
     VALUES (?, ?, 0, NOW())`,
          [loan.id, amount]
        );
      }

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
