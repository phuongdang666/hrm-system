import { Head } from '@inertiajs/react'
import { Card, CardContent, CardHeader } from '@/Components/ui/card'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/Components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/Components/ui/input'
import { useState } from 'react'
import { router } from '@inertiajs/core'
import AdminLayout from '@/layouts/admin/AdminLayout'
import AddDepartmentModal from './Modals/AddDepartmentModal'
import PageBreadcrumb from '@/Components/common/PageBreadCrumb'

interface Department {
  id: number
  name: string
  manager: {
    id: number
    name: string
    email: string
  } | null
  employees: {
    id: number
    name: string
    email: string
    title?: {
      id: number
      name: string
    }
  }[]
}

interface Props {
  departments: {
    data: Department[]
  }
  filters: {
    name?: string
    manager_id?: string
  }
}

export default function DepartmentManage({ departments, filters }: Props) {
  const [searchName, setSearchName] = useState(filters.name || '')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.get(
      route('admin.departments.index'),
      { name: searchName },
      { preserveState: true }
    )
  }

  const handleDelete = (departmentId: number) => {
    if (confirm('Are you sure you want to delete this department? All employees in this department will be unassigned.')) {
      router.delete(route('admin.departments.destroy', departmentId))
    }
  }

  return (
    <AdminLayout>
      <Head title="Department Management" />
      <PageBreadcrumb pageTitle="Departments"></PageBreadcrumb>
      <div className="max-w-7xl mx-auto py-6 space-y-6">
        {/* <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Department Management</h1>
          <p className="text-blue-100">Manage your organization's departments, employees, and managers</p>
        </div> */}
        
        <Card className="border-0 shadow-xl bg-white dark:bg-gray-800">
          <CardHeader className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Departments
            </h2>
            <div className="flex gap-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search by name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button type="submit" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                  Search
                </Button>
              </form>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
              >
                Add Department
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                  <TableCell isHeader className="px-4 py-2 font-semibold text-gray-900 dark:text-gray-100">Name</TableCell>
                  <TableCell isHeader className="px-4 py-2 font-semibold text-gray-900 dark:text-gray-100">Manager</TableCell>
                  <TableCell isHeader className="px-4 py-2 font-semibold text-gray-900 dark:text-gray-100">Employee Count</TableCell>
                  <TableCell isHeader className="px-4 py-2 font-semibold text-gray-900 dark:text-gray-100">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.data.map((department) => (
                  <TableRow 
                    key={department.id}
                    className="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <TableCell className="px-4 py-2 text-center aligh-middle font-medium text-blue-600 dark:text-blue-400">
                      {department.name}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-center aligh-middle">
                      {department.manager ? (
                        <div className="flex items-center gap-2 justify-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                          <span className="text-gray-900 dark:text-gray-100">{department.manager.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 italic">No manager assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-center aligh-middle">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {department.employees.length} employees
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-2 text-center aligh-middle">
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20"
                          onClick={() => router.get(route('admin.departments.show', department.id))}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                          onClick={() => router.get(route('admin.departments.edit', department.id))}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
                          onClick={() => handleDelete(department.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {departments.data.length === 0 && (
                  <TableRow>
                    <TableCell 
                    // colSpan={4} 
                    className="h-96">
                      <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <div className="relative w-24 h-24 mb-4">
                          <svg 
                            className="w-24 h-24 text-gray-400" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={1}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          No Departments Found
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm mb-6">
                          Get started by creating your first department
                        </p>
                        <Button onClick={() => router.get(route('admin.departments.create'))}>
                          Add Department
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <AddDepartmentModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </AdminLayout>
  )
}