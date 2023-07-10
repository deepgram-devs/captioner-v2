"use client";

import EventLayout from "../../../../components/layouts/EventLayout"
import { usePathname } from "next/navigation";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import type { DGEvent } from "../../../../types/event";
import TranscriptDisplay from "../../../../components/ui/TranscriptDisplay"

import { createClient } from "../../../../utils/supabase-browser";

const EventHome: NextPage = () => {
  const [event, setEvent] = useState({} as DGEvent);

  const pathname = usePathname()

  
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
          setEvent(data[0]);
        }
      };
      getEvent().catch((err) => console.log(err));
    }
  }, [slug]);

  return (
    <EventLayout eventName={event.title}>
      <TranscriptDisplay
        eventId={event.id}
      />
    </EventLayout>
  );
};

export default EventHome;
