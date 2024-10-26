// // // import React, { createContext, useContext, useState, ReactNode } from "react";

// // // // Define the shape of the user context
// // // interface UserContextType {
// // //   mentorId: number;
// // //   setMentorId: (id: number) => void; // Function to update mentorId
// // // }

// // // // Create the context
// // // const UserContext = createContext<UserContextType | undefined>(undefined);

// // // export const UserProvider: React.FC<{ children: ReactNode }> = ({
// // //   children,
// // // }) => {
// // //   const [mentorId, setMentorId] = useState<number>(1); // Example initial value

// // //   return (
// // //     <UserContext.Provider value={{ mentorId, setMentorId }}>
// // //       {children}
// // //     </UserContext.Provider>
// // //   );
// // // };

// // // // Custom hook for easy access to the user context
// // // export const useUserContext = () => {
// // //   const context = useContext(UserContext);
// // //   if (!context) {
// // //     throw new Error("useUserContext must be used within a UserProvider");
// // //   }
// // //   return context;
// // // };
// // // src/UserContext.tsx
// // import React, { createContext, useContext, useState } from "react";

// // // Define the context type
// // interface UserContextType {
// //   userId: string | null;
// //   role: string | null;
// //   login: (userId: string, role: string) => void;
// //   logout: () => void;
// // }

// // // Create the User Context
// // const UserContext = createContext<UserContextType | undefined>(undefined);

// // // User Provider Component
// // export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
// //   children,
// // }) => {
// //   const [userId, setUserId] = useState<string | null>(
// //     localStorage.getItem("userId")
// //   );
// //   const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

// //   const login = (id: string, userRole: string) => {
// //     setUserId(id);
// //     setRole(userRole);
// //     localStorage.setItem("userId", id);
// //     localStorage.setItem("role", userRole);
// //   };

// //   const logout = () => {
// //     setUserId(null);
// //     setRole(null);
// //     localStorage.removeItem("userId");
// //     localStorage.removeItem("role");
// //   };

// //   return (
// //     <UserContext.Provider value={{ userId, role, login, logout }}>
// //       {children}
// //     </UserContext.Provider>
// //   );
// // };

// // // Custom hook for easy access to the context
// // export const useUserContext = () => {
// //   const context = useContext(UserContext);
// //   if (!context) {
// //     throw new Error("useUserContext must be used within a UserProvider");
// //   }
// //   return context;
// // };
// import React, { createContext, useContext, useState } from "react";

// // Define the context type
// interface UserContextType {
//   userId: string | null; // Existing userId
//   role: string | null; // Existing role
//   mentorId: number | null; // New mentorId
//   login: (userId: string, role: string, mentorId?: number) => void; // Update login to accept mentorId
//   logout: () => void;
//   setMentorId: (id: number | null) => void; // Function to update mentorId
// }

// // Create the User Context
// const UserContext = createContext<UserContextType | undefined>(undefined);

// // User Provider Component
// export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [userId, setUserId] = useState<string | null>(
//     localStorage.getItem("userId")
//   );
//   const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
//   const [mentorId, setMentorId] = useState<number | null>(null); // Initialize mentorId

//   const login = (id: string, userRole: string, mentorId?: number) => {
//     setUserId(id);
//     setRole(userRole);
//     localStorage.setItem("userId", id);
//     localStorage.setItem("role", userRole);
//     if (mentorId !== undefined) {
//       // Check if mentorId is provided
//       setMentorId(mentorId); // Set mentorId
//     }
//   };

//   const logout = () => {
//     setUserId(null);
//     setRole(null);
//     setMentorId(null); // Reset mentorId on logout
//     localStorage.removeItem("userId");
//     localStorage.removeItem("role");
//     localStorage.removeItem("mentorId"); // Optional: Remove mentorId from localStorage if set
//   };

//   return (
//     <UserContext.Provider
//       value={{ userId, role, mentorId, login, logout, setMentorId }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// // Custom hook for easy access to the context
// export const useUserContext = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error("useUserContext must be used within a UserProvider");
//   }
//   return context;
// };

import React, { createContext, useContext, useState } from "react";

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

  const login = (id: string, userRole: string) => {
    setUserId(id);
    setRole(userRole);
    localStorage.setItem("userId", id); // Optionally store in localStorage
    localStorage.setItem("role", userRole); // Optionally store role
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
