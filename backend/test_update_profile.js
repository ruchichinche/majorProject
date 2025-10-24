// Simple test script to register, login, and update phone via JSON (no image)
// Run with: node test_update_profile.js

const base = 'http://localhost:4000';

async function req(path, opts) {
  const res = await fetch(base + path, opts);
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch (e) { body = text; }
  return { status: res.status, body };
}

(async () => {
  try {
    const rand = Math.floor(Math.random() * 1000000);
    const email = `test${rand}@example.com`;
    console.log('Registering', email);
    const reg = await req('/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email, password: 'password123' })
    });
    console.log('Register response:', reg.status, reg.body);

    const login = await req('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' })
    });
    console.log('Login response:', login.status, login.body);
    if (!login.body || !login.body.token) {
      console.error('Login failed; cannot continue');
      return;
    }
    const token = login.body.token;

    console.log('Updating phone to 5550001112');
    const upd = await req('/api/user/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ phone: '5550001112' })
    });
    console.log('Update response:', upd.status, upd.body);

    console.log('Get profile to verify');
    const profile = await req('/api/user/get-profile', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Profile response:', profile.status, profile.body);
  } catch (e) {
    console.error('Test script error:', e);
  }
})();
