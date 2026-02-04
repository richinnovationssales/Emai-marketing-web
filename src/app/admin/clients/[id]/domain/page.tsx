'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/slices/auth.slice';
import { AdminRole } from '@/types/enums/admin-role.enum';
import { DomainActivityType } from '@/types/entities/domain.types';
import {
    useAdminDomainConfig,
    useAdminDomainHistory,
    useAdminUpdateDomain,
    useAdminRemoveDomain,
} from '@/lib/api/hooks/useAdminDomain';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import {
    Loader2,
    Globe,
    Mail,
    Shield,
    RefreshCw,
    Trash2,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowLeft,
    PenLine,
    ScrollText,
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import {
    isValidDomain,
    isPublicEmailProvider,
    mailgunDomainMatchRefinement,
    MAILGUN_DOMAIN_MATCH_MESSAGE,
} from '@/lib/validations/domain.schemas';

const domainFormSchema = z
    .object({
        mailgunDomain: z
            .string()
            .min(1, 'Domain is required')
            .refine(
                (val) => isValidDomain(val),
                'Please enter a valid domain (e.g., mail.yourdomain.com)',
            )
            .refine(
                (val) => !isPublicEmailProvider(val),
                'Public email providers (Gmail, Yahoo, Outlook, etc.) are not allowed',
            ),
        mailgunFromEmail: z
            .string()
            .email('Invalid email address')
            .refine(
                (val) => {
                    const domain = val.split('@')[1];
                    return domain ? !isPublicEmailProvider(domain) : true;
                },
                'Public email providers (Gmail, Yahoo, Outlook, etc.) are not allowed',
            ),
        mailgunFromName: z.string().min(1, 'From name is required'),
    })
    .refine(mailgunDomainMatchRefinement, {
        message: MAILGUN_DOMAIN_MATCH_MESSAGE,
        path: ['mailgunFromEmail'],
    });

type DomainFormValues = z.infer<typeof domainFormSchema>;

const activityConfig: Record<
    DomainActivityType,
    { label: string; variant: 'default' | 'secondary' | 'destructive'; icon: React.ComponentType<{ className?: string }> }
> = {
    MAILGUN_DOMAIN_CONFIGURED: {
        label: 'Configured',
        variant: 'default',
        icon: Globe,
    },
    MAILGUN_DOMAIN_UPDATED: {
        label: 'Updated',
        variant: 'secondary',
        icon: PenLine,
    },
    MAILGUN_DOMAIN_REMOVED: {
        label: 'Removed',
        variant: 'destructive',
        icon: Trash2,
    },
};

export default function AdminClientDomainPage() {
    const params = useParams();
    const clientId = params.id as string;
    const currentUser = useAppSelector(selectCurrentUser);

    const { data: domainConfig, isLoading, isError, refetch } = useAdminDomainConfig(clientId);
    const { data: historyData, isLoading: historyLoading } = useAdminDomainHistory(clientId);
    const updateDomain = useAdminUpdateDomain(clientId);
    const removeDomain = useAdminRemoveDomain(clientId);

    const [activeTab, setActiveTab] = useState('configuration');

    const form = useForm<DomainFormValues>({
        resolver: zodResolver(domainFormSchema),
        defaultValues: {
            mailgunDomain: '',
            mailgunFromEmail: '',
            mailgunFromName: '',
        },
    });

    useEffect(() => {
        if (domainConfig) {
            form.reset({
                mailgunDomain: domainConfig.mailgunDomain || '',
                mailgunFromEmail: domainConfig.mailgunFromEmail || '',
                mailgunFromName: domainConfig.mailgunFromName || '',
            });
        }
    }, [domainConfig, form]);

    // Check if user is SUPER_ADMIN
    const hasPermission = currentUser?.role === AdminRole.SUPER_ADMIN;

    if (!hasPermission) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Alert variant="destructive">
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>
                        Only Super Admins can manage client domain configurations.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load domain configuration. The client may not exist or you may not have access.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const handleSubmit = (values: DomainFormValues) => {
        updateDomain.mutate({
            mailgunDomain: values.mailgunDomain,
            mailgunFromEmail: values.mailgunFromEmail,
            mailgunFromName: values.mailgunFromName,
        });
    };

    const handleRemove = () => {
        removeDomain.mutate();
    };

    const history = historyData?.history || [];

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin/clients">Clients</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/admin/clients/${clientId}`}>
                            {domainConfig?.clientName || 'Client'}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Domain Settings</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Link href={`/admin/clients/${clientId}`}>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Domain Settings
                            </h1>
                            <p className="text-muted-foreground">
                                Manage Mailgun domain configuration for{' '}
                                <span className="font-medium text-foreground">
                                    {domainConfig?.clientName}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <Button variant="outline" onClick={() => refetch()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {/* Status Cards Row */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Domain</p>
                                <p className="text-lg font-semibold mt-1">
                                    {domainConfig?.mailgunDomain || 'Not configured'}
                                </p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-full">
                                <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">From Email</p>
                                <p className="text-lg font-semibold mt-1">
                                    {domainConfig?.mailgunFromEmail || 'Not configured'}
                                </p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-950 p-3 rounded-full">
                                <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Verification</p>
                                <div className="flex items-center gap-2 mt-1">
                                    {domainConfig?.mailgunVerified ? (
                                        <>
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            <span className="text-lg font-semibold">Verified</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-5 w-5 text-yellow-500" />
                                            <span className="text-lg font-semibold">Not Verified</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-full">
                                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs: Configuration & History */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="configuration">
                        <Globe className="mr-2 h-4 w-4" />
                        Configuration
                    </TabsTrigger>
                    <TabsTrigger value="history">
                        <ScrollText className="mr-2 h-4 w-4" />
                        History ({history.length})
                    </TabsTrigger>
                </TabsList>

                {/* Configuration Tab */}
                <TabsContent value="configuration" className="space-y-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Registration Email */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Mail className="h-5 w-5" />
                                        Default Sender
                                    </CardTitle>
                                    <CardDescription>
                                        The client&apos;s registration email used as fallback sender
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Registration Email</p>
                                            <p className="font-medium">
                                                {domainConfig?.registrationEmail || 'Not set'}
                                            </p>
                                        </div>
                                        <Badge variant="secondary">Read-only</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Domain Configuration Form */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="h-5 w-5" />
                                        Custom Domain Configuration
                                    </CardTitle>
                                    <CardDescription>
                                        Configure a custom Mailgun domain for this client
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(handleSubmit)}
                                            className="space-y-6"
                                        >
                                            <FormField
                                                control={form.control}
                                                name="mailgunDomain"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Mailgun Domain</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="mail.clientdomain.com"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            The client&apos;s verified Mailgun sending domain
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="mailgunFromEmail"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>From Email</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="email"
                                                                placeholder="noreply@clientdomain.com"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Email address that will appear in the
                                                            &quot;From&quot; field
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="mailgunFromName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>From Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Client Company Name"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Display name alongside the sender email
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Separator />

                                            <div className="flex items-center gap-4">
                                                <Button
                                                    type="submit"
                                                    disabled={updateDomain.isPending}
                                                >
                                                    {updateDomain.isPending ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        'Save Configuration'
                                                    )}
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            disabled={
                                                                removeDomain.isPending ||
                                                                !domainConfig?.mailgunDomain
                                                            }
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Remove Domain
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Remove Domain Configuration?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will remove the custom domain settings for{' '}
                                                                <strong>{domainConfig?.clientName}</strong>.
                                                                Their emails will revert to the default sender.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={handleRemove}>
                                                                Remove
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Verification Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        {domainConfig?.mailgunVerified ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-yellow-500" />
                                        )}
                                        <div>
                                            <p className="font-medium">
                                                {domainConfig?.mailgunVerified
                                                    ? 'Verified'
                                                    : 'Not Verified'}
                                            </p>
                                            {domainConfig?.mailgunVerifiedAt && (
                                                <p className="text-sm text-muted-foreground">
                                                    {format(
                                                        new Date(domainConfig.mailgunVerifiedAt),
                                                        'MMM d, yyyy HH:mm'
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {!domainConfig?.mailgunVerified &&
                                        domainConfig?.mailgunDomain && (
                                            <p className="text-sm text-muted-foreground">
                                                Domain verification is pending. DNS records need to
                                                be configured in Mailgun.
                                            </p>
                                        )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Client Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Client Name</p>
                                        <p className="text-sm font-medium">
                                            {domainConfig?.clientName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Client ID</p>
                                        <p className="text-sm font-mono text-muted-foreground">
                                            {domainConfig?.clientId}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ScrollText className="h-5 w-5" />
                                Domain Change History
                            </CardTitle>
                            <CardDescription>
                                All changes to domain configuration, including those by the client and admins
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {historyLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-20 w-full" />
                                    <Skeleton className="h-20 w-full" />
                                    <Skeleton className="h-20 w-full" />
                                </div>
                            ) : history.length > 0 ? (
                                <div className="space-y-4">
                                    {history.map((item) => {
                                        const config = activityConfig[item.activityType];
                                        const IconComponent = config.icon;

                                        return (
                                            <div
                                                key={item.id}
                                                className="flex items-start gap-4 p-4 border rounded-lg"
                                            >
                                                <div className="mt-0.5 rounded-full bg-muted p-2">
                                                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="font-medium text-sm">
                                                            {item.description}
                                                        </p>
                                                        <Badge variant={config.variant}>
                                                            {config.label}
                                                        </Badge>
                                                        <Badge variant="outline">
                                                            {item.performedByRole}
                                                        </Badge>
                                                    </div>

                                                    {item.metadata && (
                                                        <div className="text-sm text-muted-foreground space-y-1 mt-2">
                                                            {item.metadata.previousDomain !== undefined &&
                                                                item.metadata.newDomain !== undefined && (
                                                                    <p>
                                                                        Domain:{' '}
                                                                        <span className="line-through">
                                                                            {item.metadata.previousDomain || 'none'}
                                                                        </span>
                                                                        {' → '}
                                                                        <span className="font-medium text-foreground">
                                                                            {item.metadata.newDomain || 'none'}
                                                                        </span>
                                                                    </p>
                                                                )}
                                                            {item.metadata.previousFromEmail !== undefined &&
                                                                item.metadata.newFromEmail !== undefined && (
                                                                    <p>
                                                                        From Email:{' '}
                                                                        <span className="line-through">
                                                                            {item.metadata.previousFromEmail || 'none'}
                                                                        </span>
                                                                        {' → '}
                                                                        <span className="font-medium text-foreground">
                                                                            {item.metadata.newFromEmail || 'none'}
                                                                        </span>
                                                                    </p>
                                                                )}
                                                            {item.metadata.previousFromName !== undefined &&
                                                                item.metadata.newFromName !== undefined && (
                                                                    <p>
                                                                        From Name:{' '}
                                                                        <span className="line-through">
                                                                            {item.metadata.previousFromName || 'none'}
                                                                        </span>
                                                                        {' → '}
                                                                        <span className="font-medium text-foreground">
                                                                            {item.metadata.newFromName || 'none'}
                                                                        </span>
                                                                    </p>
                                                                )}
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                                                        <span>
                                                            {format(
                                                                new Date(item.createdAt),
                                                                "MMM d, yyyy 'at' HH:mm"
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <ScrollText className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium mb-1">No History Yet</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Domain configuration changes will appear here once an update is made.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
