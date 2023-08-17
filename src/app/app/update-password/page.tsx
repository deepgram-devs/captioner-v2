"use client";

import UpdatePasswordCard  from "@/components/ui/update-password";
import AdminLayout from "@/components/layouts/admin-layout";

export default function updatePasswordPage() {
    return (
        <AdminLayout type="broadcast" eventName={"Event Captioner"}>
        <div className="h-full flex">
            <div className="mx-auto my-auto">
            <UpdatePasswordCard/>
            </div>
        </div>
        </AdminLayout>
    )
}