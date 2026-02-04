"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchGroups,
  selectGroups,
  selectGroupsLoading,
} from "@/store/slices/group.slice";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GroupSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  error?: string;
}

export function GroupSelector({
  selectedIds,
  onChange,
  error,
}: GroupSelectorProps) {
  const dispatch = useAppDispatch();
  const groups = useAppSelector(selectGroups);
  const loading = useAppSelector(selectGroupsLoading);
  const [open, setOpen] = useState(false);

  // Fetch groups if not loaded
  useEffect(() => {
    if (groups.length === 0) {
      dispatch(fetchGroups());
    }
  }, [dispatch, groups.length]);

  const handleToggle = (groupId: string) => {
    if (selectedIds.includes(groupId)) {
      onChange(selectedIds.filter((id) => id !== groupId));
    } else {
      onChange([...selectedIds, groupId]);
    }
  };

  const handleRemove = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedIds.filter((id) => id !== groupId));
  };

  const selectedGroups = groups.filter((g) => selectedIds.includes(g.id));

  if (loading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-center">
        <Users className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
        <p className="text-sm text-muted-foreground">
          No groups available. Create a group first to add recipients.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between h-auto min-h-10",
              error && "border-destructive"
            )}
          >
            <div className="flex flex-wrap gap-1 items-center">
              {selectedGroups.length === 0 ? (
                <span className="text-muted-foreground">
                  Select recipient groups...
                </span>
              ) : (
                selectedGroups.map((group) => (
                  <Badge
                    key={group.id}
                    variant="secondary"
                    className="mr-1 mb-1"
                  >
                    {group.name}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={(e) => handleRemove(group.id, e)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[300px] p-0" align="start">
          <div className="max-h-60 overflow-y-auto p-2 space-y-1">
            {groups.map((group) => (
              <div
                key={group.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent transition-colors",
                  selectedIds.includes(group.id) && "bg-accent"
                )}
                onClick={() => handleToggle(group.id)}
              >
                <Checkbox
                  id={`group-${group.id}`}
                  checked={selectedIds.includes(group.id)}
                  onCheckedChange={() => handleToggle(group.id)}
                />
                <Label
                  htmlFor={`group-${group.id}`}
                  className="flex-1 cursor-pointer flex items-center justify-between"
                >
                  <span className="font-medium">{group.name}</span>
                  {/* {group?.id !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {group.name} contacts
                    </span>
                  )} */}
                </Label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {selectedIds.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {selectedIds.length} group{selectedIds.length > 1 ? "s" : ""} selected
        </p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export default GroupSelector;
