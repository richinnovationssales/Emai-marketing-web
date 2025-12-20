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
import { CreatePlanDTO, UpdatePlanDTO, Plan } from '@/types/entities/plan.types';
import { useEffect } from 'react';

const planFormSchema = z.object({
    name: z.string().min(1, 'Plan name is required').max(255, 'Name too long'),
    price: z.coerce.number().min(0, 'Price must be 0 or greater'),
    emailLimit: z.coerce.number().int().min(1, 'Email limit must be at least 1'),
});

type PlanFormValues = z.infer<typeof planFormSchema>;

interface PlanFormProps {
    plan?: Plan;
    onSubmit: (data: CreatePlanDTO | UpdatePlanDTO) => void;
    loading?: boolean;
    onCancel?: () => void;
}

export function PlanForm({ plan, onSubmit, loading, onCancel }: PlanFormProps) {
    const form = useForm<PlanFormValues>({
        resolver: zodResolver(planFormSchema),
        defaultValues: {
            name: plan?.name || '',
            price: plan?.price || 0,
            emailLimit: plan?.emailLimit || 1000,
        },
    });

    useEffect(() => {
        if (plan) {
            form.reset({
                name: plan.name,
                price: plan.price,
                emailLimit: plan.emailLimit,
            });
        }
    }, [plan, form]);

    const handleSubmit = (values: PlanFormValues) => {
        onSubmit(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Plan Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Professional" {...field} />
                            </FormControl>
                            <FormDescription>
                                The name of the subscription plan
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price (USD)</FormLabel>
                            <FormControl>
                                <Input 
                                    type="number" 
                                    step="0.01" 
                                    placeholder="99.99" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormDescription>
                                Monthly price in USD (minimum $0)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="emailLimit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Limit</FormLabel>
                            <FormControl>
                                <Input 
                                    type="number" 
                                    step="1" 
                                    placeholder="10000" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormDescription>
                                Maximum number of emails per month (minimum 1)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-2">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={loading}>
                        {loading ? (plan ? 'Updating...' : 'Creating...') : (plan ? 'Update Plan' : 'Create Plan')}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
