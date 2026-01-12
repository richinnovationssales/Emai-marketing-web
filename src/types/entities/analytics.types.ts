import { EmailEventType } from '../enums/email-event-type.enum';
import { CampaignStatus } from '../enums/campaign-status.enum';

/**
 * Analytics overview metrics for client
 */
export interface AnalyticsOverview {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  totalComplaints: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  deliveryRate: number;
}

/**
 * Summary analytics for a campaign in list view
 */
export interface CampaignAnalyticsSummary {
  campaignId: string;
  campaignName: string;
  subject: string;
  sentAt: string | null;
  analytics: AnalyticsOverview | null;
}

/**
 * Detailed analytics for a specific campaign
 */
export interface CampaignAnalyticsData {
  campaignId: string;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  totalUnsubscribed: number;
  totalComplaints: number;
  uniqueOpens: number;
  uniqueClicks: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

/**
 * Campaign detail with analytics
 */
export interface CampaignAnalyticsDetail {
  campaign: {
    id: string;
    name: string;
    subject: string;
    status: CampaignStatus;
    sentAt: string | null;
  };
  analytics: CampaignAnalyticsData;
}

/**
 * Email event with campaign and contact info
 */
export interface AnalyticsEmailEvent {
  id: string;
  eventType: EmailEventType;
  contactEmail: string;
  timestamp: string;
  errorMessage: string | null;
  campaign?: {
    id: string;
    name: string;
  } | null;
}

/**
 * Client analytics for admin view
 */
export interface ClientAnalytics {
  totalEmailsSent: number;
  campaignsScheduled: number;
  campaignsSent: number;
  planName?: string;
  remainingMessages?: number;
}

/**
 * Query parameters for analytics overview
 */
export interface AnalyticsOverviewParams {
  startDate?: string;
  endDate?: string;
}

/**
 * Query parameters for events
 */
export interface AnalyticsEventsParams {
  limit?: number;
}

/**
 * API Response wrappers
 */
export interface AnalyticsOverviewResponse {
  success: true;
  data: AnalyticsOverview;
}

export interface CampaignsAnalyticsResponse {
  success: true;
  data: CampaignAnalyticsSummary[];
}

export interface CampaignAnalyticsDetailResponse {
  success: true;
  data: CampaignAnalyticsDetail;
}

export interface CampaignTimelineResponse {
  success: true;
  data: AnalyticsEmailEvent[];
}

export interface RecentEventsResponse {
  success: true;
  data: AnalyticsEmailEvent[];
}

export interface ClientAnalyticsResponse {
  totalEmailsSent: number;
  campaignsScheduled: number;
  campaignsSent: number;
  planName?: string;
  remainingMessages?: number;
}
