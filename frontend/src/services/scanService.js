import { api } from './api.js';

export async function scanUrl(url) {
  return await api.post('/api/scans/url', { url });
}

export async function scanEmail({ subject, content, sender, replyTo }) {
  return await api.post('/api/scans/email', { subject, content, sender, replyTo });
}

export async function scanMessage(content) {
  return await api.post('/api/scans/message', { content });
}

export async function getScans({ page = 1, limit = 10, type = '', riskLevel = '', status = '', search = '' } = {}) {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', limit);
  if (type) params.set('type', type);
  if (riskLevel) params.set('risk_level', riskLevel);
  if (status) params.set('status', status);
  if (search) params.set('search', search);

  return await api.get(`/api/scans?${params.toString()}`);
}

export async function getScanById(id) {
  return await api.get(`/api/scans/${id}`);
}

export async function deleteScan(id) {
  return await api.delete(`/api/scans/${id}`);
}
