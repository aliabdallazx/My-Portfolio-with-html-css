const API_BASE = 'http://localhost:5000/api';

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
