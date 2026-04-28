import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Backend connect hone par replace karenge
      const token = "dummy-token";
      localStorage.setItem("token", token);
      navigate("/home");
    } catch (err) {
      setError("Login failed!");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Backend connect hone par replace karenge
      navigate("/");
    } catch (err) {
      setError("Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  return { login, signup, logout, loading, error, isAuthenticated };
};
