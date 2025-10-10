import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from "@/layouts/admin/AdminLayout";
import PageMeta from "@/Components/common/PageMeta";
import PageBreadcrumb from "@/Components/common/PageBreadCrumb";
import { Card, CardHeader, CardContent, CardTitle } from "@/Components/ui/card";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/Components/ui/table";
import Button from "@/Components/ui/button/Button";


interface AttendanceRecord {
    id: number;
    employee_id: number;
    date: string;
    check_in: string;
    check_out: string | null;
    total_hours?: number;
    overtime_hours?: number;
    status: 'present' | 'late' | 'early_leave' | 'absent';
    employee: {
        name: string;
        department?: {
            name: string;
        };
    };
}

interface PaginatedData {
    current_page: number;
    data: AttendanceRecord[];
    from: number;
    to: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: Array<{ url: string | null; label: string; active: boolean }>;

}

interface AttendanceProps {
    attendances: PaginatedData;
    records: AttendanceRecord[];
    totalHours: number;
    startDate?: string;
    endDate?: string;
    employees: Array<{ id: number; name: string }>;
    departments: Array<{ id: number; name: string }>;
    filters: {
        employeeId?: string;
        departmentId?: string;
    };
}

export default function Attendance({ attendances, records, totalHours = 0, startDate, endDate, employees = [], departments = [], filters = {} }: AttendanceProps) {


    const [viewType, setViewType] = useState<'daily' | 'monthly'>('daily');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

    const form = useForm({
        startDate: startDate || '',
        endDate: endDate || '',
        employeeId: filters.employeeId || '',
        departmentId: filters.departmentId || '',
    });

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        form.get(route('admin.attendances.index'), { preserveState: true, replace: true });
    };

    const getStatusColor = (status: AttendanceRecord['status']) => {
        switch (status) {
            case 'present':
                return 'bg-green-50 text-green-700 border-green-100';
            case 'late':
                return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'early_leave':
                return 'bg-orange-50 text-orange-700 border-orange-100';
            case 'absent':
                return 'bg-red-50 text-red-700 border-red-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const formatTime = (time: string | null) => {
        if (!time) return '—';
        const date = new Date(time);
        return date.getUTCHours().toString().padStart(2, '0') + ':' +
            date.getUTCMinutes().toString().padStart(2, '0');
    };


    return (
        <AdminLayout>
            <PageMeta title="Attendance" description="Xem và quản lý dữ liệu chấm công" />
            <PageBreadcrumb pageTitle="Attendance" />

            <div className="space-y-6">
                {/* Filter Card */}
                <Card className="bg-white shadow-sm border-0 rounded-xl overflow-hidden">
                    <CardContent className="p-6">
                        <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                <input
                                    type="date"
                                    value={form.data.startDate}
                                    onChange={e => form.setData('startDate', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                <input
                                    type="date"
                                    value={form.data.endDate}
                                    onChange={e => form.setData('endDate', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select
                                    value={form.data.departmentId}
                                    onChange={e => form.setData('departmentId', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 text-sm"
                                >
                                    <option value="">All Departments</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                                <select
                                    value={form.data.employeeId}
                                    onChange={e => form.setData('employeeId', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 text-sm"
                                >
                                    <option value="">All Employees</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={viewType}
                                    onChange={e => setViewType(e.target.value as 'daily' | 'monthly')}
                                    className="w-full rounded-lg border-gray-300 text-sm"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="monthly">Monthy</option>
                                </select>
                            </div> */}
                            <div className="flex items-end">
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                    disabled={form.processing}
                                >
                                    Filter
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg border-0 rounded-xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between text-white">
                                <div>
                                    <p className="text-blue-100">Total hours</p>
                                    <h3 className="text-3xl font-bold mt-1">{totalHours.toFixed(1)}h</h3>
                                </div>
                                <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 shadow-lg border-0 rounded-xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between text-white">
                                <div>
                                    <p className="text-green-100">On time</p>
                                    <h3 className="text-3xl font-bold mt-1">
                                        {attendances?.data?.filter(r => r.status === 'present')?.length ?? 0}
                                    </h3>

                                </div>
                                <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg border-0 rounded-xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between text-white">
                                <div>
                                    <p className="text-yellow-100">Early/late</p>
                                    <h3 className="text-3xl font-bold mt-1">
                                        {attendances?.data?.filter(r => r.status === 'late' || r.status === 'early_leave')?.length ?? 0}
                                    </h3>

                                </div>
                                <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Attendance Table */}
                <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
                    <CardHeader className="flex items-center justify-between bg-[#f8f9fa] border-b border-gray-200 p-6">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-800">Atttendance table</CardTitle>
                            <p className="text-gray-600 mt-1">Detail {viewType === 'daily' ? 'daily' : 'Monthly'}</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#f8f9fa] border-b border-gray-200">
                                        <TableCell className="py-4 px-6 text-sm font-bold text-gray-800">
                                            Employee
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm font-bold text-gray-800">
                                            Department
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm font-bold text-gray-800">
                                            Date
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm font-bold text-gray-800">
                                            Check In
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm font-bold text-gray-800">
                                            Check Out
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm font-bold text-gray-800">
                                            Total Hours
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm font-bold text-gray-800">
                                            Overtime Hours
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm font-bold text-gray-800">
                                            Status
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendances?.data?.map((record: AttendanceRecord) => (
                                        <TableRow
                                            key={record.id}
                                            className={`group hover:bg-gray-50 transition-all duration-200 ${record.id % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                                        >
                                            <TableCell className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{record.employee.name}</div>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 text-gray-600">
                                                {record.employee.department?.name || '—'}
                                            </TableCell>
                                            <TableCell className="py-4 px-6 text-gray-600">
                                                {new Date(record.date).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                            <TableCell className="py-4 px-6 text-gray-600">
                                                {formatTime(record.check_in)}
                                            </TableCell>
                                            <TableCell className="py-4 px-6 text-gray-600">
                                                {formatTime(record.check_out)}
                                            </TableCell>
                                            <TableCell className="py-4 px-6">
                                                <div className="font-medium text-gray-900">
                                                    {record.total_hours?.toFixed(1) || '—'} hours
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 px-6">
                                                <div className="font-medium text-gray-900">
                                                    {record.overtime_hours?.toFixed(1) || '—'} hours
                                                </div>
                                            </TableCell>

                                            <TableCell className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                                                    {record.status === 'present' && 'On time'}
                                                    {record.status === 'late' && 'Late'}
                                                    {record.status === 'early_leave' && 'Early leave'}
                                                    {record.status === 'absent' && 'Absent'}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!attendances?.data || attendances.data.length === 0) && (
                                        <TableRow>
                                            <td colSpan={7}>
                                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                                    <div className="w-16 h-16 mb-4 text-gray-300">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-1">Không có dữ liệu</h3>
                                                    <p className="text-gray-500">Không tìm thấy dữ liệu chấm công trong khoảng thời gian này</p>
                                                </div>
                                            </td>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {/* Summary */}
                            <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{attendances?.from || 0}</span> to <span className="font-medium">{attendances?.to || 0}</span> of{' '}
                                        <span className="font-medium">{attendances?.total || 0}</span> records
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {attendances?.links?.map((link, i) => {
                                        // Skip the "prev" and "next" labels
                                        if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                                            return null;
                                        }

                                        return (
                                            <Button 
                                                key={i}
                                            
                                                size="sm"
                                                onClick={() => {
                                                    if (link.url) {
                                                        form.get(link.url);
                                                    }
                                                }}
                                                className={`px-3 py-1 text-sm ${link.active
                                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                                        : 'bg-blue-100 text-gray-500 hover:bg-red-700'
                                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={!link.url}
                                            >
                                                {link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}