import React from "react";
import { Head } from '@inertiajs/react';
import AdminLayout from "@/layouts/admin/AdminLayout";
import PageMeta from "@/Components/common/PageMeta";
import { Card, CardHeader, CardContent } from "@/Components/ui/card";
import Button from "@/Components/ui/button/Button";
import PageBreadcrumb from "@/Components/common/PageBreadCrumb";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/Components/ui/table";
import { router } from '@inertiajs/core';
interface Department {
  id: number;
  name: string;
  description?: string;
  manager: {
    id: number;
    name: string;
    email: string;
  } | null;
  employees: Array<{
    id: number;
    name: string;
    email: string;
    title?: {
      id: number;
      name: string;
    }
  }>;
}

interface Props {
  department: Department;
}

export default function DepartmentShow({ department }: Props) {
  return (
    <AdminLayout>
      <PageMeta title={`Department: ${department.name}`} description={`View details of ${department.name}`} />

      <div className="max-w-7xl mx-auto py-6 space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">{department.name}</h1>
          <p className="text-blue-100">Department Overview</p>
        </div>

        <Card className="border-0 shadow-xl bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Department Details
            </h3>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Department Name</h4>
                <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{department.name}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Department Manager</h4>
                {department.manager ? (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {department.manager.name}
                      </span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">({department.manager.email})</span>
                  </div>
                ) : (
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400 italic">No manager assigned</p>
                )}
              </div>
              {department.description && (
                <div className="col-span-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</h4>
                  <p className="mt-2 text-base text-gray-900 dark:text-white">{department.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Department Employees
              </h3>
              <div className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full font-medium">
                {department.employees.length} Members
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                    <TableCell isHeader className="px-4 py-2 font-semibold text-gray-900 dark:text-white">Name</TableCell>
                    <TableCell isHeader className="px-4 py-2 font-semibold text-gray-900 dark:text-white">Email</TableCell>
                    <TableCell isHeader className="px-4 py-2 font-semibold text-gray-900 dark:text-white">Title</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {department.employees.length === 0 ? (
                    <TableRow>
                      <TableCell className="px-4 py-2 text-center aligh-middle" >
                        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                          <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <p className="text-lg font-medium">No employees found</p>
                          <p className="text-sm">This department has no members yet</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    department.employees.map((employee) => (
                      <TableRow 
                        key={employee.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <TableCell className="px-4 py-2 text-center align-middle font-medium text-gray-900 dark:text-white">
                          {employee.name}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-center align-middle text-gray-900 dark:text-gray-100">{employee.email}</TableCell>
                        <TableCell className="px-4 py-2 text-center align-middle">
                          {employee.title ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {employee.title.name}
                            </span>
                          ) : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
          >
            Back
          </Button>
          <Button
            onClick={() => router.get(route('admin.departments.edit', department.id))}
          >
            Edit Department
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}