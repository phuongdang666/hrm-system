<?php

namespace App\Services;

use App\Models\Department;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;

class DepartmentService
{
    /**
     * Get department details with related employees
     */
    public function getDepartmentDetails(Department $department)
    {
        return $department->load(['employees', 'manager']);
    }

    /**
     * Add an employee to department
     */
    public function addEmployee(Department $department, Employee $employee)
    {
        DB::transaction(function () use ($department, $employee) {
            // If employee was a manager in another department, remove that role
            if ($employee->role === 'manager') {
                Department::where('manager_id', $employee->id)->update(['manager_id' => null]);
            }
            
            $employee->update([
                'department_id' => $department->id,
                'role' => 'staff'
            ]);
        });
    }

    /**
     * Remove an employee from department
     */
    public function removeEmployee(Employee $employee)
    {
        DB::transaction(function () use ($employee) {
            // If employee is a manager, remove manager_id from department
            if ($employee->role === 'manager') {
                Department::where('manager_id', $employee->id)->update(['manager_id' => null]);
            }

            $employee->update([
                'department_id' => null,
                'role' => 'staff'
            ]);
        });
    }

    /**
     * Set department manager
     */
    public function setManager(Department $department, Employee $employee)
    {
        DB::transaction(function () use ($department, $employee) {
            // If there was a previous manager, reset their role
            if ($department->manager_id) {
                Employee::where('id', $department->manager_id)->update([
                    'role' => 'staff'
                ]);
            }

            // If employee was manager in another department, update that department
            Department::where('manager_id', $employee->id)->update(['manager_id' => null]);

            // Update the new manager
            $employee->update([
                'department_id' => $department->id,
                'role' => 'manager'
            ]);

            // Set as department manager
            $department->update(['manager_id' => $employee->id]);
        });
    }

    /**
     * Delete department and reset employees
     */
    public function deleteDepartment(Department $department)
    {
        DB::transaction(function () use ($department) {
            // Reset all employees in this department
            Employee::where('department_id', $department->id)->update([
                'department_id' => null,
                'role' => 'staff'
            ]);

            $department->delete();
        });
    }

    /**
     * Create a new department
     */
    public function createDepartment(array $data): Department
    {
        return Department::create($data);
    }
}
