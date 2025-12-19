const loginBox = document.getElementById("loginBox");
const appDiv = document.getElementById("app");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore, collection, addDoc, getDocs, doc,
  deleteDoc, query, orderBy, updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxXlgQU-NTpdMNq2Zr7rxq6C1jDTlPHAA",
  authDomain: "ramai-2d405.firebaseapp.com",
  projectId: "ramai-2d405",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUserRole = "viewer";

// 🔐 AUTH
window.login = async () => {
  await signInWithEmailAndPassword(
    auth,
    email.value,
    password.value
  );
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

  const userSnap = await getDocs(collection(db, "users"));
  userSnap.forEach(d => {
    if (d.id === user.uid) currentUserRole = d.data().role;
  });

  loadData();
});

// ➕ CREATE
window.simpan = async () => {
  if (currentUserRole === "viewer") return alert("Readonly!");
  await addDoc(collection(db, "transaksi"), ambilForm());
  await recalcSaldo();
  loadData();
};

// 📄 READ
async function loadData() {
  const q = query(collection(db, "transaksi"), orderBy("tanggal"));
  const snap = await getDocs(q);
  tabel.innerHTML = "";

  snap.forEach(d => {
    const x = d.data();
    tabel.innerHTML += `
      <tr>
        <td>${x.tanggal}</td>
        <td>${x.uraian}</td>
        <td>${x.pic}</td>
        <td>${x.jenis[0]}</td>
        <td>${x.value}</td>
        <td>${x.saldo}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="hapus('${d.id}')">X</button>
        </td>
      </tr>`;
  });
}

// ❌ DELETE
window.hapus = async id => {
  if (currentUserRole !== "admin") return alert("Data Tidak Diizinkan Untuk Dihapus! Hub: SPV!");
  await deleteDoc(doc(db, "transaksi", id));
  await recalcSaldo();
  loadData();
};

// 🔁 RECALCULATE SALDO (AMAN!)
async function recalcSaldo() {
  const q = query(collection(db, "transaksi"), orderBy("tanggal"));
  const snap = await getDocs(q);
  let saldo = 0;

  for (const d of snap.docs) {
    const x = d.data();
    saldo += x.jenis === "Masuk" ? x.value : -x.value;
    await updateDoc(doc(db, "transaksi", d.id), { saldo });
  }
}

// 📦 FORM
function ambilForm() {
  return {
    tanggal: tanggal.value,
    uraian: uraian.value,
    pic: pic.value,
    jenis: jenis.value,
    value: Number(value.value),
    saldo: 0,
    createdBy: auth.currentUser.uid
  };
}
