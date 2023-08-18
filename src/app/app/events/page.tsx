"use client";

import AdminLayout from "@/components/layouts/admin-layout";
import type { NextPage } from "next";
import {useContext, useEffect} from "react";
import { createClient } from "@/utils/supabase-browser";
import AdminContext from "@/components/providers/admin-context";
import AdminEventList from "@/components/ui/events-list-admin";
import UserEventList from "@/components/ui/events-list-user";
import {useRouter} from "next/navigation";
import { UserAccountNav } from "@/components/ui/user-account-nav";
import { useAuth } from "@/components/providers/supabase-auth-provider";
// Create a single supabase client for interacting with your database

const supabase = createClient();
const EventHome: NextPage = () => {
  const {isAdmin, setIsAdmin} = useContext(AdminContext);
  const router = useRouter();
  const { user } = useAuth();
  // reset the admin context on page load until we know if the user is an admin
  useEffect(()=>{
    setIsAdmin(false);
  } 
  ,[]);

  useEffect(() => {
    if (user) {
      const authDomain = user.email?.split("@")[1];
      if (authDomain == "deepgram.com") {
        setIsAdmin(true);
      }
    }
  }, [user]);


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
            Create Event
            </div>
        </button>
      </div>

      <UserAccountNav/>
      </div>
    {isAdmin && <AdminEventList/>}
    <UserEventList/>
      </div>
    </AdminLayout>
    </>
  );
};

export default EventHome;
