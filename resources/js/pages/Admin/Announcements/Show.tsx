import React from 'react';
import AdminLayout from '@/layouts/admin/AdminLayout';
import PageMeta from '@/components/common/PageMeta';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

export default function Show({ announcement }: any) {
    return (
        <AdminLayout>
            <PageMeta title={announcement.title} description="Announcement detail" />
            <PageBreadcrumb pageTitle="Announcement" />

            <Card>
                <CardContent>
                    <h2 className="text-2xl font-semibold">{announcement.title}</h2>
                    <div className="text-sm text-gray-500 mb-4">Sent: {announcement.sent_at ? new Date(announcement.sent_at).toLocaleString() : '—'}</div>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: announcement.body }} />

                    <div className="mt-6">
                        <h3 className="font-medium">Recipients</h3>
                        <div className="mt-2 divide-y">
                            {announcement.recipients && announcement.recipients.length > 0 ? announcement.recipients.map((r: any) => (
                                <div key={r.id} className="p-2 flex justify-between text-sm">
                                    <div>{r.employee ? r.employee.name : r.email || '—'}</div>
                                    <div className="text-gray-500">{r.status} {r.sent_at ? `• ${new Date(r.sent_at).toLocaleString()}` : ''}</div>
                                </div>
                            )) : <div className="p-2 text-sm text-gray-500">No recipients</div>}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
