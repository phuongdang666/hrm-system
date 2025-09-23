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
    const [successAlert, setSuccessAlert] = useState('');

    const form = useForm({ title: '', body: '', departments: [], titles: [], employees: [] });

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

            {successAlert && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in-down">
                    <div className="p-4 rounded-lg shadow-lg bg-gradient-to-r from-emerald-500/90 to-green-500/90 backdrop-blur-sm text-white flex items-center gap-3 min-w-[320px]">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="flex-1">{successAlert}</span>
                        <button onClick={() => setSuccessAlert('')} className="text-white/80 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <Card className="overflow-hidden border border-blue-100/50 shadow-lg shadow-blue-900/5">
                <CardHeader className="flex items-center justify-between bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 border-b border-blue-100/50">
                    <div>
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">Announcements</CardTitle>
                        <div className="text-sm text-gray-600">Create and broadcast announcements to employees or departments.</div>
                    </div>
                    <Button
                        onClick={() => setShowModal(true)}
                        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            New Announcement
                        </span>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <div className="relative">
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search announcements..."
                                className="w-full px-4 py-3 pl-10 rounded-lg border border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-400"
                            />
                            <svg className="absolute left-3 top-3.5 h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    {flash.success && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500 text-emerald-700 rounded-r-lg shadow-sm">{flash.success}</div>
                    )}

                    <div className="divide-y divide-blue-100">
                        {filtered.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <div className="text-sm">No announcements found.</div>
                            </div>
                        )}

                        {filtered.map((it: any) => (
                            <div key={it.id} className="p-4 flex items-center justify-between hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-violet-50/50 group transition-all">
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate pr-4 group-hover:text-blue-600 transition-colors">{it.title}</div>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Sent: {it.sent_at ? new Date(it.sent_at).toLocaleString() : '—'}
                                        </span>
                                        {it.total_recipients > 0 && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-violet-100 text-blue-800">
                                                <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                {it.total_recipients} recipient{it.total_recipients === 1 ? '' : 's'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Link
                                    href={route('admin.announcements.show', it.id)}
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 bg-gradient-to-r from-blue-50 to-violet-50 rounded-lg hover:from-blue-100 hover:to-violet-100 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-800/75 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
                    <div className="bg-white/95 backdrop-blur-xl rounded-xl w-2/3 shadow-2xl shadow-blue-900/10 border border-blue-100/50 transition-all transform overflow-hidden">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-blue-100/50 pb-4">
                                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">New Announcement</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <div className="relative">
                                        <input
                                            value={form.data.title}
                                            onChange={e => form.setData('title', e.target.value)}
                                            placeholder="Enter announcement title"
                                            className="w-full px-4 py-3 pl-10 rounded-lg border border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                        <svg className="absolute left-3 top-3.5 h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    {form.errors.title && <div className="text-xs text-red-600 mt-1">{form.errors.title}</div>}
                                    {serverErrors.title && <div className="text-xs text-red-600 mt-1">{serverErrors.title}</div>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Body</label>
                                    <textarea
                                        value={form.data.body}
                                        onChange={e => form.setData('body', e.target.value)}
                                        placeholder="Enter announcement content (HTML allowed)"
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-lg border border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-y"
                                    />
                                    {form.errors.body && <div className="text-xs text-red-600 mt-1">{form.errors.body}</div>}
                                    {serverErrors.body && <div className="text-xs text-red-600 mt-1">{serverErrors.body}</div>}
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
                                        <SearchMultiSelect
                                            options={departments}
                                            value={form.data.departments}
                                            onChange={(vals) => form.setData('departments', vals as any)}
                                            placeholder="Search departments..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Titles</label>
                                        <SearchMultiSelect
                                            options={titles}
                                            value={form.data.titles}
                                            onChange={(vals) => form.setData('titles', vals as any)}
                                            placeholder="Search titles..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Individual Employees</label>
                                        <SearchMultiSelect
                                            options={employees.map(emp => ({ id: emp.id, name: emp.name }))}
                                            value={form.data.employees}
                                            onChange={(vals) => form.setData('employees', vals as any)}
                                            placeholder="Search employees..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-blue-100/50">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        setServerErrors({});
                                        setIsSending(true);
                                        // client-side guard: require at least one recipient
                                        const totalRecipients = (form.data.employees || []).length + (form.data.departments || []).length + (form.data.titles || []).length;
                                        if (totalRecipients === 0) {
                                            // setServerErrors({ recipients: 'Please choose at least one recipient.' });
                                            // setIsSending(false);
                                            // return;
                                            alert('Please choose at least one recipient.');
                                            setIsSending(false);
                                            return;
                                        }
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
                                                credentials: 'same-origin',
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
                                                const sres = await fetch(route('admin.announcements.status', id), { headers: { Accept: 'application/json' }, credentials: 'same-origin' });
                                                if (!sres.ok) break;
                                                const status = await sres.json();
                                                if ((status.pending || 0) === 0) {
                                                    done = true;
                                                    setIsSending(false);
                                                    setShowModal(false);
                                                    setSuccessAlert('Announcement sent successfully! Emails are being delivered to recipients.');
                                                    // Hide the alert after 5 seconds
                                                    setTimeout(() => setSuccessAlert(''), 5000);
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
                                    className="px-4 py-2 text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                                    disabled={isSending}
                                >
                                    {isSending ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : 'Send Announcement'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
