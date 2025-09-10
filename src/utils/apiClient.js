/** Simple API client using fetch, reads base URL and token from env/localStorage */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function getAuthHeader() {
  const token = localStorage.getItem('findloc.token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet(path) {
  if (!BASE_URL) throw new Error('API base URL not configured');
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      window.dispatchEvent(new CustomEvent('auth:required', { detail: { path } }));
    }
    const text = await res.text().catch(() => '');
    const err = new Error(`GET ${path} failed: ${res.status} ${text}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export async function apiPost(path, body) {
  if (!BASE_URL) throw new Error('API base URL not configured');
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      window.dispatchEvent(new CustomEvent('auth:required', { detail: { path } }));
    }
    const text = await res.text().catch(() => '');
    const err = new Error(`POST ${path} failed: ${res.status} ${text}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export async function apiPut(path, body) {
  if (!BASE_URL) throw new Error('API base URL not configured');
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      window.dispatchEvent(new CustomEvent('auth:required', { detail: { path } }));
    }
    const text = await res.text().catch(() => '');
    const err = new Error(`PUT ${path} failed: ${res.status} ${text}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}
