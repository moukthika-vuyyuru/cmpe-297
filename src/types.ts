// src/types.ts
export interface Mentor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  designation: string;
  company: string;
  location: string;
  profilePicture: string;
  bio: string;
  skills: string;
  email: string;
}

export interface FollowRequest {
  id: string;
  menteeId: string;
  mentorId: string;
  status: "pending" | "accepted";
  message: string;
}

export interface Follow {
  id: string; // Add if you have an id for the follow relationship
  menteeId: string;
  mentorId: string;
}

export interface Mentee {
  id: string;
  name: string;
  location?: string;
  companyOrUniversity?: string;
  profilePicture?: string;
}
