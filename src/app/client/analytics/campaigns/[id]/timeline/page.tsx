"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  CheckCircle,
  XCircle,
  Ban,
  AlertTriangle,
  MousePointerClick,
  Eye,
} from "lucide-react";
import { analyticsService } from "@/lib/api/services/analytics.service";
import { AnalyticsEmailEvent } from "@/types/entities/analytics.types";
import { EmailEventType } from "@/types/enums/email-event-type.enum";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

const eventIcons: Record<EmailEventType, React.ElementType> = {
  [EmailEventType.SENT]: Mail,
  [EmailEventType.DELIVERED]: CheckCircle,
  [EmailEventType.OPENED]: Eye,
  [EmailEventType.CLICKED]: MousePointerClick,
  [EmailEventType.BOUNCED]: Ban,
  [EmailEventType.SPAM_REPORTED]: AlertTriangle,
  [EmailEventType.UNSUBSCRIBED]: XCircle,
};

const eventColors: Record<EmailEventType, string> = {
  [EmailEventType.SENT]: "bg-blue-500",
  [EmailEventType.DELIVERED]: "bg-green-500",
  [EmailEventType.OPENED]: "bg-purple-500",
  [EmailEventType.CLICKED]: "bg-indigo-500",
  [EmailEventType.BOUNCED]: "bg-yellow-500",
  [EmailEventType.SPAM_REPORTED]: "bg-red-500",
  [EmailEventType.UNSUBSCRIBED]: "bg-gray-500",
};

export default function CampaignTimelinePage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [events, setEvents] = useState<AnalyticsEmailEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<
    EmailEventType | "ALL"
  >("ALL");

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await analyticsService.getCampaignTimeline(campaignId);
        setEvents(response.data);
      } catch (err) {
        setError("Failed to load campaign timeline");
        console.error("Timeline error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchTimeline();
    }
  }, [campaignId]);

  const filteredEvents =
    selectedEventType === "ALL"
      ? events
      : events.filter((e) => e.eventType === selectedEventType);

  const eventTypeCounts = events.reduce((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {} as Record<EmailEventType, number>);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            Campaign Timeline
          </h2>
        </div>
        <div className="h-[500px] bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            Campaign Timeline
          </h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Campaign Timeline</h2>
        <Badge variant="outline" className="ml-auto">
          {filteredEvents.length} events
        </Badge>
      </div>

      {/* Event Type Summary */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
        {Object.entries(eventTypeCounts).map(([type, count]) => {
          const Icon = eventIcons[type as EmailEventType];
          return (
            <Card
              key={type}
              className="cursor-pointer hover:border-primary"
              onClick={() => setSelectedEventType(type as EmailEventType)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{count}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{type}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardHeader>
          <Tabs
            value={selectedEventType}
            onValueChange={(v) => setSelectedEventType(v as any)}
          >
            <TabsList>
              <TabsTrigger value="ALL">All Events</TabsTrigger>
              {Object.keys(eventTypeCounts).map((type) => (
                <TabsTrigger key={type} value={type}>
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No events found
            </p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredEvents.map((event, index) => {
                const Icon = eventIcons[event.eventType];
                const color = eventColors[event.eventType];

                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`${color} p-2 rounded-full text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{event.eventType}</p>
                        <span className="text-sm text-muted-foreground">
                          {format(
                            new Date(event.timestamp),
                            "MMM dd, yyyy HH:mm:ss"
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.contactEmail}
                      </p>
                      {event.errorMessage && (
                        <p className="text-sm text-red-600 bg-red-50 p-2 rounded mt-2">
                          {event.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
