"use client";

import AdminLayout from "@/components/layouts/admin-layout";
import type { NextPage } from "next";
import {useContext} from "react";
import { createClient } from "@/utils/supabase-browser";
import AdminContext from "@/components/providers/admin-context";
import AdminEventList from "@/components/ui/events-list-admin";
import UserEventList from "@/components/ui/events-list-user";
import {useRouter} from "next/navigation";
import { useSupabase } from "@/components/providers/supabase-provider";
import SignOutIcon from "@/components/ui/sign-out-icon";

// Create a single supabase client for interacting with your database

const supabase = createClient();
const EventHome: NextPage = () => {
  const {isAdmin} = useContext(AdminContext);
  const router = useRouter();
  const {supabase} = useSupabase();

  function logout(){
    supabase.auth.signOut();
  }

  return (
    <>
    <AdminLayout type="broadcast" eventName={"Event Captioner"}>
      <div className="mx-14">
      <div className="flex flex-row justify-center sm:justify-between my-6">
      <div className="ring-gradient-to-b-2">
        <button onClick={
          (e)=>{
          router.push('/app/events/new')
          }
        } className="bg-black hover:bg-transparent m-[2px] rounded-md">
            <div className="my-3 mx-5 sm:mx-10">
            Create event
            </div>
        </button>
      </div>

        <button onClick={
          (e)=>{
          logout();
          }
        } className="bg-black hover:bg-transparent m-[2px] rounded-md">
            <div className="my-3 text-[#ff2eea] flex flex-row gap-x-1">
            <SignOutIcon/>
            <p>Logout</p>
            </div>
        </button>
      </div>
    {isAdmin && <AdminEventList/>}
    <UserEventList/>
      </div>
    </AdminLayout>
    </>
  );
};

export default EventHome;
