'use client';

import {useState, useEffect } from "react";
import { createClient } from "@/utils/supabase-browser";
import { DGEvent } from '@/types/event';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

const statuses = {
  approved: 'text-green-700 bg-green-50 ring-green-600/20',
  'pending': 'text-gray-600 bg-gray-50 ring-gray-500/10',
  rejected: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function NoEvents(){
  const router = useRouter();
  return (
    <div className='ring-gradient-to-b-2 p-[2px] my-5'>
        <button
        onClick={
          (e)=>{
          router.push('/app/events/new')
          }}
          type="button"
          className="relative block w-full bg-black rounded-lg p-12 text-center"
        >
          <div className='flex flex-row justify-center'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" className="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
        </svg></div>

          <span className="mt-2 block text-sm font-normal text-white">You have no events, click here to create one</span>
        </button></div>
  );
}

export default function EventListUser() {

  const supabase = createClient();

  const [events, setEvents] = useState([] as DGEvent[]);

  const [fetched, setFetched] = useState(false);

  const getEvents = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    const { data, error } = await supabase
    .from("events")
    .select(
      "id, title, slug, key, approval_status, start_date, total_days, user_id, contact_email, dg_project, dg_key, organizer_name"
      ).order("start_date", { ascending: false }).eq(
        "user_id", user?.id
      );
      setFetched(true);
    if (error) {
      throw error;
    }
    if (data) {
      setEvents(data);
    }
  };
  
  
  useEffect(() => {
    getEvents().catch((err) => console.log(err));
  }, []);

  return (
    <div className='custom-bar my-20'>
    <h1 className='text-2xl'>Your Events</h1>
    {fetched && events.length === 0 ? <NoEvents/>:
    <ul role="list" className="divide-y divide-gray-800 h-[400px] overflow-scroll overflow-x-hidden style-4">
      {events.map((event) => (
        <li key={event.id} className="flex items-center justify-between gap-x-6 py-5">
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-white">{event.title}</p>
              {event.approval_status!=undefined &&
              <p
                className={classNames(
                  statuses[event.approval_status],
                  'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                )}
              >
                {event.approval_status}
              </p>}
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
          <div className="flex flex-none items-center gap-x-4">
          {event.approval_status === 'approved' && 
          <Link
            target="_blank"
            className="text-sm text-link hidden rounded-md bg-black m-[2px] p-3 text-sm font-semibold text-white shadow-sm hover:bg-transparent sm:block whitespace-nowrap"
            href={`/app/events/${event.slug}/broadcast?key=${event.key}`}>
            Broadcast<span className="sr-only">, {event.title}</span>
            </Link>
            }
            {(event.approval_status === 'approved') &&
            <div className=''>
            <Link
              href={`/events/${event.slug}`}
              className="hidden rounded-md bg-black m-[2px] p-3 text-sm font-semibold text-white shadow-sm hover:bg-transparent sm:block"
            >
              View<span className="sr-only">, {event.title}</span>
            </Link></div>
            }
            <div className=' mr-5'>
            <a
              href={`/app/events/edit/${event.id}?key=${event.key}`}
              className="hidden rounded-md bg-black m-[2px] p-3 text-sm font-semibold text-white shadow-sm hover:bg-transparent sm:block"
            >
              Edit<span className="sr-only">, {event.title}</span>
            </a></div>
          </div>
        </li>
      ))}
    </ul>}
    </div>
  )
}
