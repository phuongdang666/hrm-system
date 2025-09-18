import React, { useState } from "react";
import AdminLayout from "@/layouts/admin/AdminLayout";
import PageMeta from "@/components/common/PageMeta";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";

export default function DepartmentManage() {
    const [name, setName] = useState("");
    const [manager, setManager] = useState("");

    const managers = ["Alice", "Bob", "Charlie"];

    const departments = [
        { id: 1, name: "Engineering", manager: "Alice" },
        { id: 2, name: "HR", manager: "Bob" },
    ];

    return (
        <AdminLayout>
            <PageMeta title="Department Management" description="Admin - Manage departments" />
            <PageBreadcrumb pageTitle="Departments" />

            <Card>
                <CardHeader className="flex items-center justify-between">
                    <div>
                        <CardTitle>Departments</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button>New Department</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="flex gap-2">
                            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Department name" className="border px-3 py-2 rounded-md flex-1" />
                            <select value={manager} onChange={(e) => setManager(e.target.value)} className="border px-3 py-2 rounded-md">
                                <option value="">Assign manager</option>
                                {managers.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <Button> Create </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell isHeader className="px-4 py-2">Name</TableCell>
                                    <TableCell isHeader className="px-4 py-2">Manager</TableCell>
                                    <TableCell isHeader className="px-4 py-2">Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {departments.map((d) => (
                                    <TableRow key={d.id}>
                                        <TableCell className="px-4 py-3">{d.name}</TableCell>
                                        <TableCell className="px-4 py-3">{d.manager}</TableCell>
                                        <TableCell className="px-4 py-3">Edit / Delete</TableCell>
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
