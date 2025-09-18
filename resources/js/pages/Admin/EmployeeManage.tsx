import React, { useState } from "react";
import AdminLayout from "@/layouts/admin/AdminLayout";
import PageMeta from "@/components/common/PageMeta";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";

export default function EmployeeManage() {
    const [query, setQuery] = useState("");
    const [department, setDepartment] = useState("");

    // Placeholder employees — replace with API data
    const employees = [
        { id: 1, name: "Lindsey Curtis", dept: "Engineering", role: "Designer" },
        { id: 2, name: "Kaiya George", dept: "Marketing", role: "Manager" },
    ];

    const departments = ["HR", "Engineering", "Sales", "Marketing"];

    return (
        <AdminLayout>
            <PageMeta title="Employee Management" description="Admin - Manage employees" />
            <PageBreadcrumb pageTitle="Employees" />

            <Card>
                <CardHeader className="flex items-center justify-between">
                    <div>
                        <CardTitle>Employees</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline">Export CSV</Button>
                        <Button>New Employee</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-4">
                        <div className="flex-1">
                            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search employees..." className="w-full border px-3 py-2 rounded-md" />
                        </div>

                        <select value={department} onChange={(e) => setDepartment(e.target.value)} className="border px-3 py-2 rounded-md">
                            <option value="">All departments</option>
                            {departments.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell isHeader className="px-4 py-2">Name</TableCell>
                                    <TableCell isHeader className="px-4 py-2">Department</TableCell>
                                    <TableCell isHeader className="px-4 py-2">Role</TableCell>
                                    <TableCell isHeader className="px-4 py-2">Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.map((e) => (
                                    <TableRow key={e.id}>
                                        <TableCell className="px-4 py-3">{e.name}</TableCell>
                                        <TableCell className="px-4 py-3">{e.dept}</TableCell>
                                        <TableCell className="px-4 py-3">{e.role}</TableCell>
                                        <TableCell className="px-4 py-3">Actions</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
