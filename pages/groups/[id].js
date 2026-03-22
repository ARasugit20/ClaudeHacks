import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const GROUPS = [
  { id: 1, name: "Tempe Traffic Warriors", members: 234, privacy: "Public", description: "Fighting for safer streets, crosswalks, and pedestrian rights across Tempe", tags: ["TRAFFIC", "SAFETY"], gradient: "linear-gradient(135deg, #f59e0b, #ef4444)", initial: "T", mission: "We organize residents to push for safer crosswalks, better traffic signals, and pedestrian-first infrastructure across Tempe.", recentActivity: ["New petition: Fix the crosswalk at Rural & University", "47 members signed the Mill Ave letter", "City responded to Apache Blvd speed bump request"] },
  { id: 2, name: "Parks & Green Spaces Alliance", members: 189, privacy: "Public", description: "Advocating for shade, maintenance, and accessibility in Tempe parks", tags: ["PARKS"], gradient: "linear-gradient(135deg, #22c55e, #06b6d4)", initial: "P", mission: "Ensuring every Tempe park is accessible, shaded, and well-maintained for all residents.", recentActivity: ["Shade structure approved for Kiwanis Park", "Cleanup event this Saturday at Papago Park", "New playground equipment petition launched"] },
  { id: 3, name: "Mill Ave Neighborhood Watch", members: 312, privacy: "Public", description: "Keeping the Mill Ave corridor safe, clean, and well-lit", tags: ["SAFETY", "LIGHTING"], gradient: "linear-gradient(135deg, #6366f1, #2563eb)", initial: "M", mission: "Coordinating residents and businesses to maintain safety and cleanliness along the Mill Ave corridor.", recentActivity: ["3 new streetlights installed near 5th St", "Monthly safety walk scheduled for next Friday", "Graffiti removal completed on 7th Ave"] },
  { id: 4, name: "Tempe Renters United", members: 567, privacy: "Private", description: "Organizing renters across Tempe for fair housing and tenant rights", tags: ["HOUSING"], gradient: "linear-gradient(135deg, #ef4444, #f97316)", initial: "R", mission: "Protecting tenant rights and advocating for affordable, fair housing across Tempe.", recentActivity: ["Know Your Rights workshop next Tuesday", "Rent increase survey results published", "City council meeting attendance organized"] },
  { id: 5, name: "Apache Blvd Improvement District", members: 143, privacy: "Public", description: "Improving infrastructure and safety along Apache Boulevard", tags: ["ROADS", "SAFETY"], gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)", initial: "A", mission: "Transforming Apache Boulevard into a safe, vibrant corridor through community-driven infrastructure improvements.", recentActivity: ["Pothole repair request approved by city", "Sidewalk expansion proposal submitted", "Business association meeting recap posted"] },
  { id: 6, name: "ASU Area Residents", members: 891, privacy: "Public", description: "Students and residents around ASU working together for a better community", tags: ["COMMUNITY"], gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)", initial: "U", mission: "Bridging the gap between ASU students and long-term residents to build a stronger, more connected community.", recentActivity: ["Noise ordinance discussion thread open", "Community mixer event this weekend", "Parking petition reached 200 signatures"] },
];

const REACTIONS = ["👍", "❤️", "🔥", "😮", "😢", "😡"];

const INIT_POSTS = [
  { id: 1, author: "Maria G.", avatar: "M", avatarColor: "hsl(221,83%,53%)", time: "2h ago", text: "Has anyone else noticed the new construction blocking the bike lane on University? It has been weeks with no signage.", reactions: { "👍": 12, "😡": 5 }, replies: [
    { id: 11, author: "James T.", avatar: "J", avatarColor: "hsl(142,71%,45%)", time: "1h ago", text: "Yes! I almost got hit last Tuesday. We need to report this to the city ASAP.", reactions: { "👍": 4 } },
    { id: 12, author: "Priya K.", avatar: "P", avatarColor: "hsl(280,70%,55%)", time: "45m ago", text: "I filed a complaint on the city portal. Everyone should echo it so it gets prioritized.", reactions: { "👍": 7, "🔥": 2 } },
  ]},
  { id: 2, author: "James T.", avatar: "J", avatarColor: "hsl(142,71%,45%)", time: "5h ago", text: "Great news — the city responded to our crosswalk petition. They are scheduling an inspection next month. This is what collective action looks like!", reactions: { "👍": 34, "❤️": 18, "🔥": 9 }, replies: [
    { id: 21, author: "Alex R.", avatar: "A", avatarColor: "hsl(30,90%,55%)", time: "4h ago", text: "Amazing work everyone! Let us keep the pressure on.", reactions: { "👍": 6 } },
  ]},
  { id: 3, author: "Priya K.", avatar: "P", avatarColor: "hsl(280,70%,55%)", time: "1d ago", text: "Reminder: community meeting this Thursday at 7pm at the Tempe Public Library. Bring your neighbors! We will be discussing the new development proposal on Mill Ave.", reactions: { "👍": 8, "❤️": 3 }, replies: [] },
];

const INIT_CHAT = [
  { id: 1, author: "Maria G.", avatar: "M", avatarColor: "hsl(221,83%,53%)", time: "10:32 AM", text: "Good morning everyone! Anyone going to the city council meeting tonight?" },
  { id: 2, author: "James T.", avatar: "J", avatarColor: "hsl(142,71%,45%)", time: "10:45 AM", text: "I will be there. We should coordinate who speaks during public comment." },
  { id: 3, author: "Priya K.", avatar: "P", avatarColor: "hsl(280,70%,55%)", time: "11:02 AM", text: "I can speak about the crosswalk issue on Rural and University. Has anyone compiled the signature count?" },
  { id: 4, author: "Alex R.", avatar: "A", avatarColor: "hsl(30,90%,55%)", time: "11:15 AM", text: "We are at 203 signatures now! Up from 180 yesterday." },
  { id: 5, author: "Sam W.", avatar: "S", avatarColor: "hsl(180,60%,45%)", time: "11:28 AM", text: "That is incredible. Let us push for 250 before the meeting." },
];

const MEMBERS = [
  { name: "Maria G.", role: "Admin", avatar: "M", color: "hsl(221,83%,53%)", joined: "Jan 2025" },
  { name: "James T.", role: "Moderator", avatar: "J", color: "hsl(142,71%,45%)", joined: "Feb 2025" },
  { name: "Priya K.", role: "Member", avatar: "P", color: "hsl(280,70%,55%)", joined: "Mar 2025" },
  { name: "Alex R.", role: "Member", avatar: "A", color: "hsl(30,90%,55%)", joined: "Mar 2025" },
  { name: "Sam W.", role: "Member", avatar: "S", color: "hsl(180,60%,45%)", joined: "Apr 2025" },
];
