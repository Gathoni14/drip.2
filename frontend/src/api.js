const API = "http://localhost:5000/api";

export async function loginUser(email, password) {
  const res = await fetch(`${API}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
}

export async function signupUser(name, email, password) {
  const res = await fetch(`${API}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  return res.json();
}

export async function getSensorData() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/sensors/latest`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });

  return res.json();
}
