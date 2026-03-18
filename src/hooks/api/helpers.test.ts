import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get, patch, post, httpDelete, ApiError } from './helpers';

const mockToken = 'test-token-123';
const getToken = vi.fn<() => Promise<string | undefined>>().mockResolvedValue(mockToken);

beforeEach(() => {
  vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com');
  vi.restoreAllMocks();
  getToken.mockResolvedValue(mockToken);
});

describe('ApiError', () => {
  it('has status and message', () => {
    const error = new ApiError(404, 'Not found');

    expect(error.status).toBe(404);
    expect(error.message).toBe('Not found');
    expect(error.name).toBe('ApiError');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('get', () => {
  it('makes a GET request with auth header', async () => {
    const responseData = { data: 'test' };
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(responseData), { status: 200 }),
    );

    const result = await get(getToken, 'summary');

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.example.com/summary',
      { headers: { Authorization: 'Bearer test-token-123' } },
    );
    expect(result).toEqual(responseData);
  });

  it('throws ApiError on non-OK response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('', { status: 401, statusText: 'Unauthorized' }),
    );

    await expect(get(getToken, 'summary')).rejects.toThrow(ApiError);
    await expect(get(getToken, 'summary')).rejects.toMatchObject({
      status: 401,
    });
  });
});

describe('patch', () => {
  it('makes a PATCH request with body', async () => {
    const responseData = { updated: true };
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(responseData), { status: 200 }),
    );

    const patchFn = patch(getToken, 'profiles');
    const result = await patchFn({ name: 'new' });

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.example.com/profiles',
      {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer test-token-123',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'new' }),
      },
    );
    expect(result).toEqual(responseData);
  });

  it('throws ApiError on non-OK response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('', { status: 500, statusText: 'Internal Server Error' }),
    );

    const patchFn = patch(getToken, 'profiles');
    await expect(patchFn({})).rejects.toThrow(ApiError);
  });
});

describe('post', () => {
  it('makes a POST request with body', async () => {
    const responseData = { id: '123' };
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(responseData), { status: 200 }),
    );

    const postFn = post(getToken, 'users');
    const result = await postFn({ email: 'test@test.com' });

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.example.com/users',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-token-123',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@test.com' }),
      },
    );
    expect(result).toEqual(responseData);
  });
});

describe('httpDelete', () => {
  it('makes a DELETE request', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    await httpDelete(getToken, 'users/123');

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.example.com/users/123',
      {
        method: 'DELETE',
        headers: { Authorization: 'Bearer test-token-123' },
      },
    );
  });

  it('throws ApiError on non-OK response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('', { status: 404, statusText: 'Not Found' }),
    );

    await expect(httpDelete(getToken, 'users/999')).rejects.toThrow(ApiError);
  });
});
