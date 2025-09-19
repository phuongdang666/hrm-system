import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface Employee {
    id: number;
    name: string;
    email: string;
    title?: {
        id: number;
        name: string;
    };
    department_id?: number | null;
}

interface AssignEmployeesModalProps {
    show: boolean;
    onClose: () => void;
    departmentId: number;
    departmentName: string;
    availableEmployees: Employee[];
    currentEmployeeIds: number[];
}

export default function AssignEmployeesModal({
    show,
    onClose,
    departmentId,
    departmentName,
    availableEmployees,
    currentEmployeeIds,
}: AssignEmployeesModalProps) {
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>(currentEmployeeIds);

    const form = useForm({
        employee_ids: selectedEmployees,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('admin.departments.add-employees', departmentId), {
            onSuccess: () => {
                onClose();
                form.reset();
                setSelectedEmployees([]);
            },
        });
    };

    const toggleEmployee = (employeeId: number) => {
        setSelectedEmployees(prev =>
            prev.includes(employeeId)
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    return (
        <Modal
            isOpen={show}
            onClose={onClose}
            className="max-w-xl"
            showCloseButton
        >
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Assign Employees to {departmentName}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="max-h-[400px] overflow-y-auto">
                            {availableEmployees.map(employee => (
                                <div key={employee.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                                    <Checkbox
                                        id={`employee-${employee.id}`}
                                        checked={selectedEmployees.includes(employee.id)}
                                        onCheckedChange={() => toggleEmployee(employee.id)}
                                    />
                                    <Label htmlFor={`employee-${employee.id}`} className="flex-1 cursor-pointer">
                                        <div className="font-medium">{employee.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {employee.title?.name || 'No title'} • {employee.email}
                                        </div>
                                    </Label>
                                    {employee.department_id && employee.department_id !== departmentId && (
                                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                            In another department
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {form.errors.employee_ids && (
                            <div className="text-sm text-red-600 mt-1">
                                {form.errors.employee_ids}
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                onClose();
                                setSelectedEmployees(currentEmployeeIds);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            Assign Employees
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}