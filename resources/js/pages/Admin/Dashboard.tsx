// resources/js/pages/Home.tsx
import React from "react";
import PageMeta from "@/components/common/PageMeta";
import AdminLayout from "@/layouts/admin/AdminLayout";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function Dashboard() {
  // Placeholder stats — in a real app these would be fetched from API
  const stats = {
    totalEmployees: 128,
    newThisMonth: 5,
    attendanceToday: 112,
    pendingLeaves: 3,
    recentAnnouncements: [
      { id: 1, title: "Office closed on Friday", date: "2025-09-12" },
      { id: 2, title: "Payroll processed", date: "2025-09-01" },
    ],
  };

  return (
    <AdminLayout>
      <PageMeta title="Admin Dashboard" description="Overview of HRM system" />

      <PageBreadcrumb pageTitle="Admin Dashboard" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Employees</CardTitle>
              <CardDescription>New this month: {stats.newThisMonth}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.totalEmployees}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.attendanceToday}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Leaves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.pendingLeaves}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {stats.recentAnnouncements.map((a) => (
                  <li key={a.id} className="pb-1">
                    <div className="font-medium">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.date}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Quick Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Today: {stats.attendanceToday} present, {stats.totalEmployees - stats.attendanceToday} absent</p>
              <div className="mt-4 text-sm text-muted-foreground">(Attendance chart placeholder)</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Leaves</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="mt-2 text-sm text-muted-foreground">
                <li>John Doe — Annual leave (3 days)</li>
                <li>Jane Smith — Sick leave (1 day)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}