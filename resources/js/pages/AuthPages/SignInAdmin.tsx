import { Head } from '@inertiajs/react';
import AuthLayout from "./AuthPageLayout";
import SignInAdminForm from "../../components/auth/SignInAdminForm";

export default function SignIn() {
    return (
        <>
            <Head>
                <title> SignInAdmin </title>
            </Head>

            <AuthLayout>
                <SignInAdminForm />
            </AuthLayout>
        </>
    );
}