import { describe, it, expect } from 'vitest';
import { proxy as middleware } from '@/proxy';
import { NextRequest } from 'next/server';

function makeRequest(method: string, path: string, headers: Record<string, string> = {}) {
  return new NextRequest(`http://localhost:3000${path}`, {
    method,
    headers,
  });
}

describe('CSRF middleware', () => {
  it('passes GET requests without Origin', async () => {
    const res = await middleware(makeRequest('GET', '/api/tasks'));
    expect(res.status).not.toBe(403);
  });

  it('passes POST requests without Origin (server-to-server)', async () => {
    const res = await middleware(makeRequest('POST', '/api/tasks'));
    expect(res.status).not.toBe(403);
  });

  it('passes POST requests with matching Origin', async () => {
    const res = await middleware(
      makeRequest('POST', '/api/tasks', {
        origin: 'http://localhost:3000',
        host: 'localhost:3000',
      })
    );
    expect(res.status).not.toBe(403);
  });

  it('blocks POST with mismatched Origin', async () => {
    const res = await middleware(
      makeRequest('POST', '/api/tasks', {
        origin: 'https://evil.example.com',
        host: 'localhost:3000',
      })
    );
    expect(res.status).toBe(403);
  });

  it('blocks DELETE with mismatched Origin', async () => {
    const res = await middleware(
      makeRequest('DELETE', '/api/tasks/123', {
        origin: 'https://evil.example.com',
        host: 'localhost:3000',
      })
    );
    expect(res.status).toBe(403);
  });

  it('passes non-API paths even with mismatched Origin', async () => {
    const res = await middleware(
      makeRequest('POST', '/some/page', {
        origin: 'https://evil.example.com',
        host: 'localhost:3000',
      })
    );
    expect(res.status).not.toBe(403);
  });

  it('blocks malformed Origin header', async () => {
    const res = await middleware(
      makeRequest('POST', '/api/tasks', {
        origin: 'not-a-url',
        host: 'localhost:3000',
      })
    );
    expect(res.status).toBe(403);
  });
});
