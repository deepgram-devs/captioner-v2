"use client";

import EventLayout from "@/components/layouts/event-layout"
import { usePathname } from "next/navigation";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import type { DGEvent } from "@/types/event";
import TranscriptDisplay from "@/components/ui/transcript-display"
import { useRouter } from "next/navigation";
import ErrorPage from 'next/error'

import { createClient } from "@/utils/supabase-browser";

const EventHome: NextPage = () => {
  const [event, setEvent] = useState({} as DGEvent | any);

  const pathname = usePathname()

  const [error, setError] = useState(false)

  
  const slug = pathname.split('/').slice(-1)[0]

  const supabase = createClient();

  useEffect(() => {
    if (slug) {
      const getEvent = async () => {
        const { data, error } = await supabase
          .from("events")
          .select("id, title")
          .eq("slug", slug);
        if (error) {
          throw error;
        }
        if (data) {
          if (data.length === 0) {
            setError(true)
          }
          setEvent(data[0]);
        }
      };
      getEvent().catch((err) => console.log(err));
    }
  }, [slug]);

  return (
    error ? <ErrorPage statusCode={404}/> : (
      <EventLayout eventName={event.title}>
        <TranscriptDisplay eventId={event.id} />
      </EventLayout>
    )
  );
};

export default EventHome;
