"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { clientService } from "@/lib/api/services/client.service";
import { ClientAnalytics } from "@/types/entities/client.types";
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
import { Badge } from "@/components/ui/badge";

interface ClientWithAnalytics {
  id: string;
  name: string;
  isActive: boolean;
  analytics?: ClientAnalytics;
}

type SortField = "name" | "emailsSent" | "campaignsSent";

export function ClientPerformanceTable() {
  const [clients, setClients] = useState<ClientWithAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>("emailsSent");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function loadClientPerformance() {
      try {
        const allClients = await clientService.getAll();

        // Fetch analytics for each client
        const clientsWithAnalytics: ClientWithAnalytics[] = await Promise.all(
          allClients.map(async (client): Promise<ClientWithAnalytics> => {
            try {
              const analytics = await clientService.getAnalytics(client.id);
              return {
                id: client.id,
                name: client.name,
                isActive: client.isActive,
                analytics,
              };
            } catch {
              return {
                id: client.id,
                name: client.name,
                isActive: client.isActive,
                analytics: undefined,
              };
            }
          })
        );

        setClients(clientsWithAnalytics);
      } catch (error) {
        console.error("Failed to load client performance:", error);
      } finally {
        setLoading(false);
      }
    }

    loadClientPerformance();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const sortedClients = [...clients].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "emailsSent":
        aValue = a.analytics?.totalEmailsSent || 0;
        bValue = b.analytics?.totalEmailsSent || 0;
        break;
      case "campaignsSent":
        aValue = a.analytics?.campaignsSent || 0;
        bValue = b.analytics?.campaignsSent || 0;
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortButton field="name">Client</SortButton>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <SortButton field="emailsSent">Emails Sent</SortButton>
                </TableHead>
                <TableHead className="text-right">
                  <SortButton field="campaignsSent">Campaigns</SortButton>
                </TableHead>
                <TableHead className="text-right">Scheduled</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedClients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground"
                  >
                    No clients found
                  </TableCell>
                </TableRow>
              ) : (
                sortedClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={client.isActive ? "default" : "secondary"}
                      >
                        {client.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {client.analytics?.totalEmailsSent?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {client.analytics?.campaignsSent || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {client.analytics?.campaignsScheduled || 0}
                    </TableCell>
                    <TableCell>
                      {client.analytics?.planName ? (
                        <Badge variant="outline">
                          {client.analytics.planName}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {client.analytics?.remainingMessages !== undefined
                        ? client.analytics.remainingMessages.toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/clients/${client.id}`}>
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
