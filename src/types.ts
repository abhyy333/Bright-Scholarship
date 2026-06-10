/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "admin" | "awardee" | "public" | "fasilitator" | "kepala_asrama";

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface AwardeeProfile {
  awardeeId: string;
  name: string;
  university: string;
  major: string;
  batch: string; // e.g., "Angkatan 7", "Angkatan 8"
  gpa: number; // IPK
  bio: string;
  linkedinUrl: string;
  skills: string[];
  totalServiceHours: number; // Cached aggregated hours
  status: "active" | "alumni" | "menunggu" | "suspended" | "banned";
  updatedAt?: string;
  avatarUrl?: string; // Optional illustrative avatar
}

export interface Activity {
  activityId: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  category: "Pembinaan" | "Pengabdian Masyarakat" | "Capacity Building" | "Lainnya";
  mediaUrl?: string;
  awardeesInvolved: string[]; // List of awardeeIds involved
  hoursEarned: number; // Service hours granted
  location: string;
  createdBy: string; // Admin uid
  createdAt?: string;
}

export interface ImpactStat {
  statId: string; // e.g., "global_analytics"
  totalAwardeesCount: number;
  totalActivitiesCount: number;
  totalServiceHours: number;
  pembinaanHours?: number;
  pengabdianHours?: number;
  updatedAt?: string;
}

export interface UpcomingSchedule {
  scheduleId: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:00 - 11:30 WIB"
  category: "Pembinaan Karakter" | "Tahfidz Quran" | "Pembinaan Soft Skill" | "Kegiatan Sosial";
  location: string;
  speaker: string; // Speaker / Ustadz / Mentor
  registeredAwardeesCount: number;
  notes?: string;
  imageUrl?: string;
  status?: "Mendatang" | "Sedang Berlangsung" | "Selesai";
  confirmedAttendance?: string[];
  documentationUrl?: string;
  targetBatch?: string; // "all" or specific batch number e.g. "7"
}

export interface EmailNotification {
  id: string;
  toEmail: string;
  toName: string;
  subject: string;
  bodyHtml: string;
  sentAt: string;
  isRealSent?: boolean;
  smtpMessage?: string;
  read?: boolean;
  isSimulated?: boolean;
}

export interface InfoPost {
  id: string;
  title: string;
  content: string;
  category: "Info Penting" | "Kegiatan Sosial" | "Pengumuman";
  date: string;
  batch: string;
  createdBy: string;
  imageUrl?: string;
}

export interface QrisCampaign {
  id: string;
  theme: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  qrCodeUrl?: string;
  colorTheme: string;
  active: boolean;
}



