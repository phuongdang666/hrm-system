import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import TextInput from '../../Components/TextInput';
import InputError from '../../Components/InputError';
import InputLabel from '../../Components/InputLabel';
import SelectInput from '../../Components/SelectInput';
import PrimaryButton from '../../Components/PrimaryButton';
import SecondaryButton from '../../Components/SecondaryButton';

// Ensure route types are defined
declare module "@inertiajs/core" {
    interface PageProps {
        errors: Record<string, string>;
    }
}

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
    phone?: string;
    address?: string;
    department_id?: number;
    title_id?: number;
    base_salary?: number;
    join_date?: string;
    birth_date?: string;
    contract_end_at?: string;
    status?: 'active' | 'inactive';
    avatar_path?: string;
    meta?: Record<string, any>;
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
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        department_id: '',
        title_id: '',
        base_salary: '',
        join_date: new Date().toISOString().split('T')[0], // Default to today
        birth_date: '',
        contract_end_at: '',
        status: 'active' as 'active' | 'inactive' | 'on_probation' | 'terminated',
        meta: {},
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatDateForInput = (dateString: string | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (employee) {
            setFormData({
                code: employee.code || '',
                name: employee.name || '',
                email: employee.email || '',
                password: '', // Don't load existing password
                phone: employee.phone || '',
                address: employee.address || '',
                department_id: employee.department_id?.toString() || '',
                title_id: employee.title_id?.toString() || '',
                base_salary: employee.base_salary?.toString() || '',
                join_date: formatDateForInput(employee.join_date) || new Date().toISOString().split('T')[0],
                birth_date: formatDateForInput(employee.birth_date),
                contract_end_at: formatDateForInput(employee.contract_end_at),
                status: employee.status || 'active',
                meta: employee.meta || {},
            });
        }
    }, [employee]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log('Submitting form with data:', formData);

        // Validate required fields
        const requiredFields = ['code', 'name', 'email', 'join_date'];
        if (!employee?.id) {
            requiredFields.push('password');
        }

        const newErrors: Record<string, string> = {};
        requiredFields.forEach(field => {
            if (!formData[field as keyof typeof formData]) {
                newErrors[field] = `The ${field.replace('_', ' ')} field is required.`;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        // Cast form data to appropriate types
        const submitData = {
            ...formData,
            department_id: formData.department_id ? parseInt(formData.department_id) : null,
            title_id: formData.title_id ? parseInt(formData.title_id) : null,
            base_salary: formData.base_salary ? parseFloat(formData.base_salary) : 0,
            // Only include password if it's provided
            ...(formData.password ? { password: formData.password } : {})
        };

        console.log('Processed submit data:', submitData);

        const options = {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Form submitted successfully');
                setIsSubmitting(false);
                onClose();
                // Reload the page to get fresh data
                window.location.reload();
            },
            onError: (errors: Record<string, string>) => {
                console.log('Form submission failed with errors:', errors);
                setIsSubmitting(false);
                setErrors(errors);
            }
        };

        try {
            if (employee?.id) {
                router.put(route('admin.employees.update', employee.id), submitData, options);
            } else {
                router.post(route('admin.employees.store'), submitData, options);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <InputLabel htmlFor="code" value="Employee Code" />
                <TextInput
                    id="code"
                    type="text"
                    value={formData.code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, code: e.target.value })}
                    className="mt-1 block w-full"
                    required
                />
                <InputError message={errors.code} className="mt-2" />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
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
                        value={formData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1 block w-full"
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {!employee && (
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                            className="mt-1 block w-full"
                            required={!employee}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>
                )}                <div>
                    <InputLabel htmlFor="phone" value="Phone" />
                    <TextInput
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.phone} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="address" value="Address" />
                    <TextInput
                        id="address"
                        type="text"
                        value={formData.address}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, address: e.target.value })}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.address} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="department_id" value="Department" />
                    <SelectInput
                        id="department_id"
                        value={formData.department_id}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, department_id: e.target.value })}
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
                        value={formData.title_id}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, title_id: e.target.value })}
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
                    <InputLabel htmlFor="base_salary" value="Base Salary" />
                    <TextInput
                        id="base_salary"
                        type="number"
                        step="0.01"
                        value={formData.base_salary}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, base_salary: e.target.value })}
                        className="mt-1 block w-full"
                        required
                    />
                    <InputError message={errors.base_salary} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="join_date" value="Join Date" />
                    <input
                        id="join_date"
                        type="date"
                        value={formData.join_date}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, join_date: e.target.value })}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        required
                    />
                    <InputError message={errors.join_date} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="birth_date" value="Birth Date" />
                    <input
                        id="birth_date"
                        type="date"
                        value={formData.birth_date}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, birth_date: e.target.value })}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    />
                    <InputError message={errors.birth_date} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="contract_end_at" value="Contract End Date" />
                    <input
                        id="contract_end_at"
                        type="date"
                        value={formData.contract_end_at}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, contract_end_at: e.target.value })}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    />
                    <InputError message={errors.contract_end_at} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="status" value="Status" />
                    <SelectInput
                        id="status"
                        value={formData.status}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'on_probation' | 'terminated' })}
                        className="mt-1 block w-full"
                        required
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="on_probation">On Probation</option>
                        <option value="terminated">Terminated</option>
                    </SelectInput>
                    <InputError message={errors.status} className="mt-2" />
                </div>
            </div>


            <div className="flex items-center justify-end space-x-4">
                <SecondaryButton type="button" onClick={onClose}>
                    Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={isSubmitting}>
                    {employee ? 'Update' : 'Create'} Employee
                </PrimaryButton>
            </div>
        </form>
    );
}