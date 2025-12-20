'use client';

import { Badge } from '@/components/ui/badge';

interface ClientStatusBadgeProps {
    isApproved: boolean;
    isActive: boolean;
}

export function ClientStatusBadge({ isApproved, isActive }: ClientStatusBadgeProps) {
    if (!isApproved) {
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pending</Badge>;
    }
    
    if (!isActive) {
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">Inactive</Badge>;
    }
    
    return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Active</Badge>;
}
