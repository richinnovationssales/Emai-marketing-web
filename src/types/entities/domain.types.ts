// Domain configuration types for Mailgun integration

export interface DomainConfig {
  registrationEmail: string | null;
  mailgunDomain: string | null;
  mailgunFromEmail: string | null;
  mailgunFromName: string | null;
  mailgunVerified: boolean;
  mailgunVerifiedAt: string | null;
}

export interface UpdateDomainRequest {
  mailgunDomain?: string;
  mailgunFromEmail?: string;
  mailgunFromName?: string;
}

export type DomainActivityType =
  | 'MAILGUN_DOMAIN_CONFIGURED'
  | 'MAILGUN_DOMAIN_UPDATED'
  | 'MAILGUN_DOMAIN_REMOVED';

export interface DomainHistoryItem {
  id: string;
  activityType: DomainActivityType;
  description: string;
  performedBy: string;
  performedByRole: string;
  metadata: {
    previousDomain?: string | null;
    newDomain?: string | null;
    previousFromEmail?: string | null;
    newFromEmail?: string | null;
    previousFromName?: string | null;
    newFromName?: string | null;
  } | null;
  createdAt: string;
}

export interface DomainHistoryResponse {
  history: DomainHistoryItem[];
}

export interface UpdateDomainResponse {
  message: string;
  config: {
    mailgunDomain: string | null;
    mailgunFromEmail: string | null;
    mailgunFromName: string | null;
    mailgunVerified: boolean;
  };
}
