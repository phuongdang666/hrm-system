import React, { useState } from "react";
import AdminLayout from "@/layouts/admin/AdminLayout";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";

export default function Announcement() {
    const [query, setQuery] = useState("");

    // placeholder data
    const items = [
        { id: 1, title: "Office closed on Friday", read: false },
        { id: 2, title: "Payroll processed", read: true },
    ];

    const unreadCount = items.filter((i) => !i.read).length;

    return (
        <AdminLayout>
            <PageMeta title="Announcements" description="Admin - Send announcements" />
            <PageBreadcrumb pageTitle="Announcements" />

            <Card>
                <CardHeader className="flex items-center justify-between">
                    <div>
                        <CardTitle>Announcements</CardTitle>
                        <div className="text-sm text-gray-500">Create and broadcast announcements to employees or departments.</div>
                    </div>
                    <div className="text-sm text-gray-600">Unread: <span className="font-medium">{unreadCount}</span></div>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex gap-2">
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search announcements..." className="border px-3 py-2 rounded-md flex-1" />
                        <Button>New Announcement</Button>
                    </div>

                    <div className="divide-y">
                        {items.map((it) => (
                            <div key={it.id} className="p-4 flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{it.title}</div>
                                    <div className="text-xs text-gray-400">(sent to all)</div>
                                </div>
                                <div className="text-sm text-gray-500">{it.read ? "Read" : "Unread"}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="mt-4 text-sm text-gray-500">(CRUD actions and read/unread tracking placeholders.)</div>
        </AdminLayout>
    );
}
