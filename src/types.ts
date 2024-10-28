// src/types.ts
export interface Mentor {
  id: string; // or string, depending on how your API returns it
  name: string;
  specialty: string;
  image: string;
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
