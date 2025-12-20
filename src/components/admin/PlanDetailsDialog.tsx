'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Plan } from '@/types/entities/plan.types';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Mail, Calendar } from 'lucide-react';
import { FormattedDate } from '@/components/ui/formatted-date';

interface PlanDetailsDialogProps {
    plan: Plan | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PlanDetailsDialog({ plan, open, onOpenChange }: PlanDetailsDialogProps) {
    if (!plan) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{plan.name}</DialogTitle>
                    <DialogDescription>Plan Details</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Pricing Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Pricing</h3>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                            <div className="flex items-center space-x-3 mb-2">
                                <DollarSign className="h-6 w-6 text-green-600" />
                                <span className="text-gray-600">Monthly Price</span>
                            </div>
                            <p className="text-4xl font-bold text-green-600">
                                ${plan.price.toFixed(2)}
                                <span className="text-lg text-gray-500 font-normal">/month</span>
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Features */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Features</h3>
                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                            <div className="flex items-center space-x-3 mb-2">
                                <Mail className="h-6 w-6 text-blue-600" />
                                <span className="text-gray-600">Email Limit</span>
                            </div>
                            <p className="text-4xl font-bold text-blue-600">
                                {plan.emailLimit.toLocaleString()}
                                <span className="text-lg text-gray-500 font-normal"> emails/month</span>
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Metadata */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Metadata</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Plan ID</p>
                                    <p className="font-mono text-sm">{plan.id}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Created</p>
                                    <div><FormattedDate date={plan.createdAt} formatStr="PPP" /></div>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Last Updated</p>
                                    <div><FormattedDate date={plan.updatedAt} formatStr="PPP" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
