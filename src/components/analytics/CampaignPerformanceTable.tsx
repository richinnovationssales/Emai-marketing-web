"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { CampaignAnalyticsSummary } from "@/types/entities/analytics.types";
import { format } from "date-fns";

interface CampaignPerformanceTableProps {
  campaigns: CampaignAnalyticsSummary[];
}

type SortField = "name" | "sentAt" | "openRate" | "clickRate";
type SortOrder = "asc" | "desc";

export function CampaignPerformanceTable({
  campaigns,
}: CampaignPerformanceTableProps) {
  const [sortField, setSortField] = useState<SortField>("sentAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case "name":
        aValue = a.campaignName.toLowerCase();
        bValue = b.campaignName.toLowerCase();
        break;
      case "sentAt":
        aValue = a.sentAt ? new Date(a.sentAt).getTime() : 0;
        bValue = b.sentAt ? new Date(b.sentAt).getTime() : 0;
        break;
      case "openRate":
        aValue = a.analytics?.openRate || 0;
        bValue = b.analytics?.openRate || 0;
        break;
      case "clickRate":
        aValue = a.analytics?.clickRate || 0;
        bValue = b.analytics?.clickRate || 0;
        break;
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="-ml-3"
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortButton field="name">Campaign</SortButton>
                </TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>
                  <SortButton field="sentAt">Sent Date</SortButton>
                </TableHead>
                <TableHead className="text-right">Sent</TableHead>
                <TableHead className="text-right">Delivered</TableHead>
                <TableHead className="text-right">
                  <SortButton field="openRate">Open Rate</SortButton>
                </TableHead>
                <TableHead className="text-right">
                  <SortButton field="clickRate">Click Rate</SortButton>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground"
                  >
                    No campaigns found
                  </TableCell>
                </TableRow>
              ) : (
                sortedCampaigns.map((campaign) => (
                  <TableRow key={campaign.campaignId}>
                    <TableCell className="font-medium">
                      {campaign.campaignName}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {campaign.subject}
                    </TableCell>
                    <TableCell>
                      {campaign.sentAt
                        ? format(new Date(campaign.sentAt), "MMM dd, yyyy")
                        : "Not sent"}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.analytics?.totalSent.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.analytics?.totalDelivered.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.analytics
                        ? `${campaign.analytics.openRate.toFixed(1)}%`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.analytics
                        ? `${campaign.analytics.clickRate.toFixed(1)}%`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/client/analytics/campaigns/${campaign.campaignId}`}
                      >
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
