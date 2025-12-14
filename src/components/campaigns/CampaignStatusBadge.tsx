import { CampaignStatus, CampaignStatusColors } from '@/types/enums/campaign-status.enum';

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
}

export default function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CampaignStatusColors[status]} text-white`}>
      {status}
    </span>
  );
}
