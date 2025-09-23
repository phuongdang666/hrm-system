import React, { useEffect, useMemo, useState } from "react";
import { useForm, usePage, Link } from '@inertiajs/react';
import AdminLayout from "@/layouts/admin/AdminLayout";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import SearchMultiSelect from '@/components/SearchMultiSelect';

interface Props {
    announcements: any[];
    departments?: { id: number; name: string }[];
    titles?: { id: number; name: string }[];
    employees?: { id: number; name: string; email?: string }[];
}

export default function Announcement({ announcements = [], departments = [], titles = [], employees = [] }: Props) {
    const { props } = usePage();
    const flash: any = (props && (props as any).flash) || {};

    const [query, setQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

    const form = useForm({ title: '', body: '', departments: [], titles: [], employees: [] });

    const unreadCount = announcements.reduce((acc: number, a: any) => acc + (Number(a.read_count || 0) > 0 ? 0 : 1), 0);

    // filtered list (simple client-side search)
    const filtered = useMemo(() => {
        if (!query) return announcements;
        const q = query.toLowerCase();
        return announcements.filter((a: any) => (a.title || '').toLowerCase().includes(q) || (a.body || '').toLowerCase().includes(q));
    }, [announcements, query]);

    useEffect(() => {
        // close modal after successful submission
        if (flash.success) {
            setShowModal(false);
            form.reset();
        }
    }, [flash.success]);

    return (
        <AdminLayout>
            <PageMeta title="Announcements" description="Admin - Send announcements" />
            <PageBreadcrumb pageTitle="Announcements" />

            <Card>
                <CardHeader className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-cyan-50">
                    <div>
                        <CardTitle className="text-2xl">Announcements</CardTitle>
                        <div className="text-sm text-gray-600">Create and broadcast announcements to employees or departments.</div>
                    </div>
                    <div className="text-sm">
                        <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-sm">🔔 Unread <span className="font-semibold">{unreadCount}</span></span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex gap-2 items-center">
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search announcements..." className="border px-3 py-2 rounded-md flex-1 shadow-sm" />
                        <Button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">New Announcement</Button>
                    </div>

                    {flash.success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-700 rounded">{flash.success}</div>
                    )}

                    <div className="divide-y">
                        {filtered.length === 0 && (
                            <div className="p-4 text-sm text-gray-500">No announcements found.</div>
                        )}
                        {filtered.map((it: any) => (
                            <div key={it.id} className="p-4 flex items-center justify-between hover:bg-gray-50 rounded-lg">
                                <div>
                                    <div className="font-semibold text-gray-800 text-lg">{it.title}</div>
                                    <div className="text-xs text-gray-500">Sent: {it.sent_at ? new Date(it.sent_at).toLocaleString() : '—'}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-sm text-gray-600">Read: <span className="font-medium text-emerald-600">{Number(it.read_count || 0)}</span> / <span className="text-gray-500">{Number(it.total_recipients || (it.recipients ? it.recipients.length : 0))}</span></div>
                                    <Link href={route('admin.announcements.show', it.id)} className="text-sm text-white bg-cyan-600 px-3 py-1 rounded">View</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white rounded-2xl w-3/5 p-6 shadow-2xl border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-bold text-gray-800">New Announcement</h3>
                            <div className="text-sm text-gray-500">Compose and send to selected targets</div>
                        </div>
                        <div className="grid gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input value={form.data.title} onChange={e => form.setData('title', e.target.value)} placeholder="Title" className="border px-3 py-2 rounded w-full" />
                                {form.errors.title && <div className="text-xs text-red-600 mt-1">{form.errors.title}</div>}
                                {serverErrors.title && <div className="text-xs text-red-600 mt-1">{serverErrors.title}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Body</label>
                                <textarea value={form.data.body} onChange={e => form.setData('body', e.target.value)} placeholder="Body (HTML allowed)" rows={6} className="border px-3 py-2 rounded w-full" />
                                {form.errors.body && <div className="text-xs text-red-600 mt-1">{form.errors.body}</div>}
                                {serverErrors.body && <div className="text-xs text-red-600 mt-1">{serverErrors.body}</div>}
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <SearchMultiSelect
                                    options={departments}
                                    value={form.data.departments}
                                    onChange={(vals) => form.setData('departments', vals as any)}
                                    placeholder="Search departments..."
                                />
                                <SearchMultiSelect
                                    options={titles}
                                    value={form.data.titles}
                                    onChange={(vals) => form.setData('titles', vals as any)}
                                    placeholder="Search titles..."
                                />
                                <SearchMultiSelect
                                    options={employees.map(emp => ({ id: emp.id, name: emp.name }))}
                                    value={form.data.employees}
                                    onChange={(vals) => form.setData('employees', vals as any)}
                                    placeholder="Search employees..."
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <Button onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-800">Cancel</Button>
                                <Button
                                    onClick={async () => {
                                        setServerErrors({});
                                        setIsSending(true);
                                        try {
                                            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                                            const res = await fetch(route('admin.announcements.send'), {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'X-CSRF-TOKEN': token,
                                                    'Accept': 'application/json'
                                                },
                                                body: JSON.stringify(form.data),
                                            });

                                            if (!res.ok) {
                                                const err = await res.json().catch(() => ({}));
                                                setServerErrors(err.errors || {});
                                                setIsSending(false);
                                                return;
                                            }

                                            const data = await res.json();
                                            const id = data.id;

                                            // poll status every 1s until pending === 0
                                            let done = false;
                                            while (!done) {
                                                const sres = await fetch(route('admin.announcements.status', id), { headers: { Accept: 'application/json' } });
                                                if (!sres.ok) break;
                                                const status = await sres.json();
                                                if ((status.pending || 0) === 0) {
                                                    done = true;
                                                    setIsSending(false);
                                                    setShowModal(false);
                                                    // reload page to show announcement with updated counts
                                                    window.location.href = route('admin.announcements.index');
                                                } else {
                                                    // wait 1s
                                                    await new Promise(r => setTimeout(r, 1000));
                                                }
                                            }
                                        } catch (e) {
                                            console.error(e);
                                            setIsSending(false);
                                        }
                                    }}
                                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                                    disabled={isSending}
                                >{isSending ? 'Sending...' : 'Send'}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-4 text-sm text-gray-500">(CRUD actions and read/unread tracking placeholders.)</div>
        </AdminLayout>
    );
}
