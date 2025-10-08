import { PropsWithChildren } from 'react';
import { Head } from '@inertiajs/react';

interface AppLayoutProps extends PropsWithChildren {
    title?: string;
}

export default function AppLayout({ children, title = 'HRM System' }: AppLayoutProps) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white border-b border-gray-100">
                    {/* Add your navigation components here */}
                </nav>

                <main className="py-4">
                    {children}
                </main>
            </div>
        </>
    );
}