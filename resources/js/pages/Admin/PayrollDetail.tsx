import React from "react";
import AdminLayout from "@/layouts/admin/AdminLayout";
import PageMeta from "@/Components/common/PageMeta";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/Components/ui/card";
import { Button } from "@/components/ui/button"; 
import { format } from "date-fns";

interface Payroll {
  id: number;
  employee: {
    id: number;
    name: string;
  };
  month: string;
  base_salary: number;
  total_worked_hours: number;
  total_overtime_hours: number;
  unpaid_leave_days: number;
  net_salary: number;
  created_at: string;
  status: string;
}

interface Props {
  payroll: Payroll;
}

const PaymentDetail = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="flex justify-between py-3 border-b border-gray-200">
    <span className="text-gray-600">{title}</span>
    <span className="font-medium">{value}</span>
  </div>
);

// helper format tiền
const formatCurrency = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export default function PayrollDetail({ payroll }: Props) {
  return (
    <AdminLayout>
      <PageMeta
        title={`Payroll Details - ${payroll.employee.name}`}
        description="View payroll details"
      />

      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Payroll Details
          </h1>
          <p className="mt-2 text-gray-600">
            Detailed breakdown for {payroll.employee.name}'s salary for{" "}
            {format(new Date(payroll.month), "MMMM yyyy")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Salary breakdown */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Salary Breakdown</CardTitle>
              <CardDescription>
                Generated on {format(new Date(payroll.created_at), "PPP")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <PaymentDetail
                  title="Base Salary"
                  value={formatCurrency(payroll.base_salary)}
                />
                <PaymentDetail
                  title="Total Worked Hours"
                  value={`${payroll.total_worked_hours} hours`}
                />
                <PaymentDetail
                  title="Overtime Hours"
                  value={`${payroll.total_overtime_hours} hours`}
                />
                <PaymentDetail
                  title="Overtime Pay (1.5x)"
                  value={formatCurrency(
                    (payroll.base_salary / 160) *
                      1.5 *
                      payroll.total_overtime_hours
                  )}
                />
                <PaymentDetail
                  title="Unpaid Leave Deductions"
                  value={`-${formatCurrency(
                    (payroll.base_salary / 20) * payroll.unpaid_leave_days
                  )}`}
                />
                <div className="mt-4 pt-4 border-t-2 border-gray-900">
                  <PaymentDetail
                    title="Net Salary"
                    value={formatCurrency(payroll.net_salary)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status + Actions */}
          {/* <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium
                  ${
                    payroll.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : payroll.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {payroll.status.charAt(0).toUpperCase() +
                    payroll.status.slice(1)}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => window.print()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl transition-all duration-200"
            >
              Download PDF
            </Button>
          </div> */}
        </div>
      </div>
    </AdminLayout>
  );
}
