"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  startDate?: Date;
  endDate?: Date;
  onDateChange: (startDate?: Date, endDate?: Date) => void;
}

export function DateRangeFilter({
  startDate,
  endDate,
  onDateChange,
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    onDateChange(undefined, undefined);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-[280px] justify-start text-left font-normal")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate && endDate ? (
              <>
                {format(startDate, "LLL dd, y")} -{" "}
                {format(endDate, "LLL dd, y")}
              </>
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex gap-2 p-3">
            <div>
              <p className="text-sm font-medium mb-2">Start Date</p>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => onDateChange(date, endDate)}
                disabled={(date) =>
                  date > new Date() || (endDate ? date > endDate : false)
                }
              />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">End Date</p>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => onDateChange(startDate, date)}
                disabled={(date) =>
                  date > new Date() || (startDate ? date < startDate : false)
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 p-3 border-t">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button size="sm" onClick={() => setIsOpen(false)}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
