'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  if (paths.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link 
        href={'/'}
        className="hover:text-foreground transition-colors flex items-center"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        const title = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

        return (
          <div key={path} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4" />
            <Link
              href={href}
              className={cn(
                "hover:text-foreground transition-colors capitalize",
                isLast && "text-foreground font-medium pointer-events-none"
              )}
            >
              {title}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
