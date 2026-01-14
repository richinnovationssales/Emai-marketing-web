"use client";

import { RecurringFrequency } from "@/types/entities/campaign.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import DateRangePicker from "@/components/shared/DateRangePicker";
import { Calendar, Clock, Globe, Repeat } from "lucide-react";

interface RecurringScheduleFormProps {
  isRecurring: boolean;
  frequency: RecurringFrequency;
  time?: string;
  timezone?: string;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  startDate?: Date;
  endDate?: Date;
  customCron?: string;
  onChange: (field: string, value: any) => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

const TIMEZONES = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
  "UTC",
];

export function RecurringScheduleForm({
  isRecurring,
  frequency,
  time,
  timezone,
  daysOfWeek = [],
  dayOfMonth,
  startDate,
  endDate,
  customCron,
  onChange,
}: RecurringScheduleFormProps) {
  const handleFrequencyChange = (value: RecurringFrequency) => {
    onChange("recurringFrequency", value);
    onChange("isRecurring", value !== "NONE");

    // Reset conditional fields
    if (value !== "WEEKLY" && value !== "BIWEEKLY") {
      onChange("recurringDaysOfWeek", []);
    }
    if (value !== "MONTHLY") {
      onChange("recurringDayOfMonth", undefined);
    }
    if (value !== "CUSTOM") {
      onChange("customCronExpression", undefined);
    }
  };

  const handleDayToggle = (day: number) => {
    const newDays = daysOfWeek.includes(day)
      ? daysOfWeek.filter((d) => d !== day)
      : [...daysOfWeek, day].sort();
    onChange("recurringDaysOfWeek", newDays);
  };

  return (
    <div className="space-y-4">
      {/* Frequency Selector */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Repeat className="h-4 w-4" />
          Campaign Frequency
        </Label>
        <Select value={frequency} onValueChange={handleFrequencyChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NONE">One-time (Send once)</SelectItem>
            <SelectItem value="DAILY">Daily</SelectItem>
            <SelectItem value="WEEKLY">Weekly</SelectItem>
            <SelectItem value="BIWEEKLY">Bi-weekly (Every 2 weeks)</SelectItem>
            <SelectItem value="MONTHLY">Monthly</SelectItem>
            <SelectItem value="CUSTOM">Custom (Cron expression)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Show time/timezone for recurring campaigns */}
      {isRecurring && frequency !== "CUSTOM" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Send Time
            </Label>
            <Input
              type="time"
              value={time || "09:00"}
              onChange={(e) => onChange("recurringTime", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Timezone
            </Label>
            <Select
              value={timezone || "Asia/Kolkata"}
              onValueChange={(value) => onChange("recurringTimezone", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Days of week for WEEKLY/BIWEEKLY */}
      {(frequency === "WEEKLY" || frequency === "BIWEEKLY") && (
        <div className="space-y-2">
          <Label>Send on days</Label>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day.value} className="flex items-center gap-1">
                <Checkbox
                  id={`day-${day.value}`}
                  checked={daysOfWeek.includes(day.value)}
                  onCheckedChange={() => handleDayToggle(day.value)}
                />
                <Label
                  htmlFor={`day-${day.value}`}
                  className="text-sm cursor-pointer"
                >
                  {day.label}
                </Label>
              </div>
            ))}
          </div>
          {daysOfWeek.length === 0 && (
            <p className="text-sm text-destructive">Select at least one day</p>
          )}
        </div>
      )}

      {/* Day of month for MONTHLY */}
      {frequency === "MONTHLY" && (
        <div className="space-y-2">
          <Label>Day of month</Label>
          <Select
            value={dayOfMonth?.toString() || "1"}
            onValueChange={(value) =>
              onChange("recurringDayOfMonth", parseInt(value, 10))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Custom cron for CUSTOM */}
      {frequency === "CUSTOM" && (
        <div className="space-y-2">
          <Label>Cron Expression</Label>
          <Input
            placeholder="0 9 * * 1-5 (Mon-Fri at 9 AM)"
            value={customCron || ""}
            onChange={(e) => onChange("customCronExpression", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Format: minute hour day-of-month month day-of-week
          </p>
        </div>
      )}

      {/* Start/End dates for recurring */}
      {isRecurring && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Start Date
            </Label>
            <DateRangePicker
              value={startDate}
              onChange={(date) =>
                onChange("recurringStartDate", date?.toISOString())
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              End Date (optional)
            </Label>
            <DateRangePicker
              value={endDate}
              onChange={(date) =>
                onChange("recurringEndDate", date?.toISOString())
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RecurringScheduleForm;
