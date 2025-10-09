import React, { useState } from "react";
import { Head } from '@inertiajs/react';
import AdminLayout from "@/layouts/admin/AdminLayout";
import PageMeta from "@/Components/common/PageMeta";
import { Card, CardHeader, CardContent } from "@/Components/ui/card";
import Button from "@/Components/ui/button/Button";
import PageBreadcrumb from "@/Components/common/PageBreadCrumb";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/Components/ui/table";
import { router } from '@inertiajs/core';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Employee {
  id: number;
  name: string;
  email: string;
  title?: {
    id: number;
    name: string;
  };
  role: string;
}

interface Department {
  id: number;
  name: string;
  manager_id: number | null;
  manager: Employee | null;
  employees: Employee[];
}

interface Props {
  department: Department;
  availableEmployees: Employee[];
}

export default function DepartmentEdit({ department, availableEmployees }: Props) {
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showSetManagerModal, setShowSetManagerModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  const handleAddEmployee = () => {
    if (!selectedEmployeeId) return;

    router.post(route('admin.departments.employees.add', department.id), {
      employee_id: selectedEmployeeId
    }, {
      onSuccess: () => {
        setShowAddEmployeeModal(false);
        setSelectedEmployeeId('');
      }
    });
  };

  const handleSetManager = () => {
    if (!selectedEmployeeId) return;

    router.post(route('admin.departments.manager.set', department.id), {
      employee_id: selectedEmployeeId
    }, {
      onSuccess: () => {
        setShowSetManagerModal(false);
        setSelectedEmployeeId('');
      }
    });
  };

  const handleRemoveEmployee = (employeeId: number) => {
    if (!confirm('Are you sure you want to remove this employee from the department?')) return;

    router.delete(route('admin.departments.employees.remove', [department.id, employeeId]));
  };

  return (
    <AdminLayout>
      <PageMeta title={`Edit Department: ${department.name}`} description={`Edit details of ${department.name}`} />

      <div className="max-w-7xl mx-auto py-6 space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Edit Department</h1>
          <p className="text-blue-100">Managing {department.name}</p>
        </div>

        <Card className="border-0 shadow-xl bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Department Management
              </h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowAddEmployeeModal(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md"
                >
                  Add Employee
                </Button>
                <Button
                  onClick={() => setShowSetManagerModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                >
                  Set Manager
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Department Name</h4>
                <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{department.name}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Manager</h4>
                {department.manager ? (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-base font-medium text-gray-900">
                      {department.manager.name}
                    </span>
                    <span className="text-sm text-gray-500">({department.manager.email})</span>
                  </div>
                ) : (
                  <p className="mt-1 text-base text-gray-500">No manager assigned</p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Department Employees</h3>
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                      <TableCell isHeader className="font-semibold text-gray-900 dark:text-gray-100">Name</TableCell>
                      <TableCell isHeader className="font-semibold text-gray-900 dark:text-gray-100">Email</TableCell>
                      <TableCell isHeader className="font-semibold text-gray-900 dark:text-gray-100">Title</TableCell>
                      <TableCell isHeader className="font-semibold text-gray-900 dark:text-gray-100">Role</TableCell>
                      <TableCell isHeader className="font-semibold text-gray-900 dark:text-gray-100">Actions</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {department.employees.length === 0 ? (
                      <TableRow>
                        <TableCell className="text-center align-middle py-8">
                          <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-lg font-medium">No employees found</p>
                            <p className="text-sm">Add employees to this department</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      department.employees.map((employee) => (
                        <TableRow 
                          key={employee.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <TableCell className="text-center align-middle font-medium text-gray-900 dark:text-white">{employee.name}</TableCell>
                          <TableCell className="text-center align-middle text-gray-600 dark:text-gray-300">{employee.email}</TableCell>
                          <TableCell className="text-center align-middle">
                            {employee.title ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {employee.title.name}
                              </span>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="text-center align-middle">
                            {employee.role === 'manager' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                                Manager
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                Staff
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-center align-middle">
                            <Button
                              onClick={() => handleRemoveEmployee(employee.id)}
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
                              variant="outline"
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Departments
          </Button>
        </div>

        {/* Add Employee Modal */}
        <Dialog open={showAddEmployeeModal} onOpenChange={setShowAddEmployeeModal}>
          <DialogContent className="bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
            <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Employee to Department
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Employee
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select an employee</option>
                  {availableEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} ({employee.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddEmployeeModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddEmployee}
                  disabled={!selectedEmployeeId}
                >
                  Add Employee
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Set Manager Modal */}
        <Dialog open={showSetManagerModal} onOpenChange={setShowSetManagerModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Department Manager</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Manager
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select an employee</option>
                  {[...department.employees, ...availableEmployees].map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} ({employee.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSetManagerModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSetManager}
                  disabled={!selectedEmployeeId}
                >
                  Set as Manager
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}