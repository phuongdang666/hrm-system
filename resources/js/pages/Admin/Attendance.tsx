import React, { useState } from "react";
import AdminLayout from "@/layouts/admin/AdminLayout";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";

export default function Attendance() {
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const records = [
        { id: 1, employee: "John Doe", date: "2025-09-17", checkIn: "09:00", checkOut: "17:30" },
    ];

    return (
        <AdminLayout>
            <PageMeta title="Attendance Management" description="Admin - Manage attendance" />
            <PageBreadcrumb pageTitle="Attendance" />

            <Card>
                <CardHeader className="flex items-center justify-between">
                    <div>
                        <CardTitle>Attendance</CardTitle>
                        <div className="text-sm text-muted-foreground">View and edit attendance records.</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border px-2 py-1 rounded-md" />
                        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border px-2 py-1 rounded-md" />
                        <Button variant="outline">Export CSV</Button>
                        <Button variant="outline">Export PDF</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell isHeader className="px-4 py-2">Employee</TableCell>
                                    <TableCell isHeader className="px-4 py-2">Date</TableCell>
                                    <TableCell isHeader className="px-4 py-2">Check In</TableCell>
                                    <TableCell isHeader className="px-4 py-2">Check Out</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="px-4 py-3">{r.employee}</TableCell>
                                        <TableCell className="px-4 py-3">{r.date}</TableCell>
                                        <TableCell className="px-4 py-3">{r.checkIn}</TableCell>
                                        <TableCell className="px-4 py-3">{r.checkOut}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-4 text-sm text-gray-500">(Edit attendance rows to adjust missing check-out — placeholder.)</div>
        </AdminLayout>
    );
}
