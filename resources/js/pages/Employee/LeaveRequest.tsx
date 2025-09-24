import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import Button from "@/components/ui/button/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EmployeeLayout from '@/layouts/employee/EmployeeLayout';
import PageMeta from '@/components/common/PageMeta';
import { format } from 'date-fns';

interface LeaveRequest {
    id: number;
    employee_id: number;
    department_id: number;
    type: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    employee: {
        name: string;
    };
}

interface Props extends PageProps {
    leaveRequests: LeaveRequest[];
    userRole: 'staff' | 'manager';
    departmentMembers: Array<{
        id: number;
        name: string;
    }>;
}

export default function LeaveRequest({ leaveRequests, userRole, departmentMembers }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, reset, errors } = useForm({
        start_date: '',
        end_date: '',
        type: '',
        reason: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('employee.leave-requests.store'), {
            ...data,
            onSuccess: () => {
                setIsOpen(false);
                reset();
            },
        });
    };

    const handleStatusUpdate = (leaveRequestId: number, status: 'approved' | 'rejected') => {
        const form = useForm({
            _method: 'patch',
            status,
        });

        form.post(route('employee.leave-requests.update-status', leaveRequestId), {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Status updated successfully");
            },
            onError: (errors) => {
                console.error("Failed to update status", errors);
            },
        });
    };

    return (
        <EmployeeLayout>
            <PageMeta title="Leave Requests" description="Manage your leave requests" />
            <div className="mb-6">
                <div className="text-xl font-semibold">Leave Requests</div>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* Actions and Summary */}
                <div className="md:col-span-4">
                    <Card className="overflow-hidden border border-blue-100/50 shadow-lg shadow-blue-900/5">
                        <CardHeader className="bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 border-b border-blue-100/50">
                            <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                                Leave Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {userRole === 'staff' && (
                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white">
                                            New Leave Request
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px]">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                                                Submit Leave Request
                                            </DialogTitle>
                                            <p className="text-gray-500">Fill in the details for your leave request.</p>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="space-y-6 mt-4  p-4 rounded-lg">
                                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                                <div>
                                                    <Label htmlFor="start_date" className="text-gray-700">Start Date</Label>
                                                    <Input
                                                        id="start_date"
                                                        type="date"
                                                        value={data.start_date}
                                                        onChange={(e) => setData('start_date', e.target.value)}
                                                        className="mt-1 w-full px-4 py-2.5 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
                                                    />
                                                    {errors.start_date && (
                                                        <div className="mt-1 text-sm text-red-600">{errors.start_date}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label htmlFor="end_date" className="text-gray-700">End Date</Label>
                                                    <Input
                                                        id="end_date"
                                                        type="date"
                                                        value={data.end_date}
                                                        onChange={(e) => setData('end_date', e.target.value)}
                                                        className="mt-1 w-full px-4 py-2.5 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
                                                    />
                                                    {errors.end_date && (
                                                        <div className="mt-1 text-sm text-red-600">{errors.end_date}</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="type" className="text-gray-700">Leave Type</Label>
                                                <select
                                                    id="type"
                                                    value={data.type}
                                                    onChange={(e) => setData('type', e.target.value)}
                                                    className="mt-1 w-full px-4 py-2.5 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
                                                >
                                                    <option value="">Select a type</option>
                                                    <option value="sick">Sick Leave</option>
                                                    <option value="annual">Annual Leave</option>
                                                    <option value="other">Other</option>
                                                </select>
                                                {errors.type && (
                                                    <div className="mt-1 text-sm text-red-600">{errors.type}</div>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="reason" className="text-gray-700">Reason for Leave</Label>
                                                <Textarea
                                                    id="reason"
                                                    value={data.reason}
                                                    onChange={(e) => setData('reason', e.target.value)}
                                                    className="mt-1 w-full px-4 py-2.5 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none bg-white"
                                                    placeholder="Please provide detailed reason for your leave request..."
                                                    rows={3}
                                                />
                                                {errors.reason && (
                                                    <div className="mt-1 text-sm text-red-600">{errors.reason}</div>
                                                )}
                                            </div>
                                            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                                                <Button
                                                    type="button"
                                                    onClick={() => setIsOpen(false)}
                                                    className="px-6 py-2.5 bg-gray-600 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white rounded-lg transition-all duration-200"
                                                >
                                                    Submit Request
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            )}

                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Quick Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Pending</span>
                                        <span className="font-medium text-yellow-600">
                                            {leaveRequests.filter(r => r.status === 'pending').length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Approved</span>
                                        <span className="font-medium text-green-600">
                                            {leaveRequests.filter(r => r.status === 'approved').length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Rejected</span>
                                        <span className="font-medium text-red-600">
                                            {leaveRequests.filter(r => r.status === 'rejected').length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Leave Requests List */}
                <div className="md:col-span-8">
                    <div className="space-y-4">
                        {leaveRequests.map((request) => (
                            <Card key={request.id} className="overflow-hidden border border-blue-100/50 shadow-lg shadow-blue-900/5">
                                <CardHeader className="bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 border-b border-blue-100/50">
                                    <CardTitle className="text-lg font-bold">
                                        {userRole === 'manager' ? request.employee.name : 'Your Leave Request'}
                                    </CardTitle>
                                    <CardDescription>
                                        Submitted on {format(new Date(request.created_at), 'PPP')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Date Range</p>
                                            <p className="mt-1">{format(new Date(request.start_date), 'PPP')} - {format(new Date(request.end_date), 'PPP')}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Reason</p>
                                            <p className="mt-1">{request.reason}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Status</p>
                                            <p className={`mt-1 capitalize font-medium ${request.status === 'approved' ? 'text-green-600' :
                                                request.status === 'rejected' ? 'text-red-600' :
                                                    'text-yellow-600'
                                                }`}>
                                                {request.status}
                                            </p>
                                        </div>
                                        {userRole === 'manager' && request.status === 'pending' && (
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    onClick={() => handleStatusUpdate(request.id, 'approved')}
                                                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    onClick={() => handleStatusUpdate(request.id, 'rejected')}
                                                    className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {leaveRequests.length === 0 && (
                            <Card className="overflow-hidden border border-blue-100/50 shadow-lg shadow-blue-900/5">
                                <CardContent className="p-6 text-center text-gray-500">
                                    No leave requests found.
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </EmployeeLayout>
    );
}