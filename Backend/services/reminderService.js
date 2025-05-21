const db = require("../config/db");
const dayjs = require("dayjs");
const { sendEmail } = require("../utils/mailer");

async function sendReminders() {
  const conn = await db.getConnection();

  try {
    const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    // H-1 Reminder
    const [dueSoonLoans] = await conn.query(`
      SELECT l.id, l.due_date, m.name, m.email, b.title 
      FROM loans l 
      JOIN members m ON l.member_nim = m.nim 
      JOIN books b ON l.book_id = b.id
      WHERE DATE(l.due_date) = ? AND l.status = 'borrowed'
    `, [tomorrow]);

    for (const loan of dueSoonLoans) {
      await sendEmail(
        loan.email,
        "Pengingat Pengembalian Buku (Besok)",
        `<p>Halo ${loan.name},</p>
         <p>Ingat bahwa batas pengembalian buku <strong>${loan.title}</strong> adalah <strong>besok (${loan.due_date})</strong>.</p>
         <p>Silakan segera kembalikan buku tepat waktu untuk menghindari denda.</p>`
      );
    }

    // H+1 Reminder
    const [overdueLoans] = await conn.query(`
      SELECT l.id, l.due_date, m.name, m.email, b.title 
      FROM loans l 
      JOIN members m ON l.member_nim = m.nim 
      JOIN books b ON l.book_id = b.id
      WHERE DATE(l.due_date) = ? AND l.status = 'borrowed'
    `, [yesterday]);

    for (const loan of overdueLoans) {
      await sendEmail(
        loan.email,
        "Peringatan: Keterlambatan Pengembalian Buku",
        `<p>Halo ${loan.name},</p>
         <p>Anda terlambat mengembalikan buku <strong>${loan.title}</strong> yang seharusnya dikembalikan pada <strong>${loan.due_date}</strong>.</p>
         <p>Harap segera kembalikan buku agar tidak menambah denda lebih banyak.</p>`
      );
    }

    return {
      reminders_sent: dueSoonLoans.length + overdueLoans.length
    };
  } finally {
    conn.release();
  }
}

module.exports = {
  sendReminders
};
