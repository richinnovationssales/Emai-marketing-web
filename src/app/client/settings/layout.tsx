"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/auth.slice";
import { UserRole } from "@/types/enums/user-role.enum";
import { User, Mail, CreditCard, Users, Globe, ScrollText} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

const sidebarNavItems: NavItem[] = [
  // {
  //   title: "Profile",
  //   href: "/client/settings/profile",
  //   icon: User,
  // },
  {
    title: "Email Configuration",
    href: "/client/settings/email",
    icon: Mail,
  },
  {
    title: "Domain Settings",
    href: "/client/settings/domain",
    icon: Globe,
    roles: [UserRole.CLIENT_SUPER_ADMIN],
  },
  {
    title: "Domain Logs",
    href: "/client/settings/domain-logs",
    icon: ScrollText,
    roles: [UserRole.CLIENT_SUPER_ADMIN],
  },
  // {
  //   title: "Plan & Billing",
  //   href: "/client/settings/plan",
  //   icon: CreditCard,
  // },
  // {
  //   title: "Team Members",
  //   href: "/client/settings/users",
  //   icon: Users,
  // },
];

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();
  const currentUser = useAppSelector(selectCurrentUser);
  const userRole = currentUser?.role as UserRole | undefined;

  const visibleNavItems = sidebarNavItems.filter(
    (item) => !item.roles || (userRole && item.roles.includes(userRole))
  );

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and email preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 h-full">
        <aside className="-mx-4 lg:w-1/5 overflow-y-auto">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {visibleNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  pathname === item.href
                    ? "bg-muted hover:bg-muted"
                    : "hover:bg-transparent hover:underline",
                  "justify-start"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
