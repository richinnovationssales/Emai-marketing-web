import { Separator } from "@/components/ui/separator";

export default function SettingsPlanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Plan & Billing</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </div>
      <Separator />
      <div className="flex flex-col gap-4 text-muted-foreground text-sm">
        <p>Plan and billing details will go here.</p>
      </div>
    </div>
  );
}
