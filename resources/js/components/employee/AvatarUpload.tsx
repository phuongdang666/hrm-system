import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import Button from '@/components/ui/button/Button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Props {
    employeeId: number;
    currentAvatar?: string;
    onAvatarUpdated: () => void;
}

export default function AvatarUpload({ employeeId, currentAvatar, onAvatarUpdated }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        avatar: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.data.avatar) {
            return;
        }

        form.post(route('employee.profile.avatar.update'), {
            forceFormData: true,
            preserveScroll: true,
            onError: (errors) => {
                console.error('Upload error:', errors);
            },
            onSuccess: () => {
                setIsOpen(false);
                setPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                onAvatarUpdated();
            },
        });
    };

    return (
        <>
            <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg">
                <Button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="w-8 h-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                    >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                </Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Avatar</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                                id="avatar-upload"
                            />
                            <Button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border-2 border-dashed border-gray-300 rounded-lg p-8"
                            >
                                <div className="space-y-2 text-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mx-auto h-12 w-12 text-gray-400"
                                    >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    <div className="text-sm text-gray-600">
                                        <label
                                            htmlFor="avatar-upload"
                                            className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
                                        >
                                            <span>Upload a file</span>
                                        </label>{' '}
                                        or drag and drop
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF up to 2MB
                                    </p>
                                </div>
                            </Button>
                        </div>

                        {preview && (
                            <div className="mt-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">Preview</div>
                                <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                                    <img
                                        src={preview}
                                        alt="Avatar preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        {form.errors.avatar && (
                            <div className="text-sm text-red-600">{form.errors.avatar}</div>
                        )}

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!preview || form.processing}
                                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white"
                            >
                                {form.processing ? 'Uploading...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}