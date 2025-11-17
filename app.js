let data = [];
let editIndex = -1;

// Load Excel dari direktori web
function loadExcel() {
  fetch("keuangan.xlsx")
    .then(res => res.arrayBuffer())
    .then(buffer => {
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // buang header jika ada
      if (rows[0][0] === "Tanggal") rows.shift();

      data = rows;
      loadTable();

      alert("File Excel berhasil dimuat.");
    })
    .catch(err => {
      console.error(err);
      alert("Gagal memuat file Excel!");
    });
}

// Tampilkan tabel
function loadTable() {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";

  data.forEach((row, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${row[0]}</td>
        <td>${row[1]}</td>
        <td>${row[2]}</td>
        <td>${row[3]}</td>
        <td>${row[4]}</td>
        <td>
          <button onclick="editData(${index})">Edit</button>
          <button onclick="deleteData(${index})">Hapus</button>
        </td>
      </tr>
    `;
  });
}

// Tambah data
function addData() {
  const row = [
    document.getElementById("tanggal").value,
    document.getElementById("uraian").value,
    document.getElementById("masuk").value,
    document.getElementById("keluar").value,
    document.getElementById("saldo").value,
  ];

  if (!row[0] || !row[1]) {
    return alert("Tanggal & Uraian wajib diisi!");
  }

  if (editIndex === -1) {
    data.push(row);
  } else {
    data[editIndex] = row;
    editIndex = -1;
  }

  clearForm();
  loadTable();
}

// Edit data
function editData(index) {
  editIndex = index;
  const row = data[index];

  document.getElementById("tanggal").value = row[0];
  document.getElementById("uraian").value = row[1];
  document.getElementById("masuk").value = row[2];
  document.getElementById("keluar").value = row[3];
  document.getElementById("saldo").value = row[4];
}

// Hapus data
function deleteData(index) {
  if (confirm("Yakin hapus?")) {
    data.splice(index, 1);
    loadTable();
  }
}

// Kosongkan form input
function clearForm() {
  document.getElementById("tanggal").value = "";
  document.getElementById("uraian").value = "";
  document.getElementById("masuk").value = "";
  document.getElementById("keluar").value = "";
  document.getElementById("saldo").value = "";
}

// Download Excel baru
function downloadExcel() {
  const header = [["Tanggal", "Uraian", "Masuk", "Keluar", "Saldo"]];
  const ws = XLSX.utils.aoa_to_sheet([...header, ...data]);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Keuangan");
  XLSX.writeFile(wb, "data_keuangan_baru.xlsx");
}
