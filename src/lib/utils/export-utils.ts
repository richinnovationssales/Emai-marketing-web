import * as XLSX from 'xlsx';

interface DashboardStats {
  contacts: number;
  campaigns: number;
  emailsSent: number;
  emailsRemaining: number;
}

interface CampaignStat {
  name: string;
  date: string;
  delivered: number;
  opened: number;
}

interface DailyPerformance {
  date: string;
  delivered: number;
  opened: number;
}

interface ExportDashboardParams {
  stats: DashboardStats;
  campaignStats: CampaignStat[];
  dailyPerformance: DailyPerformance[];
  dateRange?: { start: string; end: string };
}

/**
 * Export dashboard data to a clean Excel file with multiple sheets
 */
export function exportDashboardToExcel({
  stats,
  campaignStats,
  dailyPerformance,
  dateRange,
}: ExportDashboardParams) {
  const wb = XLSX.utils.book_new();

  // --- Sheet 1: Summary ---
  const summaryData = [
    ['Dashboard Report'],
    [],
    ['Report Date', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
    ...(dateRange
      ? [['Date Range', `${dateRange.start} to ${dateRange.end}`]]
      : [['Date Range', 'All Time']]),
    [],
    ['Metric', 'Value'],
    ['Total Contacts', stats.contacts],
    ['Total Campaigns', stats.campaigns],
    ['Emails Sent', stats.emailsSent],
    ['Emails Remaining', stats.emailsRemaining],
    [],
    ['Performance Metrics', ''],
    ['Total Delivered', campaignStats.reduce((sum, c) => sum + c.delivered, 0)],
    ['Total Opened', campaignStats.reduce((sum, c) => sum + c.opened, 0)],
    [
      'Open Rate',
      (() => {
        const totalDelivered = campaignStats.reduce((sum, c) => sum + c.delivered, 0);
        const totalOpened = campaignStats.reduce((sum, c) => sum + c.opened, 0);
        return totalDelivered > 0 ? `${((totalOpened / totalDelivered) * 100).toFixed(1)}%` : '0%';
      })(),
    ],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

  // Column widths for Summary
  wsSummary['!cols'] = [{ wch: 22 }, { wch: 30 }];

  // Merge title row
  wsSummary['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // --- Sheet 2: Campaign Statistics ---
  const campaignHeaders = ['#', 'Campaign Name', 'Date', 'Delivered', 'Opened', 'Open Rate'];
  const campaignRows = campaignStats.map((c, i) => [
    i + 1,
    c.name,
    c.date,
    c.delivered,
    c.opened,
    c.delivered > 0 ? `${((c.opened / c.delivered) * 100).toFixed(1)}%` : '0%',
  ]);

  const campaignData = [campaignHeaders, ...campaignRows];
  const wsCampaigns = XLSX.utils.aoa_to_sheet(campaignData);

  // Column widths for Campaign Statistics
  wsCampaigns['!cols'] = [
    { wch: 5 },   // #
    { wch: 30 },  // Campaign Name
    { wch: 28 },  // Date
    { wch: 12 },  // Delivered
    { wch: 12 },  // Opened
    { wch: 12 },  // Open Rate
  ];

  XLSX.utils.book_append_sheet(wb, wsCampaigns, 'Campaign Statistics');

  // --- Sheet 3: Daily Performance ---
  const perfHeaders = ['Date', 'Delivered', 'Opened', 'Open Rate'];
  const perfRows = dailyPerformance.map((d) => [
    d.date,
    d.delivered,
    d.opened,
    d.delivered > 0 ? `${((d.opened / d.delivered) * 100).toFixed(1)}%` : '0%',
  ]);

  const perfData = [perfHeaders, ...perfRows];
  const wsPerformance = XLSX.utils.aoa_to_sheet(perfData);

  // Column widths for Daily Performance
  wsPerformance['!cols'] = [
    { wch: 14 },  // Date
    { wch: 12 },  // Delivered
    { wch: 12 },  // Opened
    { wch: 12 },  // Open Rate
  ];

  XLSX.utils.book_append_sheet(wb, wsPerformance, 'Daily Performance');

  // Generate filename
  const dateStr = new Date().toISOString().split('T')[0];
  const rangeSuffix = dateRange ? `_${dateRange.start}_to_${dateRange.end}` : '';
  const filename = `Dashboard_Report_${dateStr}${rangeSuffix}.xlsx`;

  // Trigger download
  XLSX.writeFile(wb, filename);
}
