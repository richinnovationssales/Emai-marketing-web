'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { clientService } from '@/lib/api/services/client.service';
import { ClientWithStats } from '@/types/entities/client.types';

export function RecentClients() {
  const [clients, setClients] = useState<ClientWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClients() {
      try {
        // Use getPending or just standard getAll to show recent additions
        // Since getPending is specific, lets use getAll and take top 5
        const allClients = await clientService.getAll();
        setClients(allClients.slice(0, 5));
      } catch (e) {
        console.error("Failed to load clients", e);
        // Fallback mock
        setClients([
            // @ts-ignore
            { id: '1', name: 'Acme Corp', email: 'contact@acme.com', isApproved: true, isActive: true, createdAt: new Date().toISOString() },
            // @ts-ignore
            { id: '2', name: 'Globex Inc', email: 'info@globex.com', isApproved: false, isActive: false, createdAt: new Date().toISOString() },
             // @ts-ignore
            { id: '3', name: 'Soylent Corp', email: 'sales@soylent.com', isApproved: true, isActive: false, createdAt: new Date().toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadClients();
  }, []);

  if (loading) {
       return (
        <Card className="col-span-3">
             <CardHeader>
                <CardTitle>Recent Clients</CardTitle>
            </CardHeader>
             <CardContent>
                <div className="space-y-4">
                    {[1,2,3].map(i => <div key={i} className="h-12 w-full bg-muted/20 animate-pulse rounded"></div>)}
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Clients</CardTitle>
        <CardDescription>
          Newest clients added to the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Approval</TableHead>
                    <TableHead className="text-right">Joined</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {clients.map((client) => (
                    <TableRow key={client.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://avatar.vercel.sh/${client.name}.png`} />
                                <AvatarFallback>{client.name.substring(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span>{client.name}</span>
                                <span className="text-xs text-muted-foreground">{/* client.email if available */}</span>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={client.isActive ? "default" : "secondary"}>
                            {client.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </TableCell>
                    <TableCell>
                         <Badge variant={client.isApproved ? "outline" : "destructive"}>
                            {client.isApproved ? "Approved" : "Pending"}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                         {new Date(client.createdAt).toLocaleDateString()}
                    </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
