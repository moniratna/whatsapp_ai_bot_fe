'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not sign in.');
      window.location.assign('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <Image className="login-logo" src="/aureva-logo.png" alt="Aureva Realty" width={420} height={140} priority />
        <div className="login-heading"><span>ADMIN PORTAL</span><h1>Welcome back</h1><p>Sign in to manage your customer workspace.</p></div>
        <form onSubmit={submit} className="login-form">
          <label>Login ID<input autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} required /></label>
          <label>Password<input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></label>
          {error && <p role="alert" className="login-error">{error}</p>}
          <button className="button button-primary login-submit" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </section>
    </main>
  );
}
