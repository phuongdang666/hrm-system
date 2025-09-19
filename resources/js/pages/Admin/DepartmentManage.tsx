import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin/AdminLayout";
import PageMeta from "@/components/common/PageMeta";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import Modal from "../../Components/Modal";
import InputError from "../../Components/InputError";
import InputLabel from "../../Components/InputLabel";
import TextInput from "../../Components/TextInput";
import SelectInput from "../../Components/SelectInput";
import SecondaryButton from "../../Components/SecondaryButton";

type ModalMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
import AssignEmployeesModal from "@/components/departments/AssignEmployeesModal";

interface Department {
    id: number;
    name: string;
    description?: string;
    manager_id?: number;
    manager?: {
        id: number;
        name: string;
    };
    employees?: {
        id: number;
        name: string;
        email: string;
        title?: {
            id: number;
            name: string;
        };
    }[];
}

interface Employee {
    id: number;
    name: string;
    email: string;
    title?: {
        id: number;
        name: string;
    };
}

interface DepartmentManageProps {
    departments: {
        data: Department[];
        // Add other pagination props if needed
    };
    employees: Employee[];
    filters: {
        name?: string;
        manager_id?: string;
        [key: string]: any;
    };
}

export default function DepartmentManage({ departments = { data: [] }, employees = [], filters = {} }: DepartmentManageProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    const form = useForm({
        name: filters.name || "",
        description: "",
        manager_id: filters.manager_id || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDepartment?.id) {
            form.put(route('admin.departments.update', selectedDepartment.id), {
                onSuccess: () => {
                    setShowEditModal(false);
                    setSelectedDepartment(null);
                    form.reset();
                },
            });
        } else {
            form.post(route('admin.departments.store'), {
                onSuccess: () => {
                    setShowCreateModal(false);
                    form.reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedDepartment?.id) {
            form.delete(route('admin.departments.destroy', selectedDepartment.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setSelectedDepartment(null);
                },
            });
        }
    };

    const handleRemoveEmployee = (employeeId: number) => {
        if (selectedDepartment?.id) {
            form.delete(route('admin.departments.remove-employee', {
                department: selectedDepartment.id,
                employee: employeeId
            }));
        }
    };

    return (
        <AdminLayout>
            <PageMeta title="Department Management" description="Admin - Manage departments" />
            <PageBreadcrumb pageTitle="Departments" />
            <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add new department
            </Button>

            <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
                <CardContent>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#f8f9fa] border-b border-gray-200">
                                    <TableCell isHeader className="py-4 px-6 text-sm font-bold text-gray-800">
                                        Name
                                    </TableCell>
                                    <TableCell isHeader className="py-4 px-6 text-sm font-bold text-gray-800">
                                        Manager
                                    </TableCell>
                                    <TableCell isHeader className="py-4 px-6 text-sm font-bold text-gray-800">
                                        Number of Employees
                                    </TableCell>
                                    <TableCell isHeader className="py-4 px-6 text-sm font-bold text-gray-800 text-right">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(!departments.data || departments.data.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="h-96">
                                            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                                <div className="relative w-24 h-24 mb-4">
                                                    <div className="absolute inset-0 bg-blue-50 rounded-full animate-pulse"></div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-blue-600/80 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">None department</h3>
                                                <p className="text-sm text-gray-500 max-w-sm mb-6">
                                                    Please create a department to start managing your organization.
                                                </p>
                                                <Button
                                                    onClick={() => setShowCreateModal(true)}
                                                    className="bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center gap-2 px-4 py-2 rounded-lg"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    </svg>
                                                    Add new department
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {departments.data?.map((dept: Department) => (
                                    <TableRow
                                        key={dept.id}
                                        className={`group hover:bg-gray-50 transition-all duration-200 ${dept.id % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                                    >
                                        <TableCell className="py-4 px-6">
                                            <div className="font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                                                {dept.name}
                                            </div>
                                            {dept.description && (
                                                <div className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                                                    {dept.description}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            {dept.manager?.name ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-medium shadow-sm">
                                                        {dept.manager.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{dept.manager.name}</div>
                                                        <div className="text-sm text-gray-500">Manager</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">No manager</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 shadow-sm hover:bg-blue-100 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="9" cy="7" r="4"></circle>
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                                </svg>
                                                <span>{dept.employees?.length || 0} employees</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedDepartment(dept);
                                                        setShowDetailModal(true);
                                                    }}
                                                    className="p-2 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-100/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                    title="View Details"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedDepartment(dept);
                                                        form.setData({
                                                            name: dept.name,
                                                            description: dept.description || '',
                                                            manager_id: dept.manager_id?.toString() || '',
                                                        });
                                                        setShowEditModal(true);
                                                    }}
                                                    className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedDepartment(dept);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            {/* Create/Edit Department Modal */}
            <Modal
                show={showCreateModal || showEditModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setSelectedDepartment(null);
                    form.reset();
                }}
                title={selectedDepartment ? "Edit Department" : "Create Department"}
                maxWidth="xl"
            >
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 -mt-6 -mx-6 p-6 text-white mb-6">
                    <h2 className="text-2xl font-bold">
                        {selectedDepartment ? "Edit Department" : "Create Department"}
                    </h2>
                    <p className="text-blue-100 mt-1">
                        {selectedDepartment ? "Update department information" : "Add a new department to your organization"}
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg">
                    <div className="space-y-6">
                        <div>
                            <InputLabel htmlFor="name" value="Department Name" className="text-gray-700 text-sm font-semibold" />
                            <TextInput
                                id="name"
                                type="text"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm transition-colors"
                                placeholder="Enter department name"
                                required
                            />
                            <InputError message={form.errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Description" className="text-gray-700 text-sm font-semibold" />
                            <textarea
                                id="description"
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                rows={3}
                                placeholder="Enter department description"
                            />
                            <InputError message={form.errors.description} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="manager_id" value="Department Manager" className="text-gray-700 text-sm font-semibold" />
                            <SelectInput
                                id="manager_id"
                                value={form.data.manager_id}
                                onChange={(e) => form.setData('manager_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                            >
                                <option value="">Select a manager</option>
                                {employees.map((emp: Employee) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.name}{emp.title?.name ? ` - ${emp.title.name}` : ''}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError message={form.errors.manager_id} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton
                            type="button"
                            onClick={() => {
                                setShowCreateModal(false);
                                setShowEditModal(false);
                                setSelectedDepartment(null);
                                form.reset();
                            }}
                        >
                            Cancel
                        </SecondaryButton>
                        <Button type="submit" disabled={form.processing}>
                            {selectedDepartment ? 'Update' : 'Create'} Department
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedDepartment(null);
                }}
                title="Delete Department"
                maxWidth="sm"
            >
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        Are you sure you want to delete this department?
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                        This will remove all employee associations. The employees will not be deleted but will no longer be part of this department.
                    </p>
                    <div className="mt-6 flex justify-end space-x-3">
                        <SecondaryButton onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </SecondaryButton>
                        <Button
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                            disabled={form.processing}
                        >
                            Delete Department
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Department Detail Modal */}
            <Modal
                show={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedDepartment(null);
                }}
                title="Department Details"
                maxWidth="xl"
            >
                <div className="p-6">
                    {selectedDepartment && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 -mt-6 -mx-6 p-6 text-white mb-6">
                                <h2 className="text-2xl font-bold">{selectedDepartment.name}</h2>
                                {selectedDepartment.description && (
                                    <p className="mt-2 text-blue-100">{selectedDepartment.description}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">{selectedDepartment.name}</h3>
                                <p className="mt-1 text-sm text-gray-500">{selectedDepartment.description}</p>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <h4 className="text-sm font-semibold text-blue-900 uppercase tracking-wider mb-3">Department Manager</h4>
                                {selectedDepartment.manager ? (
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">
                                            {selectedDepartment.manager.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h5 className="font-medium text-gray-900">{selectedDepartment.manager.name}</h5>
                                            <p className="text-sm text-gray-500">Department Manager</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No manager assigned</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900">Department Members</h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {selectedDepartment.employees?.length || 0} total members
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setShowAssignModal(true)}
                                        className="bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <line x1="19" y1="8" x2="19" y2="14" />
                                            <line x1="16" y1="11" x2="22" y2="11" />
                                        </svg>
                                        Assign Employees
                                    </Button>
                                </div>

                                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50">
                                                <TableCell isHeader className="font-semibold text-gray-700">Employee</TableCell>
                                                <TableCell isHeader className="font-semibold text-gray-700">Title</TableCell>
                                                <TableCell isHeader className="font-semibold text-gray-700 text-right">Actions</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedDepartment.employees?.map((emp) => (
                                                <TableRow key={emp.id} className="hover:bg-gray-50 transition-colors">
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium">
                                                                {emp.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{emp.name}</div>
                                                                <div className="text-sm text-gray-500">{emp.email}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {emp.title?.name ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {emp.title.name}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-500 text-sm">No title</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            onClick={() => handleRemoveEmployee(emp.id)}
                                                            className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-md transition-colors inline-flex items-center gap-1"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M13 7L9 11L13 15M9 11H21M21 11V11" />
                                                                <path d="M3 3V21" />
                                                            </svg>
                                                            Remove
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {(!selectedDepartment.employees || selectedDepartment.employees.length === 0) && (
                                                <TableRow>
                                                    <TableCell className="text-gray-500">
                                                        <div className="flex flex-col items-center justify-center py-8">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                                <circle cx="9" cy="7" r="4" />
                                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                            </svg>
                                                            <p>No employees in this department yet</p>
                                                            <button
                                                                onClick={() => setShowAssignModal(true)}
                                                                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                            >
                                                                Add employees
                                                            </button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Assign Employees Modal */}
            {selectedDepartment && (
                <AssignEmployeesModal
                    show={showAssignModal}
                    onClose={() => setShowAssignModal(false)}
                    departmentId={selectedDepartment.id}
                    departmentName={selectedDepartment.name}
                    availableEmployees={employees}
                    currentEmployeeIds={selectedDepartment.employees?.map(emp => emp.id) || []}
                />
            )}
        </AdminLayout>
    );
}
