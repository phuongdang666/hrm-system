import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { router } from '@inertiajs/core'
import { useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function AddDepartmentModal({ isOpen, onClose }: Props) {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    
    router.post(
      route('admin.departments.store'),
      {
        name,
      },
      {
        onSuccess: () => {
          onClose()
          setName('')
        },
        onFinish: () => {
          setIsSubmitting(false)
        }
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">Add New Department</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Department Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter department name"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="text-gray-700 border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
            >
              {isSubmitting ? 'Creating...' : 'Create Department'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}