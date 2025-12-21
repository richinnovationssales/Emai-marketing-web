'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plan } from '@/types/entities/plan.types';
import { CreateClientDTO } from '@/types/entities/client.types';
import { CustomFieldBuilder } from './CustomFieldBuilder';
import { useAppSelector } from '@/store/hooks';
import { selectCustomFieldsBuilder, selectUseDefaultFields } from '@/store/slices/admin.slice';

const clientFormSchema = z.object({
    name: z.string().min(1, 'Client name is required').max(255, 'Name too long'),
    planId: z.string().min(1, 'Plan is required'),
    adminEmail: z.string().email('Invalid email address'),
    adminPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
    plans: Plan[];
    onSubmit: (data: CreateClientDTO) => void;
    loading?: boolean;
}

export function ClientForm({ plans, onSubmit, loading }: ClientFormProps) {
    const customFields = useAppSelector(selectCustomFieldsBuilder);
    const useDefaultFields = useAppSelector(selectUseDefaultFields);
    
    const form = useForm<ClientFormValues>({
        resolver: zodResolver(clientFormSchema),
        defaultValues: {
            name: '',
            planId: '',
            adminEmail: '',
            adminPassword: '',
        },
    });

    const handleSubmit = (values: ClientFormValues) => {
        const submitData: CreateClientDTO = {
            ...values,
            // Only include customFields if not using defaults
            customFields: useDefaultFields ? undefined : (customFields.length > 0 ? customFields : undefined),
        };
        onSubmit(submitData);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Client Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Acme Corporation" {...field} />
                            </FormControl>
                            <FormDescription>
                                The company or organization name
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="planId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Plan</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a plan" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {plans.map((plan) => (
                                        <SelectItem key={plan.id} value={plan.id}>
                                            {plan.name} - ${plan.price}/mo ({plan.emailLimit.toLocaleString()} emails)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Select the subscription plan for this client
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="adminEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Admin Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="admin@acme.com" {...field} />
                            </FormControl>
                            <FormDescription>
                                Email for the client's super admin user
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="adminPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Admin Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormDescription>
                                Must be at least 8 characters with uppercase, lowercase, and number
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Custom Fields Builder */}
                <CustomFieldBuilder />

                <div className="flex justify-end space-x-2">
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Client'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
