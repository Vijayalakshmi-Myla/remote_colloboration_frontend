
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// -----------------------------
// REGISTER USER
// -----------------------------
export async function register({ username, email, password, confirmPassword }) {
  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, confirmPassword }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  } catch (err) {
    throw new Error(err.message || 'Something went wrong during registration');
  }
}

// -----------------------------
// LOGIN USER
// -----------------------------
export async function login({ email, password }) {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    localStorage.setItem('token', data.token);

    return data;
  } catch (err) {
    throw new Error(err.message || 'Something went wrong during login');
  }
}

// -----------------------------
// LOGOUT USER
// -----------------------------
export async function logout() {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
    });

    // Clear token from localStorage
    localStorage.removeItem('token');
  } catch (err) {
    console.warn('Logout failed, but continuing anyway.');
    localStorage.removeItem('token');
  }
}

// -----------------------------
// GET USER PROFILE
// -----------------------------
export async function fetchUserProfile() {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const res = await fetch(`${API_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');

    return {
      id: data.user._id,
      username: data.user.username,
      email: data.user.email,
      createdAt: data.user.createdAt,
    };

  } catch (err) {
    throw new Error(err.message || 'Could not fetch profile');
  }
}
