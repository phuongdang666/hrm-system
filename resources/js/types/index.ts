export interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    errors: Record<string, string>;
    status?: string | null;
}