import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare, Home, LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem("name") || "User";
  const initial = name.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navItems = [
    { label: "Home", path: "/home", icon: <Home size={15} /> },
    { label: "Chat", path: "/chat", icon: <MessageSquare size={15} /> },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        borderBottom: "1px solid var(--border)",
        backgroundColor: "var(--sidebar-bg)",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4ade80, #16a34a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: "var(--text-primary)",
          }}
        >
          Ask My Docs
        </span>
      </div>

      {/* Nav Items */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {navItems.map((item) => (
          <motion.button
            key={item.path}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(item.path)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 8,
              border: "none",
              backgroundColor:
                location.pathname === item.path ? "#1E3A2A" : "transparent",
              color:
                location.pathname === item.path
                  ? "#4ade80"
                  : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== item.path)
                e.currentTarget.style.backgroundColor = "var(--card-bg)";
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== item.path)
                e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {item.icon}
            {item.label}
          </motion.button>
        ))}
      </div>

      {/* User + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4ade80, #16a34a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "white",
          }}
        >
          {initial}
        </div>
        <span
          style={{
            fontSize: 13,
            color: "var(--text-primary)",
            fontWeight: 500,
          }}
        >
          {name}
        </span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 12px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            backgroundColor: "transparent",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontSize: 12,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--card-bg)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <LogOut size={13} />
          Logout
        </motion.button>
      </div>
    </div>
  );
};

export default Navbar;
