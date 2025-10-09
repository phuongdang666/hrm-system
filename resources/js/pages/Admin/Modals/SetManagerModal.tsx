import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { router } from '@inertiajs/core'
import { useState } from 'react'

interface Employee {
  id: number
  name: string
  email: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  departmentId: number
  currentManagerId: number | null
  employees: Employee[]
}

export default function SetManagerModal({ isOpen, onClose, departmentId, currentManagerId, employees }: Props) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(currentManagerId?.toString() || '')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    router.post(
      route('admin.departments.manager.set', departmentId),
      {
        employee_id: Number(selectedEmployeeId),
      },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">Set Department Manager</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="employee" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Select Manager
            </label>
            <select
              id="employee"
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id.toString()} className="text-gray-900 dark:text-gray-100">
                  {employee.name} ({employee.email})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Set as Manager</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}