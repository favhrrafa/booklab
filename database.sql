-- =============================================================
-- PinjamLab – Skrip Database Lengkap
-- Jalankan sekali pada proyek Supabase baru (fresh project).
-- Skrip ini bersifat idempoten: gunakan IF NOT EXISTS / OR REPLACE
-- agar aman dijalankan ulang tanpa error duplikat.
-- =============================================================

-- ----------------------------------------------------------------
-- 1. Ekstensi btree_gist: diperlukan untuk EXCLUDE constraint
--    yang mencegah jadwal disetujui bertumpuk di tingkat database.
-- ----------------------------------------------------------------
create extension if not exists btree_gist;

-- ----------------------------------------------------------------
-- 2. Tabel RUANG
-- ----------------------------------------------------------------
create table if not exists ruang (
  id         bigint generated always as identity primary key,
  nama       text   not null unique,
  jenis      text   not null,
  kapasitas  integer not null,
  lokasi     text   not null,
  aktif      boolean not null default true,

  -- CHECK: nama 3–40 karakter (btrim agar spasi saja tidak lolos)
  constraint ruang_nama_panjang
    check (char_length(btrim(nama)) between 3 and 40),

  -- CHECK: jenis hanya boleh 'lab', 'kelas', 'aula'
  constraint ruang_jenis_valid
    check (jenis in ('lab', 'kelas', 'aula')),

  -- CHECK: kapasitas harus > 0
  constraint ruang_kapasitas_positif
    check (kapasitas > 0),

  -- CHECK: lokasi tidak boleh kosong/spasi saja
  constraint ruang_lokasi_tidak_kosong
    check (char_length(btrim(lokasi)) > 0)
);

-- ----------------------------------------------------------------
-- 3. Tabel PEMINJAMAN
-- ----------------------------------------------------------------
create table if not exists peminjaman (
  id           bigint generated always as identity primary key,
  ruang_id     bigint not null,
  peminjam     text   not null,
  keperluan    text   not null,
  tanggal      date   not null,
  mulai        time   not null,
  selesai      time   not null,
  jumlah_orang integer not null,
  status       text   not null default 'menunggu',
  alasan_tolak text,
  dibuat       timestamptz not null default now(),

  -- FK ke ruang – ON DELETE RESTRICT: ruang yang pernah dipinjam tidak bisa dihapus
  constraint peminjaman_ruang_fk
    foreign key (ruang_id) references ruang(id) on delete restrict,

  -- CHECK: nama peminjam 3–40 karakter
  constraint peminjaman_peminjam_panjang
    check (char_length(btrim(peminjam)) between 3 and 40),

  -- CHECK: keperluan 5–120 karakter
  constraint peminjaman_keperluan_panjang
    check (char_length(btrim(keperluan)) between 5 and 120),

  -- CHECK: jumlah_orang harus > 0
  constraint peminjaman_jumlah_orang_positif
    check (jumlah_orang > 0),

  -- CHECK: status hanya tiga nilai yang diizinkan
  constraint peminjaman_status_valid
    check (status in ('menunggu', 'disetujui', 'ditolak')),

  -- CHECK: selesai harus setelah mulai
  constraint peminjaman_selesai_setelah_mulai
    check (selesai > mulai),

  -- CHECK: jam operasional 07:00 – 17:00
  constraint peminjaman_jam_mulai_minimum
    check (mulai >= time '07:00'),
  constraint peminjaman_jam_selesai_maksimum
    check (selesai <= time '17:00'),

  -- CHECK: durasi maksimal 3 jam
  constraint peminjaman_durasi_maksimal
    check (selesai - mulai <= interval '3 hours'),

  -- CHECK: konsistensi penolakan – jika ditolak, alasan_tolak wajib >= 5 karakter
  constraint peminjaman_alasan_tolak_konsisten
    check (
      status <> 'ditolak'
      or (alasan_tolak is not null and char_length(btrim(alasan_tolak)) >= 5)
    )
);

-- ----------------------------------------------------------------
-- 4. EXCLUDE CONSTRAINT – anti-bentrok jadwal disetujui
--    Mencegah dua peminjaman disetujui pada ruang dan tanggal yang sama
--    dengan rentang waktu yang saling beririsan.
--    Rentang half-open [mulai, selesai) → jadwal menempel diizinkan:
--      A selesai 11:00 dan B mulai 11:00 TIDAK dianggap bentrok.
--    Constraint hanya aktif untuk baris dengan status = 'disetujui'.
-- ----------------------------------------------------------------
alter table peminjaman
  drop constraint if exists peminjaman_tidak_bentrok;

alter table peminjaman add constraint peminjaman_tidak_bentrok
  exclude using gist (
    ruang_id with =,
    tsrange((tanggal + mulai), (tanggal + selesai), '[)') with &&
  ) where (status = 'disetujui');

-- ----------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------

-- Aktifkan RLS pada kedua tabel
alter table ruang      enable row level security;
alter table peminjaman enable row level security;

-- ---- Tabel RUANG ----
-- Kunci publik (anon/authenticated) boleh SELECT saja.
-- service_role (kunci rahasia server) boleh ALL.

-- Hapus dulu policy lama agar skrip bisa dijalankan ulang
drop policy if exists ruang_baca_publik    on ruang;
drop policy if exists ruang_semua_service  on ruang;

-- Policy SELECT untuk anon dan authenticated (kunci publik)
create policy ruang_baca_publik
  on ruang for select
  to anon, authenticated
  using (true);
-- Komentar: anon = NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY di sisi klien/server publik

-- Policy ALL untuk service_role (kunci rahasia – hanya server)
create policy ruang_semua_service
  on ruang for all
  to service_role
  using (true)
  with check (true);
-- Komentar: service_role = SUPABASE_SECRET_KEY, tidak pernah dikirim ke browser

-- Cabut hak DML dari anon dan authenticated pada tabel ruang
-- (SELECT masih diizinkan melalui policy di atas)
revoke insert, update, delete on ruang from anon, authenticated;

-- ---- Tabel PEMINJAMAN ----
-- Kunci publik TIDAK memiliki akses apa pun ke tabel peminjaman.
-- Hanya service_role yang bisa membaca dan menulis.

drop policy if exists peminjaman_semua_service on peminjaman;

-- Tidak ada policy untuk anon/authenticated → akses publik ditolak penuh
create policy peminjaman_semua_service
  on peminjaman for all
  to service_role
  using (true)
  with check (true);
-- Komentar: ini memastikan data pribadi peminjam tidak bisa dibaca via API publik Supabase

-- Cabut semua hak dari anon dan authenticated pada tabel peminjaman
revoke all on peminjaman from anon, authenticated;

-- ----------------------------------------------------------------
-- 6. DATA CONTOH (SEED DATA)
--    Semua tanggal menggunakan current_date + n yang selalu jatuh
--    pada hari kerja (Senin–Jumat) sehingga data tetap valid
--    kapan pun skrip dijalankan.
-- ----------------------------------------------------------------

-- ---- Fungsi bantu: geser ke hari kerja berikutnya ----
-- (Digunakan inline di bawah, tidak perlu function permanen)

-- Ruang: 6 data (mix lab/kelas/aula, 1 nonaktif)
insert into ruang (nama, jenis, kapasitas, lokasi, aktif) values
  ('Lab Komputer 1', 'lab',   36,  'Gedung A Lantai 1', true),
  ('Lab Komputer 2', 'lab',   32,  'Gedung A Lantai 2', true),
  ('Kelas 10A',      'kelas', 34,  'Gedung B Lantai 1', true),
  ('Kelas 11B',      'kelas', 30,  'Gedung B Lantai 2', true),
  ('Aula Utama',     'aula',  200, 'Gedung C',          true),
  ('Lab Fisika',     'lab',   28,  'Gedung A Lantai 3', false)
on conflict (nama) do nothing;

-- ---- Blok anonimus untuk seed peminjaman dengan tanggal relatif ----
-- Setiap tanggal digeser maju jika jatuh Sabtu(6) atau Minggu(0)
do $$
declare
  tgl1 date;
  tgl2 date;
  tgl3 date;
  tgl4 date;
  tgl_lalu date;
  r1 bigint; r2 bigint; r3 bigint; r4 bigint; r5 bigint;
begin
  -- Ruang id-nya tidak fix karena identity; ambil berdasarkan nama
  select id into r1 from ruang where nama = 'Lab Komputer 1';
  select id into r2 from ruang where nama = 'Lab Komputer 2';
  select id into r3 from ruang where nama = 'Kelas 10A';
  select id into r4 from ruang where nama = 'Kelas 11B';
  select id into r5 from ruang where nama = 'Aula Utama';

  -- tgl1: 3 hari ke depan, geser ke Senin jika weekend
  tgl1 := current_date + 3;
  while extract(dow from tgl1) in (0, 6) loop
    tgl1 := tgl1 + 1;
  end loop;

  -- tgl2: 5 hari ke depan
  tgl2 := current_date + 5;
  while extract(dow from tgl2) in (0, 6) loop
    tgl2 := tgl2 + 1;
  end loop;

  -- tgl3: 7 hari ke depan
  tgl3 := current_date + 7;
  while extract(dow from tgl3) in (0, 6) loop
    tgl3 := tgl3 + 1;
  end loop;

  -- tgl4: 10 hari ke depan
  tgl4 := current_date + 10;
  while extract(dow from tgl4) in (0, 6) loop
    tgl4 := tgl4 + 1;
  end loop;

  -- tgl_lalu: 2 hari lalu (data historis)
  tgl_lalu := current_date - 2;
  while extract(dow from tgl_lalu) in (0, 6) loop
    tgl_lalu := tgl_lalu - 1;
  end loop;

  -- ---- Peminjaman (hanya insert jika belum ada berdasarkan ruang+tanggal+mulai) ----

  -- #1 Lab Komputer 1 – disetujui 08:00–10:00
  insert into peminjaman (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status)
  values (r1, 'Budi Santoso', 'Praktikum Pemrograman Web kelas XI RPL',
          tgl1, '08:00', '10:00', 30, 'disetujui')
  on conflict do nothing;

  -- #2 Lab Komputer 1 – disetujui 10:00–12:00 (menempel di ujung #1 → diizinkan)
  insert into peminjaman (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status)
  values (r1, 'Sari Dewi', 'Ujian Praktik Basis Data kelas XII RPL',
          tgl1, '10:00', '12:00', 32, 'disetujui')
  on conflict do nothing;

  -- #3 Lab Komputer 1 – menunggu 09:00–11:00 (bertumpuk dengan #1 dan #2 yang disetujui)
  --    Admin tidak bisa approve ini → menguji skenario bentrok saat persetujuan
  insert into peminjaman (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status)
  values (r1, 'Ahmad Fauzi', 'Pelatihan desain grafis untuk ekstrakurikuler',
          tgl1, '09:00', '11:00', 20, 'menunggu')
  on conflict do nothing;

  -- #4 Lab Komputer 1 – menunggu 09:30–11:30 (juga bertumpuk → dua menunggu boleh)
  insert into peminjaman (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status)
  values (r1, 'Rina Susanti', 'Pertemuan kelompok belajar programming',
          tgl1, '09:30', '11:30', 15, 'menunggu')
  on conflict do nothing;

  -- #5 Lab Komputer 2 – disetujui 13:00–15:00
  insert into peminjaman (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status)
  values (r2, 'Pak Hendra', 'Rapat koordinasi panitia pensi dengan presentasi multimedia',
          tgl2, '13:00', '15:00', 25, 'disetujui')
  on conflict do nothing;

  -- #6 Lab Komputer 2 – menunggu 07:00–10:00 (hari berbeda)
  insert into peminjaman (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status)
  values (r2, 'Lina Marlina', 'Tryout online kelas XII',
          tgl3, '07:00', '10:00', 32, 'menunggu')
  on conflict do nothing;

  -- #7 Aula Utama – menunggu 07:00–10:00
  insert into peminjaman (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status)
  values (r5, 'OSIS Sekolah', 'Upacara peringatan hari pahlawan dan pementasan seni budaya siswa',
          tgl4, '07:00', '10:00', 180, 'menunggu')
  on conflict do nothing;

  -- #8 Kelas 10A – ditolak (data historis, tanggal lalu)
  insert into peminjaman (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status, alasan_tolak)
  values (r3, 'Dian Puspita', 'Bimbingan belajar matematika kelas X',
          tgl_lalu, '14:00', '16:00', 20, 'ditolak',
          'Ruang sudah dijadwalkan untuk kegiatan remedial oleh guru matematika pada jam tersebut.')
  on conflict do nothing;

end $$;


-- ================================================================
-- VERIFIKASI (jalankan query ini satu per satu untuk memastikan
-- semua constraint dan RLS bekerja dengan benar)
-- ================================================================

-- 1. Lihat semua ruang
-- select * from ruang order by id;

-- 2. Lihat semua peminjaman
-- select p.id, r.nama as ruang, p.peminjam, p.tanggal, p.mulai, p.selesai, p.status
-- from peminjaman p join ruang r on r.id = p.ruang_id
-- order by p.tanggal, p.mulai;

-- 3. Uji EXCLUDE CONSTRAINT (harus gagal dengan error 23P01):
-- insert into peminjaman (ruang_id, peminjam, keperluan, tanggal, mulai, selesai, jumlah_orang, status)
-- select r.id, 'Test Bentrok', 'Keperluan uji bentrok database',
--        (select tanggal from peminjaman where status = 'disetujui' limit 1),
--        '08:30', '09:30', 10, 'disetujui'
-- from ruang r where r.nama = 'Lab Komputer 1';
-- → Expected error: ERROR 23P01 (exclusion constraint violation)

-- 4. Uji FK RESTRICT (harus gagal dengan error 23503):
-- delete from ruang where nama = 'Lab Komputer 1';
-- → Expected error: ERROR 23503 (foreign key violation)

-- 5. Uji CHECK constraint (harus gagal):
-- insert into ruang (nama, jenis, kapasitas, lokasi)
-- values ('AB', 'lab', 10, 'Test');
-- → Expected error: nama terlalu pendek

-- 6. Uji RLS – dengan kunci publik (anon), tabel peminjaman harus ditolak:
-- (Jalankan via REST API dengan PUBLISHABLE_KEY)
-- GET /rest/v1/peminjaman  → harus mengembalikan 0 baris atau 403
-- POST /rest/v1/peminjaman → harus ditolak

-- 7. Uji RLS – tabel ruang dengan kunci publik harus berhasil SELECT:
-- GET /rest/v1/ruang  → harus mengembalikan data
