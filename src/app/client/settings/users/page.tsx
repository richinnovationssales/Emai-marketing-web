import { Separator } from "@/components/ui/separator";

export default function SettingsUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Team Members</h3>
        <p className="text-sm text-muted-foreground">
          Manage team members and their access permissions.
        </p>
      </div>
      <Separator />
      <div className="flex flex-col gap-4 text-muted-foreground text-sm">
        <p>User management interface will go here.</p>
      </div>
    </div>
  );
}
