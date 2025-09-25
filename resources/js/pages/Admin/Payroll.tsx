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

            <Card className="mb-6 overflow-hidden border-0 shadow-lg bg-gradient-to-r from-purple-500 to-indigo-600">
                <CardHeader className="border-b border-white/10">
                    <CardTitle className="text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Generate Payroll
                    </CardTitle>
                </CardHeader>
                <CardContent className="bg-white/5">
                    <form onSubmit={handleFilter} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-white mb-1">
                                Select Month
                            </label>
                            <input
                                type="month"
                                value={form.data.month}
                                onChange={e => form.setData('month', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-white/20 bg-white/10 text-white placeholder-white/50 focus:border-white focus:ring-2 focus:ring-white/20"
                            />
                        </div>
                        <Button type="submit" className="bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filter
                        </Button>
                        <Button
                            type="button"
                            onClick={handleGenerateClick}
                            className="bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Generate Payroll
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white">
                <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Payroll List - {month}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/80">
                                    <TableCell className="font-semibold text-gray-700">Employee</TableCell>
                                    <TableCell className="font-semibold text-gray-700">Base Salary</TableCell>
                                    <TableCell className="font-semibold text-gray-700">OT Hours</TableCell>
                                    <TableCell className="font-semibold text-gray-700">Unpaid Leave</TableCell>
                                    <TableCell className="font-semibold text-gray-700">Final Salary</TableCell>
                                    <TableCell className="font-semibold text-gray-700">Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payrolls.data.map((payroll: Payroll) => (
                                    <TableRow key={payroll.id} className={`group hover:bg-gray-50 transition-all duration-200 ${payroll.id % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}>
                                        <TableCell className="font-medium text-gray-900">{payroll.employee.name}</TableCell>
                                        <TableCell className="text-emerald-600 font-medium">
                                            ${payroll.base_salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {payroll.total_overtime_hours} hrs
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                {payroll.unpaid_leave_days} days
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-lg font-semibold text-emerald-600">
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
                                        <TableCell>
                                            <div className="flex flex-col items-center justify-center py-12">
                                                <div className="w-16 h-16 text-gray-300 mb-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-1">No Records Found</h3>
                                                <p className="text-gray-500">No payroll records found for this month.</p>
                                            </div>
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