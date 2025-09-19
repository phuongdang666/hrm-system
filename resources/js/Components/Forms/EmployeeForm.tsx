import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import TextInput from '../../Components/TextInput';
import InputError from '../../Components/InputError';
import InputLabel from '../../Components/InputLabel';
import SelectInput from '../../Components/SelectInput';
import PrimaryButton from '../../Components/PrimaryButton';
import SecondaryButton from '../../Components/SecondaryButton';

interface Department {
    id: number;
    name: string;
}

interface Title {
    id: number;
    name: string;
}

interface EmployeeData {
    id?: number;
    code?: string;
    name?: string;
    email?: string;
    department_id?: number;
    title_id?: number;
    status?: 'active' | 'inactive';
    department?: { id: number; name: string };
    title?: { id: number; name: string };
}

interface EmployeeFormProps {
    departments: Department[];
    titles: Title[];
    employee?: EmployeeData | null;
    onClose: () => void;
}

export default function EmployeeForm({ departments, titles, employee, onClose }: EmployeeFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: '',
        name: '',
        email: '',
        department_id: '',
        title_id: '',
        status: 'active',
    });

    useEffect(() => {
        if (employee) {
            setData({
                code: employee.code || '',
                name: employee.name || '',
                email: employee.email || '',
                department_id: employee.department_id?.toString() || '',
                title_id: employee.title_id?.toString() || '',
                status: employee.status || 'active',
            });
        }
    }, [employee]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (employee?.id) {
            put(route('admin.employees.update', employee.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('admin.employees.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <InputLabel htmlFor="code" value="Employee Code" />
                <TextInput
                    id="code"
                    type="text"
                    value={data.code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('code', e.target.value)}
                    className="mt-1 block w-full"
                    required
                />
                <InputError message={errors.code} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="name" value="Name" />
                <TextInput
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                    className="mt-1 block w-full"
                    required
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="email" value="Email" />
                <TextInput
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                    className="mt-1 block w-full"
                    required
                />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="department_id" value="Department" />
                <SelectInput
                    id="department_id"
                    value={data.department_id}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('department_id', e.target.value)}
                    className="mt-1 block w-full"
                    required
                >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                            {dept.name}
                        </option>
                    ))}
                </SelectInput>
                <InputError message={errors.department_id} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="title_id" value="Title" />
                <SelectInput
                    id="title_id"
                    value={data.title_id}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('title_id', e.target.value)}
                    className="mt-1 block w-full"
                    required
                >
                    <option value="">Select Title</option>
                    {titles.map((title) => (
                        <option key={title.id} value={title.id}>
                            {title.name}
                        </option>
                    ))}
                </SelectInput>
                <InputError message={errors.title_id} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="status" value="Status" />
                <SelectInput
                    id="status"
                    value={data.status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('status', e.target.value as 'active' | 'inactive')}
                    className="mt-1 block w-full"
                    required
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </SelectInput>
                <InputError message={errors.status} className="mt-2" />
            </div>

            <div className="flex items-center justify-end space-x-4">
                <SecondaryButton type="button" onClick={onClose}>
                    Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={processing}>
                    {employee ? 'Update' : 'Create'} Employee
                </PrimaryButton>
            </div>
        </form>
    );
}