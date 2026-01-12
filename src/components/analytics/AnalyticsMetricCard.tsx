"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsMetricCardProps {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  description?: string;
  variant?: "default" | "success" | "warning" | "danger";
  format?: "number" | "percentage";
}

const variantStyles = {
  default: "text-foreground",
  success: "text-green-600",
  warning: "text-yellow-600",
  danger: "text-red-600",
};

export function AnalyticsMetricCard({
  title,
  value,
  icon: Icon,
  description,
  variant = "default",
  format = "number",
}: AnalyticsMetricCardProps) {
  const formattedValue =
    format === "percentage"
      ? `${value}%`
      : typeof value === "number"
      ? value.toLocaleString()
      : value;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", variantStyles[variant])}>
          {formattedValue}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
