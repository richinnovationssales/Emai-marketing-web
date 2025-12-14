import { cn } from '@/lib/utils/cn';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export default function PageContainer({ 
  children, 
  className,
  fullWidth = false 
}: PageContainerProps) {
  return (
    <div className={cn(
      "flex-1 space-y-4 p-8 pt-6",
      !fullWidth && "max-w-7xl mx-auto w-full",
      className
    )}>
      {children}
    </div>
  );
}
