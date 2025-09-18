import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpAdminForm from "../../components/auth/SignUpAdminForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="SignUp Admin"
        description="This is React.js SignUp Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignUpAdminForm />
      </AuthLayout>
    </>
  );
}
