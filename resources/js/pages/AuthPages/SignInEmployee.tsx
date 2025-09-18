import { Head } from '@inertiajs/react';
import AuthLayout from "./AuthPageLayout";
import SignInEmployeeForm from "../../components/auth/SignInEmployeeForm";

export default function SignIn() {
  return (
    <>
      <Head>
        <title> SignInEmployee </title>
      </Head>

      <AuthLayout>
        <SignInEmployeeForm />
      </AuthLayout>
    </>
  );
}