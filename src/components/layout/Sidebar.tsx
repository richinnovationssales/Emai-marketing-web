'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Users, 
  Settings, 
  Mail, 
  LayoutDashboard, 
  Target, 
  FileText, 
  Layers, 
  UserCog
} from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';
import { useAuth } from '@/lib/api/hooks/useAuth';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  let navItems: { title: string; href: string; icon: any }[] = [];

  if (isAdmin) {
    navItems = [
      {
        title: 'Dashboard',
        href: ROUTES.ADMIN.DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        title: 'Clients',
        href: ROUTES.ADMIN.CLIENTS,
        icon: Users,
      },
      {
        title: 'Plans',
        href: ROUTES.ADMIN.PLANS,
        icon: Target, // Using Target instead of Layers for plans
      },
    ];

    if (isSuperAdmin) {
      navItems.push(
        {
          title: 'Admins',
          href: ROUTES.ADMIN.ADMINS,
          icon: UserCog,
        },
        {
          title: 'Activity Logs',
          href: ROUTES.ADMIN.ACTIVITY_LOGS,
          icon: FileText,
        }
      );
    }
  } else {
    // Client routes
    navItems = [
        {
        title: 'Dashboard',
        href: ROUTES.CLIENT.DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        title: 'Contacts',
        href: ROUTES.CLIENT.CONTACTS,
        icon: Users,
      },
      {
        title: 'Campaigns',
        href: ROUTES.CLIENT.CAMPAIGNS,
        icon: Mail,
      },
      {
        title: 'Templates',
        href: ROUTES.CLIENT.TEMPLATES,
        icon: FileText,
      },
      {
        title: 'Groups',
        href: ROUTES.CLIENT.GROUPS,
        icon: Layers,
      },
      {
        title: 'Analytics',
        href: ROUTES.CLIENT.ANALYTICS,
        icon: BarChart,
      },
      {
        title: 'Team',
        href: ROUTES.CLIENT.USERS,
        icon: UserCog,
      },
      {
        title: 'Settings',
        href: ROUTES.CLIENT.SETTINGS,
        icon: Settings,
      },
    ];
  }

  return (
    <div className={cn("pb-12 min-h-screen border-r bg-background", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
            Menu
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname?.startsWith(item.href) ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
