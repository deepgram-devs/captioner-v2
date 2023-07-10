import {useState, useEffect } from "react";
import { createClient } from "@/utils/supabase-browser";
import { DGEvent } from '@/types/event';
import { ScrollArea } from '@radix-ui/react-scroll-area';

const statuses = {
  approved: 'text-green-700 bg-green-50 ring-green-600/20',
  'pending': 'text-gray-600 bg-gray-50 ring-gray-500/10',
  rejected: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function EventList() {

  const supabase = createClient();

  const [events, setEvents] = useState([] as DGEvent[]);

  const getEvents = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    const { data, error } = await supabase
    .from("events")
    .select(
      "id, title, slug, key, approval_status, start_date, total_days, user_id, contact_email, dg_project, dg_key, organizer_name"
      ).order("start_date", { ascending: false }).limit(50);
    if (error) {
      throw error;
    }
    if (data) {
      setEvents(data);
      console.log("DATA:",events);
    }
  };
  
  
  useEffect(() => {
    getEvents().catch((err) => console.log(err));
  }, []);

  return (
    <div className='custom-bar my-10'>
    <h1 className='text-2xl'>Admin Panel</h1>  
    <ScrollArea className='h-[400px] overflow-scroll overflow-x-hidden'>
    <ul role="list" className="divide-y divide-gray-800 style-4">
      {events.map((event) => (
        <li key={event.id} className="flex items-center justify-between gap-x-6 py-5">
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-white">{event.title}</p>
              <p
                className={classNames(
                  statuses[event.approval_status],
                  'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                )}
              >
                {event.approval_status}
              </p>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-300">
              <p className="whitespace-nowrap">
                On <time dateTime={event.start_date}>{event.start_date}</time>
              </p>
              {(event.organizer_name) &&
              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                <circle cx={1} cy={1} r={1} />
              </svg>}
              {(event.organizer_name) &&
              <p className="truncate">Created by {event.organizer_name}</p>}
            </div>
          </div>
          <div className="flex flex-none items-center gap-x-4 mr-5">
            <div className='ring-gradient-to-b-2 '>
            <a
              href={`/app/events/edit/${event.id}?key=${event.key}`}
              className="hidden rounded-md bg-black w-[150px] text-center m-[2px] p-3 text-sm font-semibold text-white shadow-sm hover:bg-transparent sm:block"
            > {event.approval_status == 'approved' ? 'Edit Event' : 'Open for Approval'}
            <span className="sr-only">, {event.title}</span>
            </a></div>
          </div>
        </li>
      ))}
    </ul>
    </ScrollArea>
    </div>
  )
}
