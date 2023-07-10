"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import type { NextPage } from "next";
import {useContext} from "react";
import { createClient } from "@/utils/supabase-browser";
import AdminContext from "../../../components/providers/AdminContext";
import AdminEventList from "../../../components/ui/eventsListAdmin";
import UserEventList from "../../../components/ui/eventsListUser";
import router from "next/router";

// Create a single supabase client for interacting with your database

const supabase = createClient();
const EventHome: NextPage = () => {
  const {isAdmin} = useContext(AdminContext);

  return (
    <>
    <AdminLayout type="broadcast" eventName={"Event Captioner"}>
      <div className="mx-14">
      <div className="flex flex-row justify-center sm:justify-end m-6">
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
      </div></div>
    {isAdmin && <AdminEventList/>}
    <UserEventList/>
      </div>
    </AdminLayout>
    </>
  );
};

export default EventHome;
