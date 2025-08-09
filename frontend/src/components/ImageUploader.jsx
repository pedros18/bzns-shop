import React, { useRef, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function ImageUploader({ onUploaded }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function presign(file) {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const res = await fetch(`${API_BASE_URL}/api/uploads/presign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentType: file.type, extension: `.${ext}` })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function uploadViaForm(url, fields, file) {
    const form = new FormData();
    Object.entries(fields).forEach(([k, v]) => form.append(k, v));
    form.append('file', file);
    const res = await fetch(url, { method: 'POST', body: form });
    if (!res.ok) throw new Error('Upload failed');
  }

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setError('');
    try {
      const { url, fields, key } = await presign(file);
      await uploadViaForm(url, fields, file);
      // Public URL via Cloudflare R2 public bucket + custom domain if configured
      const publicBase = import.meta.env.VITE_R2_PUBLIC_BASE || '';
      const fileUrl = publicBase ? `${publicBase}/${key}` : `${url}/${key}`;
      onUploaded?.({ key, url: fileUrl });
    } catch (err) {
      setError(err.message || 'Upload error');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input ref={inputRef} type="file" accept="image/*" onChange={onPick} disabled={busy} />
      {busy && <div className="text-sm opacity-70">جاري الرفع...</div>}
      {error && <div className="text-sm text-error">{error}</div>}
    </div>
  );
}
