const API_BASE = (() => {
  const configured = typeof window !== 'undefined' && (window.PORTFOLIO_API_URL || window.__API_BASE__ || '');
  if (configured) return configured.replace(/\/$/, '');

  const environmentUrl = typeof process !== 'undefined' && process.env && process.env.PORTFOLIO_API_URL
    ? process.env.PORTFOLIO_API_URL
    : '';

  if (environmentUrl) return environmentUrl.replace(/\/$/, '');

  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    const origin = window.location.origin.replace(/\/$/, '');
    const isLocal = /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(origin);
    if (isLocal) return 'http://localhost:5000/api';
    return `${origin}/api`;
  }

  return 'http://localhost:5000/api';
})();

async function postContactMessage(formData) {
  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message')
  };

  const response = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || 'Unable to send message');
  }

  return response.json();
}

export default { postContactMessage };
