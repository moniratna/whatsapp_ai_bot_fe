export default function LoginUnavailable() {
  return <main className="login-page"><section className="login-card"><h1>Login is not configured</h1><p>Set ADMIN_USERNAME, ADMIN_PASSWORD, and AUTH_SESSION_SECRET in the frontend environment, then restart the app.</p></section></main>;
}
