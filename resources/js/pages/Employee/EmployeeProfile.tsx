import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import EmployeeLayout from '@/layouts/employee/EmployeeLayout';
import PageMeta from '@/Components/common/PageMeta';
import PageBreadcrumb from '@/Components/common/PageBreadCrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import Button from '@/Components/ui/button/Button';
import AvatarUpload from '@/Components/employee/AvatarUpload';

interface Props {
    employee: {
        id: number;
        code: string;
        name: string;
        email: string;
        phone?: string;
        address?: string;
        avatar?: string;
        avatar_path?: string;
        base_salary: number;
        join_date: string;
        birth_date?: string;
        department?: {
            id: number;
            name: string;
        };
        title?: {
            id: number;
            name: string;
        };
    };
}

export default function EmployeeProfile({ employee }: Props) {
    const { props } = usePage();
    const flash: any = (props as any).flash || {};
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm({
        name: employee.name,
        email: employee.email,
        phone: employee.phone || '',
        address: employee.address || '',
        password: '',
        password_confirmation: '',
    });

    return (
        <EmployeeLayout>
            <PageMeta title="My Profile" description="View and update your profile" />
            <div className="mb-6">
                <div className="text-xl font-semibold">My Profile</div>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* Profile Overview */}
                <div className="md:col-span-4">
                    <Card className="overflow-hidden border border-blue-100/50 shadow-lg shadow-blue-900/5">
                        <CardContent className="p-6 text-center">
                            <div className="mb-4">
                                <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-white shadow-lg">
                                    {employee.avatar ? (
                                        <img
                                            src={`/storage/${employee.avatar}`}
                                            alt={employee.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-blue-500/20">
                                            {employee.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <AvatarUpload
                                        employeeId={employee.id}
                                        currentAvatar={employee.avatar}
                                        onAvatarUpdated={() => {
                                            window.location.reload();
                                        }}
                                    />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{employee.name}</h3>
                            <p className="text-sm text-gray-500">{employee.code}</p>
                            <div className="mt-4 space-y-2">
                                {employee.title && (
                                    <div className="text-sm text-gray-600">
                                        <strong className="text-gray-900">{employee.title.name}</strong>
                                    </div>
                                )}
                                {employee.department && (
                                    <div className="text-sm text-gray-600">
                                        {employee.department.name}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Profile Details & Form */}
                <div className="md:col-span-8">
                    <Card className="overflow-hidden border border-blue-100/50 shadow-lg shadow-blue-900/5">
                        <CardHeader className="bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 border-b border-blue-100/50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                                    Profile Information
                                </CardTitle>
                                <Button
                                    type="button"
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white"
                                >
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {flash.success && (
                                <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500 text-emerald-700 rounded-r-lg shadow-sm">
                                    {flash.success}
                                </div>
                            )}

                            {isEditing ? (
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    form.post(route('employee.profile.update'), {
                                        preserveScroll: true,
                                        onSuccess: () => setIsEditing(false),
                                        
                                    });
                                }}>
                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={form.data.name}
                                                onChange={e => form.setData('name', e.target.value)}
                                                className="mt-1 w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                            />
                                            {form.errors.name && (
                                                <div className="mt-1 text-sm text-red-600">{form.errors.name}</div>
                                            )}
                                        </div>

                                        {/* <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={form.data.email}
                                                onChange={e => form.setData('email', e.target.value)}
                                                className="mt-1 w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                            />
                                            {form.errors.email && (
                                                <div className="mt-1 text-sm text-red-600">{form.errors.email}</div>
                                            )}
                                        </div> */}

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={form.data.phone}
                                                onChange={e => form.setData('phone', e.target.value)}
                                                className="mt-1 w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                            />
                                            {form.errors.phone && (
                                                <div className="mt-1 text-sm text-red-600">{form.errors.phone}</div>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                            <textarea
                                                id="address"
                                                value={form.data.address}
                                                onChange={e => form.setData('address', e.target.value)}
                                                rows={3}
                                                className="mt-1 w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none"
                                            />
                                            {form.errors.address && (
                                                <div className="mt-1 text-sm text-red-600">{form.errors.address}</div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password (optional)</label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    value={form.data.password}
                                                    onChange={e => form.setData('password', e.target.value)}
                                                    className="mt-1 w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                                />
                                                {form.errors.password && (
                                                    <div className="mt-1 text-sm text-red-600">{form.errors.password}</div>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    id="password_confirmation"
                                                    value={form.data.password_confirmation}
                                                    onChange={e => form.setData('password_confirmation', e.target.value)}
                                                    className="mt-1 w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-4">
                                            <Button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white"
                                                disabled={form.processing}
                                            >
                                                {form.processing ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* Personal Info */}
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Employee Code</div>
                                                <div className="mt-1 text-gray-900">{employee.code}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Full Name</div>
                                                <div className="mt-1 text-gray-900">{employee.name}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Email</div>
                                                <div className="mt-1 text-gray-900">{employee.email}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Phone</div>
                                                <div className="mt-1 text-gray-900">{employee.phone || '—'}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Address</div>
                                                <div className="mt-1 text-gray-900">{employee.address || '—'}</div>
                                            </div>
                                        </div>

                                        {/* Work Info (Read-only) */}
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Department</div>
                                                <div className="mt-1 text-gray-900">{employee.department?.name || '—'}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Job Title</div>
                                                <div className="mt-1 text-gray-900">{employee.title?.name || '—'}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Join Date</div>
                                                <div className="mt-1 text-gray-900">
                                                    {new Date(employee.join_date).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Base Salary</div>
                                                <div className="mt-1 text-gray-900">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(employee.base_salary)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </EmployeeLayout>
    );
}