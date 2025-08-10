const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return res.json();
}

export async function getProducts(q) {
  const qs = q && q.trim() ? `?q=${encodeURIComponent(q.trim())}` : '';
  const data = await request(`/api/products${qs}`);
  return data?.data || [];
}

export async function getProduct(id) {
  const data = await request(`/api/products/${id}`);
  return data?.data;
}

export async function createProduct(payload) {
  const data = await request('/api/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data?.data;
}

export async function updateProduct(id, payload) {
  const data = await request(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return data?.data;
}

export async function deleteProduct(id) {
  const data = await request(`/api/products/${id}`, { method: 'DELETE' });
  return data?.data;
}

export const formatDZD = (value) => {
  const n = Number(value || 0);
  // Format like: دج 2.800,00
  const fr = new Intl.NumberFormat('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  return `دج ${fr}`;
};

// New: WhatsApp helpers
export const getWhatsAppDigits = () => {
  const raw = String(import.meta.env.VITE_WHATSAPP_PHONE || '');
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '0000000000';
  if (digits.startsWith('213')) return digits; // already with country code
  return `213${digits.replace(/^0+/, '')}`; // add DZ code, strip leading zeros
};

export const getWhatsAppDisplay = () => {
  const d = getWhatsAppDigits(); // e.g., 213549205138
  if (d.startsWith('213')) {
    const local = d.slice(3); // 549205138
    // format 9-digit local as 549 205 138
    const pretty = local.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    return `+213 ${pretty}`;
  }
  return `+${d}`;
};
