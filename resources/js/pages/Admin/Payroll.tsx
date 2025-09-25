import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from "@/layouts/admin/AdminLayout";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";

interface Payroll {
    id: number;
    employee: {
        id: number;
        name: string;
    };
    month: string;
    base_salary: number;
    total_overtime_hours: number;
    unpaid_leave_days: number;
    net_salary: number;
    status: string;
}

interface PaginatedData {
    current_page: number;
    data: Payroll[];
    from: number;
    to: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    payrolls: PaginatedData;
    month: string;
}

export default function PayrollPage({ payrolls, month }: Props) {
    const form = useForm({
        month: month || new Date().toISOString().slice(0, 7),
    });

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        form.get(route('admin.payrolls.index'), {
            preserveState: true,
        });
    };

    const handleGenerateClick = () => {
        form.post(route('admin.payrolls.generate'), {
            preserveState: true,
            onSuccess: () => {
                form.reset('month');
            },
        });
    };

    return (
        <AdminLayout>
            <PageMeta title="Payroll Management" description="Manage employee payrolls" />
            <PageBreadcrumb
                pageTitle="Payroll Management"
            ></PageBreadcrumb>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Generate Payroll</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleFilter} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Month
                            </label>
                            <input
                                type="month"
                                value={form.data.month}
                                onChange={e => form.setData('month', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <Button type="submit" className="bg-blue-600 text-white">
                            Filter
                        </Button>
                        <Button
                            type="button"
                            onClick={handleGenerateClick}
                            className="bg-green-600 text-white"
                        >
                            Generate Payroll
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payroll List - {month}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell>Employee</TableCell>
                                    <TableCell>Base Salary</TableCell>
                                    <TableCell>OT Hours</TableCell>
                                    <TableCell>Unpaid Leave</TableCell>
                                    <TableCell>Final Salary</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payrolls.data.map((payroll: Payroll) => (
                                    <TableRow key={payroll.id} className={`group hover:bg-gray-50 transition-all duration-200 ${payroll.id % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}>
                                        <TableCell>{payroll.employee.name}</TableCell>
                                        <TableCell>
                                            ${payroll.base_salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell>{payroll.total_overtime_hours} hrs</TableCell>
                                        <TableCell>{payroll.unpaid_leave_days} days</TableCell>
                                        <TableCell>
                                            ${payroll.net_salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell>
                                            <Link href={route('admin.payrolls.show', payroll.id)}>
                                                <button
                                                    className="p-2 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-100/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                    title="View Details"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                </button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {payrolls.data.length === 0 && (
                                    <TableRow>
                                        <TableCell className="text-center py-4">
                                            No payroll records found for this month.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <button
                                onClick={() => payrolls.prev_page_url && form.get(payrolls.prev_page_url, { preserveState: true })}
                                disabled={!payrolls.prev_page_url}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${!payrolls.prev_page_url ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => payrolls.next_page_url && form.get(payrolls.next_page_url, { preserveState: true })}
                                disabled={!payrolls.next_page_url}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${!payrolls.next_page_url ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{payrolls.from || 0}</span> to{' '}
                                    <span className="font-medium">{payrolls.to || 0}</span> of{' '}
                                    <span className="font-medium">{payrolls.total || 0}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    <button
                                        onClick={() => payrolls.prev_page_url && form.get(payrolls.prev_page_url, { preserveState: true })}
                                        disabled={!payrolls.prev_page_url}
                                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ${!payrolls.prev_page_url ? 'text-gray-300 cursor-not-allowed ring-gray-200' : 'text-gray-500 hover:bg-gray-50 ring-gray-300'}`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {payrolls.links?.slice(1, -1).map((link: { url: string | null; label: string; active: boolean }) => (
                                        <button
                                            key={link.label}
                                            onClick={() => link.url && form.get(link.url, { preserveState: true })}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 ${link.active ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : 'text-gray-900 hover:bg-gray-50 focus:z-20'}`}
                                        >
                                            {link.label}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => payrolls.next_page_url && form.get(payrolls.next_page_url, { preserveState: true })}
                                        disabled={!payrolls.next_page_url}
                                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ${!payrolls.next_page_url ? 'text-gray-300 cursor-not-allowed ring-gray-200' : 'text-gray-500 hover:bg-gray-50 ring-gray-300'}`}
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}