const assert = require('assert');

const BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1:5000';

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  const body = await response.json();
  return { status: response.status, body };
}

async function run() {
  const listRes = await request('/api/v1/laws?limit=2&page=1');
  assert.strictEqual(listRes.status, 200, 'GET /laws should return 200');
  assert.strictEqual(listRes.body.success, true);
  assert.ok(Array.isArray(listRes.body.data), 'GET /laws data should be array');

  if (listRes.body.data.length > 0) {
    const lawId = listRes.body.data[0]._id;
    const idRes = await request(`/api/v1/laws/${lawId}`);
    assert.strictEqual(idRes.status, 200, 'GET /laws/:id should return 200');
    assert.strictEqual(idRes.body.success, true);
    assert.strictEqual(idRes.body.data._id, lawId);
  }

  const invalidIdRes = await request('/api/v1/laws/not-an-object-id');
  assert.strictEqual(invalidIdRes.status, 400, 'Invalid ObjectId should return 400');

  const notFoundIdRes = await request('/api/v1/laws/64b0f2f5e13a9c6b8a5e4f11');
  assert.strictEqual(notFoundIdRes.status, 404, 'Unknown ObjectId should return 404');

  const invalidBooleanRes = await request('/api/v1/laws?bailable=yes');
  assert.strictEqual(invalidBooleanRes.status, 400, 'Invalid boolean query should return 400');

  console.log('API tests passed.');
}

run().catch((error) => {
  console.error('API tests failed:', error.message);
  process.exit(1);
});
