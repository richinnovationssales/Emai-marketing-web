import { UserRole } from '../enums/user-role.enum';
import { CampaignStatus } from '../enums/campaign-status.enum';
import { AnalyticsEmailEvent, CampaignAnalyticsData } from './analytics.types';

/**
 * Admin dashboard summary
 */
export interface AdminDashboardResponse {
  userCount: number;
  campaignCount: number;
}

/**
 * User entity
 */
export interface DashboardUser {
  id: string;
  email: string;
  role: UserRole;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Contact group relationship
 */
export interface ContactGroup {
  contactId: string;
  groupId: string;
  createdAt: string;
}

/**
 * Custom field value
 */
export interface CustomFieldValue {
  id: string;
  contactId: string;
  customFieldId: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Group entity
 */
export interface DashboardGroup {
  id: string;
  name: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Campaign entity (minimal)
 */
export interface DashboardCampaign {
  id: string;
  name: string;
  subject: string;
  status: CampaignStatus;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  sentAt: string | null;
}

/**
 * Campaign with full details (legacy - includes raw emailEvents)
 */
export interface CampaignWithDetails {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: CampaignStatus;
  isRecurring: boolean;
  recurringSchedule: string | null;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  sentAt: string | null;
  emailEvents: AnalyticsEmailEvent[];
  groups: DashboardGroup[];
}

/**
 * Campaign with pre-aggregated analytics (used by optimized dashboard)
 */
export interface CampaignWithAnalytics {
  id: string;
  name: string;
  subject: string;
  status: CampaignStatus;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  sentAt: string | null;
  analytics: CampaignAnalyticsData | null;
}

/**
 * Contact with full details
 */
export interface ContactWithDetails {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  contactGroups: ContactGroup[];
  customFieldValues: CustomFieldValue[];
}

/**
 * Group with full details
 */
export interface GroupWithDetails {
  id: string;
  name: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  campaigns: DashboardCampaign[];
  contactGroups: ContactGroup[];
}

/**
 * Template entity
 */
export interface DashboardTemplate {
  id: string;
  name: string;
  content: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Client dashboard complete data
 */
export interface ClientDashboardResponse {
  campaigns: CampaignWithAnalytics[];
  emailsRemaining: number;
  contactCount: number;
  groupCount: number;
}

/**
 * Campaign performance report item
 */
export interface CampaignPerformanceItem {
  id: string;
  name: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Query parameters for campaign performance
 */
export interface CampaignPerformanceParams {
  startDate?: string;
  endDate?: string;
  clientId?: string;
  format?: 'json' | 'excel';
}
