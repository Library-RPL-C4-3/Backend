# Sistem Menejeman Perpustakaan - Backend

<br><br>

<p align="center"> <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" width="180"/>  </p> <br>




##  Deskripsi Singkat

Ini adalah backend dari **Sistem Administrasi Perpustakaan** yang dibangun menggunakan **Express.js** dan **MySQL**.  
Fungsinya mencakup:

- Manajemen data buku dan anggota  
- Transaksi peminjaman dan pengembalian  
- Perhitungan denda keterlambatan  
- Sistem login aman menggunakan JWT  

Struktur backend dirancang agar **modular, mudah dikembangkan**, dan cocok untuk sistem akademik atau perpustakaan digital.

---

## ⚙️ Panduan Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/Library-RPL-C4-3/Backend.git
cd perpustakaan-backend
```
### 2. npm install
```
npm install
```
### 3. Konfigurasi .env
Buat file .env di root project dan isi variabel berikut:
```
PORT=3309

# Database
DB_HOST=examplelocalhost
DB_USER=exampleroot
DB_PASSWORD=yourpassword
DB_NAME=examplelibrarydb

# JWT
JWT_SECRET=secretanda
JWT_EXPIRES_IN=1d
```
---
### Konfigurasi Database
Proyek ini menggunakan MySQL.
Pastikan:

- MySQL aktif

- Database librarydb sudah dibuat

Struktur tabel dan relasi mengikuti ERD dibawah ini:
<br><br>
<p align="center">
  <img src="https://github.com/ryhnfhrza/assets/blob/main/Screenshot%20(1889).png" width="1000"/>
</p>
<br>

## ⏰ Cron Job Otomatis

Aplikasi menjalankan tugas terjadwal setiap hari:

-  Mengecek dan menghitung denda keterlambatan

Tugas ini menggunakan paket [`node-cron`](https://www.npmjs.com/package/node-cron).

---

##  Fitur Utama

- 📘 Manajemen buku & kategori  
- 👤 Manajemen anggota  
- 🔁 Peminjaman & pengembalian buku  
- 💸 Denda otomatis (Rp 5.000/hari keterlambatan)  
- 🔐 Login aman dengan JWT  
- 🔍 Fitur pencarian & filter data  

---

## 🧩 Teknologi yang Digunakan

| Kategori      | Teknologi                        |
|---------------|----------------------------------|
| Backend       | Express.js                       |
| Database      | MySQL                            |
| Autentikasi   | JWT                              |
| Scheduler     | node-cron                        |
| Lainnya       | dotenv, dayjs                    |

---

## 🗂️ Struktur Folder

```bash
📦 backend/
├── config/         # Konfigurasi database
├── controllers/    # Logika API
├── routes/         # Rute Express
├── services/       # Logika bisnis
├── utils/          # Helper (token, dll)
├── middleware/     # Middleware auth
├── errors/         # Penanganan error
└── index.js        # Entry point aplikasi
