import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.login(email, password);

      if (data.access_token) {
        localStorage.setItem("token", data.access_token)
        localStorage.setItem("refresh_token", data.refresh_token)
        localStorage.setItem("user_id", data.user_id)
        localStorage.setItem("name", data.name)
        navigate("/home");
      } else {
        setError(data.detail || "Login failed!");
      }
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
      const data = await api.signup(name, email, password);

      if (data.user_id) {
        navigate("/");
      } else {
        setError(data.detail || "Signup failed!");
      }
    } catch (err) {
      setError("Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("name");
    navigate("/");
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  const getUser = () => ({
    user_id: localStorage.getItem("user_id"),
    name: localStorage.getItem("name"),
  });

  return { login, signup, logout, loading, error, isAuthenticated, getUser };
};
