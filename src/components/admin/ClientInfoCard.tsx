"use client";

import React, { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateClient } from "@/store/slices/admin.slice";
import { ClientDetails, UpdateClientDTO } from "@/types/entities/client.types";
import { Plan } from "@/types/entities/plan.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Save, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface ClientInfoCardProps {
  client: ClientDetails;
  plans: Plan[];
}

export function ClientInfoCard({ client, plans }: ClientInfoCardProps) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateClientDTO>({
    name: client.name,
    planId: client.planId,
    planStartDate: client?.planStartDate ?? null,
    planRenewalDate: client?.planRenewalDate ?? null,
    remainingMessages: client.remainingMessages || 0,
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: client.name,
      planId: client.planId,
      planStartDate: client.planStartDate || "",
      planRenewalDate: client.planRenewalDate || "",
      remainingMessages: client.remainingMessages || 0,
    });
    setIsEditing(false);
  };

  // Inside ClientInfoCard component
React.useEffect(() => {
  setFormData({
    name: client.name,
    planId: client.planId,
    planStartDate: client.planStartDate,
    planRenewalDate: client.planRenewalDate,
    remainingMessages: client.remainingMessages || 0,
  });
}, [client]); // Triggers when Redux updates the 'client' prop

  const handleSave = async () => {
    const updateData: UpdateClientDTO = {};

    if (formData.name !== client.name) updateData.name = formData.name;
    if (formData.planId !== client.planId) updateData.planId = formData.planId;
    if (formData.planStartDate !== client.planStartDate) {
      updateData.planStartDate = formData.planStartDate ?? null;
    }
    if (formData.planRenewalDate !== client.planRenewalDate) {
      updateData.planRenewalDate = formData.planRenewalDate ?? null;
    }
    // if (formData.planStartDate !== client.planStartDate)
    //   updateData.planStartDate = formData.planStartDate;
    // if (formData.planRenewalDate !== client.planRenewalDate)
    //   updateData.planRenewalDate = formData.planRenewalDate;
    if (formData.remainingMessages !== client.remainingMessages)
      updateData.remainingMessages = formData.remainingMessages;
    if (Object.keys(updateData).length === 0) {
      setIsEditing(false);
      return;
    }
    try {
      // await dispatch(
      //   updateClient({ id: client.id, data: updateData }),
      // ).unwrap();
      const result = await dispatch(updateClient({ id: client.id, data: updateData })).unwrap();
// console.log("Check this object:", result);

      toast.success("Client updated successfully");
    // console.log("result ", result);

    if (result) {
      toast.success("Client updated successfully");
      
      // Safety check: only update if result exists
      setFormData({
        name: result.name || client.name,
        planId: result.planId || client.planId,
        planStartDate: result.planStartDate || client.planStartDate,
        planRenewalDate: result.planRenewalDate || client.planRenewalDate,
        // remainingMessages: result.remainingMessages ?? client.remainingMessages,
      });

    }

    

      setIsEditing(false);
    } catch (error: any) {
      const message =
        typeof error === "string"
          ? error
          : error?.message
            ? error.message
            : "Failed to update client";

      toast.error(message);
    }

  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Details and configuration</CardDescription>
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Client Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Select
                  value={formData.planId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, planId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="planStartDate">Plan Start Date</Label>
                <Input
                  id="planStartDate"
                  type="date"
                  // value={formData.planStartDate ? new Date(formData.planStartDate).toISOString().split('T')[0] : ''}
                  // onChange={(e) => setFormData({ ...formData, planStartDate: e.target.value })}
                  value={
                    formData.planStartDate
                      ? new Date(formData.planStartDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      planStartDate: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="planRenewalDate">Plan Renewal Date</Label>
                <Input
                  id="planRenewalDate"
                  type="date"
                  value={
                    formData.planRenewalDate
                      ? new Date(formData.planRenewalDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      //   planRenewalDate: e.target.value,
                      planRenewalDate: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remainingMessages">Remaining Messages</Label>
                <Input
                  id="remainingMessages"
                  type="number"
                  value={formData.remainingMessages || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      remainingMessages: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Client Name
                </p>
                <p className="text-lg font-semibold">{client.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Plan
                </p>
                <p className="text-lg font-semibold">{client.plan.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Plan Start Date
                </p>
                <p className="text-lg">{formatDate(client.planStartDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Plan Renewal Date
                </p>
                <p className="text-lg">{formatDate(client.planRenewalDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Remaining Messages
                </p>
                <p className="text-lg">
                  {client.remainingMessages?.toLocaleString() || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Created At
                </p>
                <p className="text-lg">{formatDate(client.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Updated At
                </p>
                <p className="text-lg">{formatDate(client.updatedAt)}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
