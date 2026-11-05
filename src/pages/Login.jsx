import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSubmitted(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) found.email = "Enter a valid email address.";
    if (form.password.length < 6) found.password = "Password must be at least 6 characters.";
    setErrors(found);
    setSubmitted(Object.keys(found).length === 0);
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1>Log in</h1>
        <p className="muted">Authentication is coming soon. This page is a placeholder.</p>

        <label>
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>

        <button type="submit" className="btn btn-primary">
          Log in
        </button>

        {submitted && (
          <p className="login-note" role="status">
            Login is not available yet. Nothing was sent anywhere.
          </p>
        )}

        <p className="muted">
          <Link to="/">Back to home</Link>
        </p>
      </form>
    </div>
  );
}
