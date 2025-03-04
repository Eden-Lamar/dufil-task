import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import axios from '../api/axios';

// Polyfill TextEncoder for jsdom
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Mock dependencies
jest.mock('../api/axios', () => ({
  post: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
}));
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({ exp: Date.now() / 1000 + 3600 })), // Default expiration 1 hour from now
}));
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(), // Mock navigate
}));

// Wrapper to provide AuthProvider
const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear(); // Reset localStorage
    jest.clearAllMocks(); // Reset mocks
  });

  it('initializes with no user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for useEffect to finish
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0)); // Let microtasks settle
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false); // After useEffect
  });

  it('logs in successfully', async () => {
    axios.post.mockResolvedValue({
      headers: { authorization: 'Bearer fake-token' },
      data: { username: 'testuser' },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'Test1234' });
    });

    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(result.current.user).toEqual({ username: 'testuser' });
  });

  it('handles login error', async () => {
    axios.post.mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'wrong' });
    });

    expect(result.current.error).toBe('Invalid credentials');
    expect(result.current.user).toBeNull();
  });

  it('logs out', async () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ username: 'testuser' }));

    const { result } = renderHook(() => useAuth(), { wrapper });
    // Wait for useEffect to finish
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0)); // Let microtasks settle
    });
    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it('signs up and logs in', async () => {
    axios.post
      .mockResolvedValueOnce({ status: 201 }) // signup
      .mockResolvedValueOnce({
        headers: { authorization: 'Bearer fake-token' },
        data: { username: 'newuser' },
      }); // login

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.signup({
        username: 'newuser',
        email: 'new@example.com',
        password: 'Test1234',
      });
    });

    expect(axios.post).toHaveBeenCalledWith('/api/v1/user/register', {
      username: 'newuser',
      email: 'new@example.com',
      password: 'Test1234',
    });
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(result.current.user).toEqual({ username: 'newuser' });
  });
});