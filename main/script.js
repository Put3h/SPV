// ================= DOM =================
const loginBox = document.getElementById("loginBox");
const appDiv = document.getElementById("app");
const tabel = document.getElementById("tabel");
const formBox = document.getElementById("formBox");
const modeEdit = document.getElementById("modeEdit");

let editId = null;
let currentUserRole = "viewer";

// ================= FIREBASE =================
import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  query,
  orderBy,
  serverTimestamp
} from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxXlgQU-NTpdMNq2Zr7rxq6C1jDTlPHAA",
  authDomain: "ramai-2d405.firebaseapp.com",
  projectId: "ramai-2d405"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ================= AUTH =================
window.login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
  } catch (e) {
    alert("Login gagal: " + e.message);
  }
};

window.logout = () => signOut(auth);

onAuthStateChanged(auth, async user => {
  if (!user) {
    loginBox.style.display = "block";
    appDiv.style.display = "none";
    return;
  }

  loginBox.style.display = "none";
  appDiv.style.display = "block";

  const uSnap = await getDoc(doc(db, "users", user.uid));
  currentUserRole = uSnap.exists() ? uSnap.data().role : "viewer";

  formBox.style.display =
    currentUserRole === "admin" ? "block" : "none";

  loadData();
});

// ================= CREATE & UPDATE =================
window.simpan = async () => {
  if (currentUserRole !== "admin")
    return alert("Readonly!");

  if (!tanggal.value || !uraian.value || !value.value)
    return alert("Lengkapi data!");

  if (editId) {
    await updateDoc(doc(db, "transaksi", editId), ambilForm(false));
  } else {
    await addDoc(collection(db, "transaksi"), ambilForm(true));
  }

  resetForm();
  loadData();
};

// ================= READ =================
async function loadData() {
  const q = query(
    collection(db, "transaksi"),
    orderBy("tanggal"),
    orderBy("createdAt")
  );

  const snap = await getDocs(q);

  tabel.innerHTML = "";
  let saldo = 0;

  snap.forEach(d => {
    const x = d.data();
    saldo += x.jenis === "Masuk" ? x.value : -x.value;

    tabel.innerHTML += `
      <tr>
        <td>${x.tanggal}</td>
        <td>${x.uraian}</td>
        <td>${x.pic || ""}</td>
        <td class="text-center">${x.jenis[0]}</td>
        <td class="text-end">${rupiah(x.value)}</td>
        <td class="text-end">${rupiah(saldo)}</td>
        <td class="text-center">
          ${currentUserRole === "admin" ? `
            <button class="btn btn-warning btn-sm"
              onclick="edit('${d.id}')">E</button>
            <button class="btn btn-danger btn-sm"
              onclick="hapus('${d.id}')">X</button>
          ` : ""}
        </td>
      </tr>
    `;
  });
}

// ================= EDIT =================
window.edit = async id => {
  if (currentUserRole !== "admin") return;

  const snap = await getDoc(doc(db, "transaksi", id));
  if (!snap.exists()) return;

  const x = snap.data();
  editId = id;

  tanggal.value = x.tanggal;
  uraian.value = x.uraian;
  pic.value = x.pic;
  jenis.value = x.jenis;
  value.value = x.value;

  modeEdit.classList.remove("d-none");
};

// ================= DELETE =================
window.hapus = async id => {
  if (currentUserRole !== "admin")
    return alert("Tidak diizinkan!");

  if (!confirm("Hapus transaksi?")) return;

  await deleteDoc(doc(db, "transaksi", id));
  loadData();
};

// ================= UTIL =================
function ambilForm(isNew) {
  const data = {
    tanggal: tanggal.value,
    uraian: uraian.value,
    pic: pic.value,
    jenis: jenis.value,
    value: Number(value.value),
    updatedBy: auth.currentUser.uid
  };

  if (isNew) data.createdAt = serverTimestamp();
  return data;
}

function resetForm() {
  tanggal.value = "";
  uraian.value = "";
  pic.value = "";
  value.value = "";
  editId = null;
  modeEdit.classList.add("d-none");
}

function rupiah(n) {
  return new Intl.NumberFormat("id-ID").format(n || 0);
}
