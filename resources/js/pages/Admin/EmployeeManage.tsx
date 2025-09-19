import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin/AdminLayout";
import PageMeta from "@/components/common/PageMeta";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";

export default function EmployeeManage({ employees, filters = {}, departments = [], titles = [] }: any) {
    const form: any = useForm({
        code: filters.code || "",
        name: filters.name || "",
        department: filters.department || "",
        title: filters.title || "",
        status: filters.status ?? "",
    });

    useEffect(() => {
        // Use Ziggy's route() that Blade injected; fall back to window.route to satisfy TS
        const url = (window as any).route ? (window as any).route("admin.employees.index") : "/admin/employees";
        form.get(url, { preserveState: true, replace: true });
    }, [form.data.code, form.data.name, form.data.department, form.data.title, form.data.status]);

    // cast to any to avoid deep TS instantiation issues when accessing form.data
    const formData: any = form.data || {};
    const code = formData.code || "";
    const name = formData.name || "";
    const departmentVal = formData.department || "";
    const titleVal = formData.title || "";
    const statusVal = formData.status ?? "";

    return (
        <AdminLayout>
            <PageMeta title="Employee Management" description="Admin - Manage employees" />
            <PageBreadcrumb pageTitle="Employees" />

            <Card className="bg-white shadow-sm border-0">
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-4">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input value={code} onChange={(e) => form.setData('code', e.target.value)} placeholder="Search by code..." className="w-full border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-md text-sm transition-shadow" />
                            <input value={name} onChange={(e) => form.setData('name', e.target.value)} placeholder="Search by name..." className="w-full border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-md text-sm transition-shadow" />
                            <select value={departmentVal} onChange={(e) => form.setData('department', e.target.value)} className="w-full border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-md text-sm transition-shadow bg-white">
                                <option value="">All departments</option>
                                {departments.map((d: any) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <select value={titleVal} onChange={(e) => form.setData('title', e.target.value)} className="border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-md text-sm transition-shadow bg-white">
                                <option value="">Filter by title...</option>
                                {titles.map((t: any) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>

                            <select value={statusVal} onChange={(e) => form.setData('status', e.target.value)} className="border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-md text-sm transition-shadow bg-white">
                                <option value="">Filter by status...</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <div className="flex items-center">
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all duration-150 ease-in-out hover:shadow-indigo-100 hover:shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    New Employee
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                        <Table className="min-w-full divide-y divide-gray-200">
                            <TableHeader>
                                <TableRow className="bg-gray-50 border-t border-b border-gray-200">
                                    <TableCell isHeader className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Code</TableCell>
                                    <TableCell isHeader className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</TableCell>
                                    <TableCell isHeader className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Department</TableCell>
                                    <TableCell isHeader className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</TableCell>
                                    <TableCell isHeader className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableCell>
                                    <TableCell isHeader className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.data?.map((e: any) => (
                                    <TableRow key={e.id} className="hover:bg-gray-50/80 transition-all duration-150 ease-in-out border-b border-gray-100 last:border-b-0">
                                        <TableCell className="px-4 py-3 text-gray-600">{e.code}</TableCell>
                                        <TableCell className="px-4 py-3 font-medium text-gray-900">{e.name}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                                {e.department?.name}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                                                {e.title?.name}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${e.status === 'active' ? 'bg-green-100 text-green-700 ring-1 ring-green-600/20' : 'bg-gray-100 text-gray-600 ring-1 ring-gray-500/10'}`}>
                                                <span className={`mr-1 ${e.status === 'active' ? 'text-green-500' : 'text-gray-400'}`}>•</span>
                                                {e.status === 'active' ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </button>
                                                <button className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-150">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => form.get(employees.prev_page_url || '#', { preserveState: true })}
                                    disabled={!employees.prev_page_url}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${!employees.prev_page_url ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => form.get(employees.next_page_url || '#', { preserveState: true })}
                                    disabled={!employees.next_page_url}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${!employees.next_page_url ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{employees.from || 0}</span> to{' '}
                                        <span className="font-medium">{employees.to || 0}</span> of{' '}
                                        <span className="font-medium">{employees.total || 0}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <button
                                            onClick={() => form.get(employees.prev_page_url || '#', { preserveState: true })}
                                            disabled={!employees.prev_page_url}
                                            className={`relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ${!employees.prev_page_url ? 'text-gray-300 cursor-not-allowed ring-gray-200' : 'text-gray-500 hover:bg-gray-50 ring-gray-300'}`}
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {employees.links?.slice(1, -1).map((link: any) => (
                                            <button
                                                key={link.label}
                                                onClick={() => form.get(link.url || '#', { preserveState: true })}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 ${link.active ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : 'text-gray-900 hover:bg-gray-50 focus:z-20'}`}
                                            >
                                                {link.label}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => form.get(employees.next_page_url || '#', { preserveState: true })}
                                            disabled={!employees.next_page_url}
                                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ${!employees.next_page_url ? 'text-gray-300 cursor-not-allowed ring-gray-200' : 'text-gray-500 hover:bg-gray-50 ring-gray-300'}`}
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
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
