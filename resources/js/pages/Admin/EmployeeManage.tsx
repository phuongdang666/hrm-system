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

            <Card>
                <CardHeader className="flex items-center justify-between">

                    <div className="flex items-center gap-2">
                        <Button>New Employee</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-4">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input value={code} onChange={(e) => form.setData('code', e.target.value)} placeholder="Code" className="w-full border px-3 py-2 rounded-md" />
                            <input value={name} onChange={(e) => form.setData('name', e.target.value)} placeholder="Name" className="w-full border px-3 py-2 rounded-md" />
                            <select value={departmentVal} onChange={(e) => form.setData('department', e.target.value)} className="border px-3 py-2 rounded-md">
                                <option value="">All departments</option>
                                {departments.map((d: any) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <select value={titleVal} onChange={(e) => form.setData('title', e.target.value)} className="border px-3 py-2 rounded-md">
                                <option value="">All titles</option>
                                {titles.map((t: any) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>

                            <select value={statusVal} onChange={(e) => form.setData('status', e.target.value)} className="border px-3 py-2 rounded-md">
                                <option value="">All status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell isHeader className="px-4 py-2">Code</TableCell>
                                    <TableCell isHeader className="px-4 py-2">Name</TableCell>
                                    <TableCell isHeader className="px-4 py-2">Department</TableCell>
                                    <TableCell isHeader className="px-4 py-2">Title</TableCell>
                                    <TableCell isHeader className="px-4 py-2">Status</TableCell>
                                    <TableCell isHeader className="px-4 py-2">Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.data?.map((e: any) => (
                                    <TableRow key={e.id}>
                                        <TableCell className="px-4 py-3">{e.code}</TableCell>
                                        <TableCell className="px-4 py-3">{e.name}</TableCell>
                                        <TableCell className="px-4 py-3">{e.department?.name}</TableCell>
                                        <TableCell className="px-4 py-3">{e.title?.name}</TableCell>
                                        <TableCell className="px-4 py-3">{e.status}</TableCell>
                                        <TableCell className="px-4 py-3">Actions</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* pagination */}
                        <div className="mt-4">
                            {employees.links && (
                                <div dangerouslySetInnerHTML={{ __html: employees.links }} />
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
