# saizuroom
Project Matakuliah Management TI

# SAIZU ROOM

**Sistem Peminjaman Ruangan UIN SAIZU**

Versi: 1.0.0

## Deskripsi singkat

`saizu-room` adalah aplikasi web untuk peminjaman ruangan kampus 2 Fakultas Dakwah dan Saintek (Gedung D dan Gedung S) yang memungkinkan mahasiswa memesan ruang kelas, dengan proses validasi otomatis, notifikasi, serta dashboard admin untuk mengelola permohonan dan laporan.

Aplikasi ini mengikuti alur yang diinginkan: user melihat daftar ruangan → mengajukan booking (harus login) → sistem melakukan validasi otomatis → auto-ACC atau penolakan → admin dapat memantau dan melakukan tindakan.

---

## Fitur Utama

* Daftar ruangan berdasarkan gedung (Gedung D dan Gedung S)
* Sistem booking dengan form (Nama, NIM, Keperluan, Tanggal & Waktu)
* Validasi otomatis: if semua kriteria terpenuhi → Auto ACC ✅; jika tidak → Tolak otomatis ❌
* Notifikasi ke user dan admin setelah status berubah
* Dashboard Admin (lihat, filter, ubah status, edit jadwal, hapus, tambah ruangan)
* Laporan cetak mingguan/bulanan
* Role-based authentication (Mahasiswa / Admin)

---

## Daftar Ruangan

**Gedung D**

* 1D.1, 1D.2
* 3D.1, 3D.2, 3D.3, 3D.4, 3D.5, 3D.6, 3D.7, 3D.8, 3D.9
* 4D.1, 4D.2, 4D.3, 4D.4, 4D.5, 4D.6, 4D.7, 4D.8, 4D.9

**Gedung S**

* 3S.1, 3S.2, 3S.3, 3S.4, 3S.5, 3S.6, 3S.7, 3S.8
* 4S.1, 4S.2, 4S.3, 4S.4, 4S.5, 4S.6, 4S.7, 4S.8, 4S.9, 4S.10

---

## Alur Sistem (ringkas)

1. User membuka halaman utama → melihat daftar ruangan dan status.
2. Klik `Booking` pada ruangan yang dipilih.
3. Sistem cek apakah user sudah login:

   * Jika belum → arahkan ke halaman Login (role: Mahasiswa).
   * Jika sudah → tampilkan Form Booking.
4. User mengisi data dan tekan `Kirim Permohonan`.
5. Sistem melakukan validasi otomatis:

   * Jika semua kriteria terpenuhi → **Auto ACC**, simpan peminjaman (status: Disetujui), kirim notifikasi ke user & admin.
   * Jika tidak terpenuhi → **Tolak Otomatis**, tampilkan alasan penolakan, simpan log penolakan.
6. Admin login ke Dashboard → dapat melihat daftar peminjaman, filter, dan melakukan tindakan (ubah status/edit/hapus/tambah ruangan).
7. Admin dapat mencetak laporan mingguan/bulanan.

---

## Alur Diagram (ASCII)

```
[User] -> [Halaman Utama]
[User] -> Click(Booking)
if not logged in:
  -> [Halaman Login] -> Login -> [Halaman Utama] -> Click(Booking)
else:
  -> [Form Booking] -> Submit -> [Validasi Otomatis]
    -> if valid: Auto ACC -> Simpan (status: Disetujui) -> Notifikasi (User+Admin)
    -> else: Tolak Otomatis -> Tampilkan alasan -> Simpan log penolakan

[Admin] -> [Dashboard Admin] -> lihat daftar -> (ubah status / edit / hapus / tambah)
[Admin] -> Cetak Laporan
```

---

## Tech Stack (Rekomendasi)

* Frontend: Tailwind CSS
* Backend: PHP native
* Database: MySQL
* Auth: JWT atau session-based
* DevOps: GitHub Actions (CI) dan server VPS

---

## Struktur Database (sederhana)

**tabel users**

* id (PK)
* name
* role (mahasiswa/dosen/admin)
* identifier (NIM/NIP)
* email
* password_hash
* created_at

**tabel rooms**

* id (PK)
* code (contoh: "D3", "4S.6")
* building ("D" atau "S")
* capacity (int, optional)
* facilities (text/json, optional)
* created_at

**tabel bookings**

* id (PK)
* user_id (FK -> users.id)
* room_id (FK -> rooms.id)
* purpose (text)
* start_time (datetime)
* end_time (datetime)
* status (enum: pending, approved, rejected, cancelled)
* rejection_reason (text, nullable)
* created_at
* updated_at

**tabel booking_logs**

* id
* booking_id
* action (auto-approved / auto-rejected / admin-updated / user-updated)
* note
* performed_by
* timestamp

---

## Validasi Otomatis (aturan contoh)

* Ruang tersedia pada rentang waktu yang diminta (no overlap)
* Waktu booking menyesuaikan jam ruang yang kosong
* Booking harus diajukan minimal 1 jam sebelum mulai
* Mahasiswa: user per kelas hanya diberi 1 akun untuk akses
* Field wajib: Nama, Identifier(NIM), Keperluan, Tanggal & Waktu

Jika semua aturan terpenuhi → auto-ACC.
Jika ada yang melanggar → tolak otomatis dan tampilkan alasan.

---

## API Endpoints (contoh)

* `POST /api/auth/login` — login
* `POST /api/auth/register` — registrasi (opsional)
* `GET /api/rooms` — daftar ruangan (filter by building/status)
* `GET /api/rooms/:id` — detail ruangan
* `POST /api/bookings` — buat booking
* `GET /api/bookings` — daftar booking (user/admin)
* `GET /api/bookings/:id` — detail booking
* `PUT /api/bookings/:id` — update booking (admin)
* `DELETE /api/bookings/:id` — hapus booking (admin)
* `GET /api/reports?range=weekly|monthly` — generate laporan

---

## UI/UX Notes

* Grid 4 kolom untuk daftar ruangan (desktop), 1 kolom (mobile)
* Card ruangan menampilkan code, kapasitas, fasilitas singkat, status dan tombol `Booking`
* Warna indikator: hijau = tersedia, merah = terpakai
* Form booking friendly: date picker, time picker, textarea keperluan
* Modal/Pop-up untuk login jika belum autentikasi

---

## Instalasi (contoh cepat)

1. Clone repo

```bash
git clone https://github.com/your-org/saizu-room.git
cd saizu-room
```

---

## Testing & Deployment

* Buat script migration untuk tabel
* Tulis unit test untuk validasi booking dan API auth
* Deploy ke server/hosting pilihan (Docker recommended)

---

## Kontribusi

Silakan buka issue atau pull request. Ikuti coding standard dan sertakan deskripsi perubahan.

---

---
