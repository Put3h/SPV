import { supabase } from './supabase.js';

export async function login(username, password) {
  const { data, error } = await supabase
    .from("pengguna")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error || !data) return null;

  localStorage.setItem("user", JSON.stringify(data));
  return data;
}

export function logout() {
  localStorage.clear();
  window.location.hash = "/login";
}

export function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function requireLogin() {
  if (!getUser()) {
    window.location.hash = "/login";
  }
}

export function requireAdmin() {
  const user = getUser();
  if (!user || user.rule !== "admin") {
    alert("Tidak punya akses admin!");
    window.location.hash = "/home";
  }
}
