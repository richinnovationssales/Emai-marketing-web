import { Separator } from "@/components/ui/separator";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <div className="flex flex-col gap-4 text-muted-foreground text-sm">
        <p>Profile settings form will go here.</p>
        {/* <ProfileForm /> */}
      </div>
    </div>
  );
}
