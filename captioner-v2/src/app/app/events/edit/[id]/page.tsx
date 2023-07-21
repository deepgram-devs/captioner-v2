'use client';

import AdminContext from "@/components/providers/admin-context";
import { useContext, useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase-browser";
import { DGEvent } from "@/types/event";
import UserEventEdit from "@/components/ui/user-edit";
import ErrorPage from 'next/error'
import AdminEdit from "@/components/ui/admin-approval-edit";

const supabase = createClient();  

function EventEditPage(){
    const pathname = usePathname();
    const searchparams = useSearchParams();
    const id = pathname.split('/').slice(-1)[0]
    const publisherKey = searchparams.get('key');
    const {isAdmin} = useContext(AdminContext);
    const [event, setEvent] = useState({} as DGEvent);
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [fetched, setFetched] = useState(false);

    function isAuthenticatedCheck(val1: any, val2: any){
        if (val1 == val2){
            setAuthenticated(true);
        }
        else{
            setAuthenticated(false)
        }

    }

    useEffect(() => {
      if (id) {
          const getEvent = async () => {
            if (isAdmin){
              const { data, error } = await supabase
              .from("events")
              .select("id, title, slug, key, dg_project, dg_key, approval_status, start_date, end_date, total_days, user_id, contact_email, website, description, organizer_name, country, city, state, street_address, zip_code")
              .eq("id", id).limit(1);
              if (error) {
                throw error;
              }
              if (data) {
                setEvent(data[0]);
                isAuthenticatedCheck(data[0]['key'],publisherKey)
              }  
            }
            else {
              const { data, error } = await supabase
              .from("events")
              .select("id, title, slug, key, approval_status, start_date, end_date, total_days, user_id, contact_email, website, description, organizer_name, country, city, state, street_address, zip_code")
              .eq("id", id).limit(1);
              if (error) {
                throw error;
              }
              if (data) {
                setEvent(data[0]);
                isAuthenticatedCheck(data[0]['key'],publisherKey)
              }
            }
            setFetched(true);
          };
          getEvent().catch((err) => console.log(err));
        }
    }, [id, publisherKey]);

    return (
      <div>
      {isAuthenticated ? (
        isAdmin ? (
         <AdminEdit event={event}/>
        ) : (
          <UserEventEdit event={event} />
        )
      ) : (
        fetched ? (
          <ErrorPage statusCode={404} />
        ) : (
          <></>
        )
      )}
    </div>    
    )
}

export default EventEditPage;