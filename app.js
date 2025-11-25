import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// === MASUKKAN DATA SUPABASE DI SINI ===
const supabase = createClient(
  "https://lahblqaaqadcmdowdsvd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaGJscWFhcWFkY21kb3dkc3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MDg5NzUsImV4cCI6MjA3OTE4NDk3NX0.MfRcythiqYSV-qfNMA7a8YRFDGsDmsn0JKbf1rQg_vM"
);

// === LOAD DATA ===
async function loadData() {
  const { data } = await supabase.from("products").select("*").order("id", { ascending: true });
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data.forEach(row => {
    tbody.innerHTML += `
      <tr>
        <td>${row.id}</td>
        <td>${row.name}</td>
        <td>${row.price}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="openEdit(${row.id}, '${row.name}', '${row.price}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteData(${row.id})">Hapus</button>
        </td>
      </tr>
    `;
  });
}

// === CREATE ===
document.getElementById("btnAdd").onclick = async () => {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  if (!name || !price) return alert("Isi semua data!");

  await supabase.from("products").insert({ name, price });
  loadData();

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
};

// === OPEN EDIT MODAL ===
window.openEdit = (id, name, price) => {
  document.getElementById("editId").value = id;
  document.getElementById("editName").value = name;
  document.getElementById("editPrice").value = price;

  const modal = new bootstrap.Modal(document.getElementById("editModal"));
  modal.show();
};

// === UPDATE ===
document.getElementById("btnSaveEdit").onclick = async () => {
  const id = document.getElementById("editId").value;
  const name = document.getElementById("editName").value;
  const price = document.getElementById("editPrice").value;

  await supabase.from("products").update({ name, price }).eq("id", id);
  loadData();

  const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
  modal.hide();
};

// === DELETE ===
window.deleteData = async (id) => {
  if (!confirm("Yakin hapus?")) return;
  await supabase.from("products").delete().eq("id", id);
  loadData();
};

// Load data saat web dibuka
loadData();
