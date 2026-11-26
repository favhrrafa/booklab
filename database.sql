-- =============================================================
-- PinjamLab – Skrip Database Lengkap
-- Jalankan sekali pada proyek Supabase baru (fresh project).
-- Skrip ini bersifat idempoten: gunakan IF NOT EXISTS / OR REPLACE
-- agar aman dijalankan ulang tanpa error duplikat.
-- =============================================================

-- ----------------------------------------------------------------
-- 1. Ekstensi btree_gist
--    Diperlukan untuk EXCLUDE CONSTRAINT anti-bentrok jadwal.
--    Harus diaktifkan sebelum tabel dibuat.
-- ----------------------------------------------------------------
create extension if not exists btree_gist;

-- ----------------------------------------------------------------
-- 2. Tabel RUANG
--    Menyimpan data ruang/laboratorium yang dapat dipinjam.
-- ----------------------------------------------------------------
create table if not exists ruang (
  id        bigint  generated always as identity primary key,
  nama      text    not null,
  jenis     text    not null,
  kapasitas integer not null,
  lokasi    text    not null,
  aktif     boolean not null default true,

  -- nama harus unik
  constraint ruang_nama_unik
    unique (nama),

  -- nama 3–40 karakter (btrim agar string spasi saja tidak lolos)
  constraint ruang_nama_panjang
    check (char_length(btrim(nama)) between 3 and 40),

  -- jenis hanya boleh: 'lab', 'kelas', 'aula'
  constraint ruang_jenis_valid
    check (jenis in ('lab', 'kelas', 'aula')),

  -- kapasitas harus bilangan bulat positif
  constraint ruang_kapasitas_positif
    check (kapasitas > 0),

  -- lokasi tidak boleh kosong atau hanya spasi
  constraint ruang_lokasi_tidak_kosong
    check (char_length(btrim(lokasi)) > 0)
);

-- ----------------------------------------------------------------
-- 3. Tabel PEMINJAMAN
--    Menyimpan setiap pengajuan peminjaman ruang.
-- ----------------------------------------------------------------
create table if not exists peminjaman (
  id           bigint      generated always as identity primary key,
  ruang_id     bigint      not null,
  peminjam     text        not null,
  keperluan    text        not null,
  tanggal      date        not null,
  mulai        time        not null,
  selesai      time        not null,
  jumlah_orang integer     not null,
  status       text        not null default 'menunggu',
  alasan_tolak text,
  dibuat       timestamptz not null default now(),

  -- FK ke ruang.id — ON DELETE RESTRICT:
  -- ruang yang pernah tercatat di tabel ini TIDAK bisa dihapus.
  constraint peminjaman_ruang_fk
    foreign key (ruang_id) references ruang(id) on delete restrict,

  -- nama peminjam 3–40 karakter
  constraint peminjaman_peminjam_panjang
    check (char_length(btrim(peminjam)) between 3 and 40),

  -- keperluan 5–120 karakter
  constraint peminjaman_keperluan_panjang
    check (char_length(btrim(keperluan)) between 5 and 120),

  -- jumlah orang harus > 0
  constraint peminjaman_jumlah_orang_positif
    check (jumlah_orang > 0),

  -- status hanya tiga nilai yang diizinkan
  constraint peminjaman_status_valid
    check (status in ('menunggu', 'disetujui', 'ditolak')),

  -- jam selesai harus setelah jam mulai
  constraint peminjaman_selesai_setelah_mulai
    check (selesai > mulai),

  -- jam mulai minimal 07:00
  constraint peminjaman_jam_mulai_minimum
    check (mulai >= time '07:00'),

  -- jam selesai maksimal 17:00
  constraint peminjaman_jam_selesai_maksimum
    check (selesai <= time '17:00'),

  -- durasi maksimal 3 jam
  constraint peminjaman_durasi_maksimal
    check (selesai - mulai <= interval '3 hours'),

  -- konsistensi alasan_tolak:
  -- jika status = 'ditolak', alasan_tolak wajib diisi minimal 5 karakter
  constraint peminjaman_alasan_tolak_konsisten
    check (
      status <> 'ditolak'
      or (alasan_tolak is not null and char_length(btrim(alasan_tolak)) >= 5)
    )
);

-- ----------------------------------------------------------------
-- 4. EXCLUDE CONSTRAINT – anti-bentrok jadwal disetujui
--
--    PostgreSQL mensyaratkan semua fungsi dalam index expression
--    bersifat IMMUTABLE. Ekspresi (date + time)::timestamp sudah
--    IMMUTABLE, tetapi jika dibungkus langsung dalam tsrange() di
--    dalam index PostgreSQL kadang menolaknya.
--
--    Solusi: buat fungsi helper IMMUTABLE sekali, lalu gunakan di
--    dalam constraint. Fungsi ini hanya mengubah (date, time, time)
--    menjadi tsrange half-open [mulai, selesai).
--
--    Jadwal MENEMPEL diizinkan:
--      A selesai 11:00 dan B mulai 11:00 → TIDAK bentrok (half-open).
--    Constraint hanya aktif untuk baris dengan status = 'disetujui'.
-- ----------------------------------------------------------------

-- Fungsi pembantu IMMUTABLE: (date, time_mulai, time_selesai) → tsrange
create or replace function tgl_range(tgl date, t_mulai time, t_selesai time)
  returns tsrange
  language sql immutable strict as
$$
  select tsrange(
    (tgl + t_mulai)::timestamp,
    (tgl + t_selesai)::timestamp,
    '[)'
  );
$$;

alter table peminjaman
  drop constraint if exists peminjaman_tidak_bentrok;

alter table peminjaman
  add constraint peminjaman_tidak_bentrok
  exclude using gist (
    ruang_id                           with =,
    tanggal                            with =,
    tgl_range(tanggal, mulai, selesai) with &&
  )
  where (status = 'disetujui');

-- ----------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS)
--
--    Matriks Hak Akses:
--    ┌─────────────┬────────────────────────┬──────────────────────────────┐
--    │ Tabel       │ Kunci Publik (anon)     │ Kunci Rahasia (service_role) │
--    ├─────────────┼────────────────────────┼──────────────────────────────┤
--    │ ruang       │ SELECT saja             │ ALL (SELECT/INSERT/UPDATE/   │
--    │             │                        │       DELETE)                │
--    ├─────────────┼────────────────────────┼──────────────────────────────┤
--    │ peminjaman  │ TIDAK ADA AKSES         │ ALL                          │
--    └─────────────┴────────────────────────┴──────────────────────────────┘
-- ----------------------------------------------------------------

-- Aktifkan RLS pada kedua tabel
alter table ruang      enable row level security;
alter table peminjaman enable row level security;

-- ---- Policy untuk tabel RUANG ----

drop policy if exists ruang_baca_publik   on ruang;
drop policy if exists ruang_semua_service on ruang;

-- Kunci publik (anon / authenticated) → SELECT saja
create policy ruang_baca_publik
  on ruang
  for select
  to anon, authenticated
  using (true);

-- Kunci rahasia (service_role) → ALL (dipakai Server Action di Next.js)
create policy ruang_semua_service
  on ruang
  for all
  to service_role
  using (true)
  with check (true);

-- Cabut hak INSERT/UPDATE/DELETE dari kunci publik
revoke insert, update, delete on ruang from anon, authenticated;

-- ---- Policy untuk tabel PEMINJAMAN ----

drop policy if exists peminjaman_semua_service on peminjaman;

-- Tidak ada policy untuk anon/authenticated → akses publik ditolak penuh.
-- Hanya service_role (SUPABASE_SECRET_KEY di server) yang bisa akses.
create policy peminjaman_semua_service
  on peminjaman
  for all
  to service_role
  using (true)
  with check (true);

-- Cabut SEMUA hak dari kunci publik pada tabel peminjaman
revoke all on peminjaman from anon, authenticated;

-- ----------------------------------------------------------------
-- 6. DATA CONTOH (SEED DATA)
--
--    Ketentuan PRD:
--    • Minimal 6 ruang: variasi lab/kelas/aula, ≥1 nonaktif.
--    • Minimal 8 peminjaman fiktif: variasi status (menunggu/
--      disetujui/ditolak), termasuk jadwal menempel dan tumpuk.
--
--    Tanggal menggunakan current_date + n hari kemudian digeser
--    ke hari kerja (Senin–Jumat) agar selalu valid kapan pun
--    skrip dijalankan.
-- ----------------------------------------------------------------

-- ---- 6a. Data Ruang (6 buah, 1 nonaktif) ----
insert into ruang (nama, jenis, kapasitas, lokasi, aktif) values
  ('Lab Komputer 1', 'lab',   36,  'Gedung A Lantai 1', true),
  ('Lab Komputer 2', 'lab',   32,  'Gedung A Lantai 2', true),
  ('Kelas 10A',      'kelas', 34,  'Gedung B Lantai 1', true),
  ('Kelas 11B',      'kelas', 30,  'Gedung B Lantai 2', true),
  ('Aula Utama',     'aula',  200, 'Gedung C',          true),
  ('Lab Fisika',     'lab',   28,  'Gedung A Lantai 3', false)  -- nonaktif
on conflict (nama) do nothing;

-- ---- 6b. Data Peminjaman (8 buah, via blok PL/pgSQL) ----
--
--    Skenario yang dicakup:
--    #1 & #2 → jadwal MENEMPEL pada ruang & tanggal sama (sah, disetujui)
--    #3 & #4 → jadwal BERTUMPUK dengan #1/#2 tapi status 'menunggu' (boleh)
--              → admin TIDAK bisa approve #3/#4 karena akan bentrok DB
--    #5      → ruang berbeda, disetujui
--    #6      → ruang berbeda, menunggu
--    #7      → aula, menunggu
--    #8      → ditolak dengan alasan (data historis tanggal lalu)
-- ----------------------------------------------------------------
do $$
declare
  tgl1     date;
  tgl2     date;
  tgl3     date;
  tgl4     date;
  tgl_lalu date;
  r1 bigint; r2 bigint; r3 bigint; r5 bigint;
begin
  -- Ambil id ruang berdasarkan nama (aman terhadap urutan IDENTITY)
  select id into r1 from ruang where nama = 'Lab Komputer 1';
  select id into r2 from ruang where nama = 'Lab Komputer 2';
  select id into r3 from ruang where nama = 'Kelas 10A';
  select id into r5 from ruang where nama = 'Aula Utama';

  -- tgl1: 3 hari ke depan, digeser ke hari kerja
  tgl1 := current_date + 3;
  while extract(dow from tgl1) in (0, 6) loop tgl1 := tgl1 + 1; end loop;

  -- tgl2: 5 hari ke depan
  tgl2 := current_date + 5;
  while extract(dow from tgl2) in (0, 6) loop tgl2 := tgl2 + 1; end loop;

  -- tgl3: 7 hari ke depan
  tgl3 := current_date + 7;
  while extract(dow from tgl3) in (0, 6) loop tgl3 := tgl3 + 1; end loop;

  -- tgl4: 10 hari ke depan
  tgl4 := current_date + 10;
  while extract(dow from tgl4) in (0, 6) loop tgl4 := tgl4 + 1; end loop;

  -- tgl_lalu: 2 hari lalu (data historis)
  tgl_lalu := current_date - 2;
  while extract(dow from tgl_lalu) in (0, 6) loop tgl_lalu := tgl_lalu - 1; end loop;

  -- #1 Lab Komputer 1 — disetujui 08:00–10:00
  insert into peminjaman
    (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status)
  values
    (r1, 'Budi Santoso', 'Praktikum Pemrograman Web kelas XI RPL',
     tgl1, '08:00', '10:00', 30, 'disetujui')
  on conflict do nothing;

  -- #2 Lab Komputer 1 — disetujui 10:00–12:00
  --    Menempel tepat di ujung #1 (selesai #1 = mulai #2 = 10:00 → TIDAK bentrok)
  insert into peminjaman
    (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status)
  values
    (r1, 'Sari Dewi', 'Ujian Praktik Basis Data kelas XII RPL',
     tgl1, '10:00', '12:00', 32, 'disetujui')
  on conflict do nothing;

  -- #3 Lab Komputer 1 — menunggu 09:00–11:00
  --    Bertumpuk dengan #1 (08:00–10:00) dan #2 (10:00–12:00).
  --    Status 'menunggu' → boleh tersimpan, tapi admin tidak bisa setujui.
  insert into peminjaman
    (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status)
  values
    (r1, 'Ahmad Fauzi', 'Pelatihan desain grafis untuk ekstrakurikuler',
     tgl1, '09:00', '11:00', 20, 'menunggu')
  on conflict do nothing;

  -- #4 Lab Komputer 1 — menunggu 09:30–11:30
  --    Juga bertumpuk → dua pengajuan 'menunggu' yang tumpuk boleh ada bersamaan.
  insert into peminjaman
    (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status)
  values
    (r1, 'Rina Susanti', 'Pertemuan kelompok belajar programming',
     tgl1, '09:30', '11:30', 15, 'menunggu')
  on conflict do nothing;

  -- #5 Lab Komputer 2 — disetujui 13:00–15:00
  insert into peminjaman
    (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status)
  values
    (r2, 'Pak Hendra', 'Rapat koordinasi panitia pensi dengan presentasi multimedia',
     tgl2, '13:00', '15:00', 25, 'disetujui')
  on conflict do nothing;

  -- #6 Lab Komputer 2 — menunggu 07:00–10:00 (hari berbeda dari #5)
  insert into peminjaman
    (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status)
  values
    (r2, 'Lina Marlina', 'Tryout online kelas XII',
     tgl3, '07:00', '10:00', 32, 'menunggu')
  on conflict do nothing;

  -- #7 Aula Utama — menunggu 07:00–10:00
  insert into peminjaman
    (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status)
  values
    (r5, 'OSIS Sekolah', 'Upacara peringatan hari pahlawan dan pementasan seni budaya siswa',
     tgl4, '07:00', '10:00', 180, 'menunggu')
  on conflict do nothing;

  -- #8 Kelas 10A — ditolak (data historis, tanggal lampau)
  --    Menguji tampilan alasan_tolak di halaman /cek
  insert into peminjaman
    (ruang_id, peminjam, keperluan, tanggal, mulai, selesai,
     jumlah_orang, status, alasan_tolak)
  values
    (r3, 'Dian Puspita', 'Bimbingan belajar matematika kelas X',
     tgl_lalu, '14:00', '16:00', 20, 'ditolak',
     'Ruang sudah dijadwalkan untuk kegiatan remedial oleh guru matematika pada jam tersebut.')
  on conflict do nothing;

end $$;


-- ================================================================
-- VERIFIKASI — jalankan query ini satu per satu di SQL Editor
-- Supabase untuk memastikan semua constraint dan RLS bekerja.
-- ================================================================

-- 1. Lihat semua ruang
-- select * from ruang order by id;

-- 2. Lihat semua peminjaman beserta nama ruang
-- select
--   p.id, r.nama as ruang, p.peminjam, p.tanggal,
--   p.mulai, p.selesai, p.jumlah_orang, p.status
-- from peminjaman p
-- join ruang r on r.id = p.ruang_id
-- order by p.tanggal, p.mulai;

-- 3. Uji EXCLUDE CONSTRAINT — harus gagal dengan error 23P01
--    (memasukkan peminjaman 'disetujui' yang bertumpuk dengan #1)
-- insert into peminjaman
--   (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status)
-- select r.id,
--   'Test Bentrok', 'Keperluan uji bentrok database',
--   (select tanggal from peminjaman where status = 'disetujui' limit 1),
--   '08:30', '09:30', 10, 'disetujui'
-- from ruang r where r.nama = 'Lab Komputer 1';
-- → Expected: ERROR 23P01 (exclusion_violation)

-- 4. Uji FK RESTRICT — harus gagal dengan error 23503
-- delete from ruang where nama = 'Lab Komputer 1';
-- → Expected: ERROR 23503 (foreign_key_violation)

-- 5. Uji CHECK nama terlalu pendek — harus gagal
-- insert into ruang (nama, jenis, kapasitas, lokasi)
-- values ('AB', 'lab', 10, 'Test Lokasi');
-- → Expected: ERROR 23514 (check_violation) on ruang_nama_panjang

-- 6. Uji CHECK alasan_tolak kosong saat ditolak — harus gagal
-- insert into peminjaman
--   (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status)
-- select id, 'Test User', 'Keperluan cukup panjang', current_date + 1,
--   '08:00', '09:00', 5, 'ditolak'
-- from ruang limit 1;
-- → Expected: ERROR 23514 (check_violation) on peminjaman_alasan_tolak_konsisten

-- 7. Uji RLS — akses tabel peminjaman via kunci publik (anon) harus ditolak
--    Jalankan via REST API Supabase dengan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
--    GET https://<project>.supabase.co/rest/v1/peminjaman
--    → Expected: 0 baris atau HTTP 403

-- 8. Uji RLS — akses tabel ruang via kunci publik harus berhasil (SELECT)
--    GET https://<project>.supabase.co/rest/v1/ruang
--    → Expected: data ruang dikembalikan
