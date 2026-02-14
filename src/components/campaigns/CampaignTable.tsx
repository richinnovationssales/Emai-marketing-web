"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { CampaignStatus } from "@/types/enums/campaign-status.enum";

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: CampaignStatus;
  updatedAt: string;
}

interface CampaignTableProps {
  data: Campaign[];
  onDelete: (id: string) => void;
}

export function CampaignTable({ data, onDelete }: CampaignTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No campaigns found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>

                <TableCell>{campaign.subject}</TableCell>

                <TableCell>
                  <span
                    className={`text-sm font-medium ${
                      campaign.status === "SENT"
                        ? "text-green-600"
                        : campaign.status === "APPROVED"
                          ? "text-blue-600"
                          : "text-muted-foreground"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {new Date(campaign.updatedAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </TableCell>

                <TableCell className="text-right space-x-2">
                  <Link href={`/client/campaigns/${campaign.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>

                  {/* <Link href={`/client/campaigns/${campaign.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </Link> */}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(campaign.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
