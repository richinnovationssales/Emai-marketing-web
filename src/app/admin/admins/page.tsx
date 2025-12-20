'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, MoreHorizontal, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ROUTES } from '@/lib/constants/routes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAdmins,
  deleteAdmin as deleteAdminAction,
  toggleAdminStatus as toggleAdminStatusAction,
  selectAdmins,
  selectAdminLoading,
  selectAdminInitialized,
} from '@/store/slices/admin.slice';

export default function AdminsPage() {
  const dispatch = useAppDispatch();
  const admins = useAppSelector(selectAdmins);
  const loading = useAppSelector(selectAdminLoading);
  const initialized = useAppSelector(selectAdminInitialized);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!initialized) {
      dispatch(fetchAdmins());
    }
  }, [dispatch, initialized]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      try {
        await dispatch(deleteAdminAction(id)).unwrap();
        toast.success('Admin deleted successfully');
      } catch (error: any) {
        console.error('Failed to delete admin:', error);
        toast.error(error || 'Failed to delete admin');
      }
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      await dispatch(toggleAdminStatusAction({ id, isActive: !currentStatus })).unwrap();
      toast.success(`Admin ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      console.error('Failed to update admin status:', error);
      toast.error(error || 'Failed to update admin status');
    }
  };

  const filteredAdmins = admins?.filter(admin =>
    admin?.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admins</h1>
          <p className="text-muted-foreground">
            Manage administrative access and roles.
          </p>
        </div>
        <Button asChild>
          <Link href={ROUTES.ADMIN.ADMINS_CREATE}>
            <Plus className="mr-2 h-4 w-4" /> Add Admin
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>
            A list of all users with administrative privileges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search admins..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredAdmins?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      No admins found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdmins?.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{admin.role}</Badge>
                      </TableCell>
                      <TableCell>
                         <Badge
                            variant={admin.isActive ? 'default' : 'destructive'}
                            className="capitalize"
                          >
                            {admin.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                      </TableCell>
                      <TableCell>
                        {mounted ? new Date(admin.createdAt).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleStatusToggle(admin.id, admin.isActive)}
                            >
                              {admin.isActive ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" /> Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" /> Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(admin.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
