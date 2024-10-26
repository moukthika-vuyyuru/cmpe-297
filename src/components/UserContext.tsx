import React, { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
  userId: string | null;
  role: string | null;
  login: (userId: string, role: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Initialize userId and role from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");
    if (storedUserId) setUserId(storedUserId);
    if (storedRole) setRole(storedRole);
  }, []);

  const login = (id: string, userRole: string) => {
    setUserId(id);
    setRole(userRole);
    localStorage.setItem("userId", id); // Store in localStorage
    localStorage.setItem("role", userRole); // Store role in localStorage
  };

  const logout = () => {
    setUserId(null);
    setRole(null);
    localStorage.removeItem("userId"); // Clear from localStorage
    localStorage.removeItem("role"); // Clear role
  };

  return (
    <UserContext.Provider value={{ userId, role, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
