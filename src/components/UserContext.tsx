import React, { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
  userId: string | null;
  role: string | null;
  name: string | null; // Add name here
  login: (userId: string, role: string, name: string) => void; // Include name in login
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null); // Add state for name

  // Initialize userId, role, and name from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");
    const storedName = localStorage.getItem("name"); // Get name from localStorage
    if (storedUserId) setUserId(storedUserId);
    if (storedRole) setRole(storedRole);
    if (storedName) setName(storedName); // Set name from localStorage
  }, []);

  const login = (id: string, userRole: string, userName: string) => {
    setUserId(id);
    setRole(userRole);
    setName(userName); // Set name in state
    localStorage.setItem("userId", id); // Store in localStorage
    localStorage.setItem("role", userRole); // Store role in localStorage
    localStorage.setItem("name", userName); // Store name in localStorage
  };

  const logout = () => {
    setUserId(null);
    setRole(null);
    setName(null); // Clear name on logout
    localStorage.removeItem("userId"); // Clear from localStorage
    localStorage.removeItem("role"); // Clear role
    localStorage.removeItem("name"); // Clear name
  };

  return (
    <UserContext.Provider value={{ userId, role, name, login, logout }}>
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
