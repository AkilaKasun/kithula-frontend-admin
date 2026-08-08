import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../controllers/auth.controller";
import { isAdminAuthenticated } from "../../helpers/AuthStatus";

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // CRITICAL FIX: If user is ALREADY logged in, send them straight to Dashboard!
  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      
      // 1. Authenticate & save tokens to Cookie/localStorage
      await signIn(identifier.trim(), password);

      // 2. Force window redirect to ensure React Router re-evaluates Auth state cleanly
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(
        typeof err === "string" 
          ? err 
          : err?.response?.data?.error || err?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your AdminLogin JSX...
    <form onSubmit={handleLogin}>
      {/* Form inputs */}
    </form>
  );
}