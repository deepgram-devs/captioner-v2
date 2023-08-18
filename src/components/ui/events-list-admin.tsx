import {useState, useEffect } from "react";
import { createClient } from "@/utils/supabase-browser";
import { DGEvent } from '@/types/event';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useRouter } from "next/navigation";
import { Skeleton } from "./skeleton";
import EditIcon from "./edit-icon";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const statuses = {
  approved: 'text-[#00E062]',
  'pending': 'text-[#FDB022]',
  rejected: 'text-[#F0463A]',
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}


export default function EventList() {

  const supabase = createClient();

  const [events, setEvents] = useState([] as DGEvent[]);
  const [loading, setLoading] = useState(true);
  const [deleteEventID, setDeleteEventID] = useState('');

  async function deleteEvent(id: string) {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);
      if (error) {
        throw error;
      }
      else{
      setEvents((prev) => prev.filter((event) => event.id !== id));
      }
  }

  function eventDropDown(id: string) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center w-6 h-6 rounded-fullW">
          <EllipsisHorizontalIcon className="w-5 h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={5}>
        <AlertDialogTrigger onClick={
            (e)=>{
              setDeleteEventID(id);
            }
          } className="w-full">
        <DropdownMenuItem className="text-sm w-full">
            Delete
        </DropdownMenuItem>
        </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select(
          "id, title, slug, key, approval_status, start_date, total_days, user_id, contact_email, organizer_name, created_at"
        )
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) {
        throw error;
      }
      setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  function NoEvents(){
    const router = useRouter();
    return (
      <div className='p-[2px] my-5'>
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

  return (
    <AlertDialog key='admin-events'>
    <div className='custom-bar my-10'>
    <h1 className='text-2xl'>Admin Panel</h1>
    {loading? <Skeleton className="h-[100px] w-full"/>:
    <ScrollArea className='min-h-[100px] max-h-[350px] overflow-scroll overflow-x-hidden'>
    {(events.length == 0) ?
      <NoEvents/>:
    <ul role="list" className="divide-y divide-gray-800 style-4">
      {events.map((event) => (
        <li key={event.id} className="flex items-center justify-between gap-x-6 py-5">
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-white">{event.title}</p>
              {event.approval_status!=undefined && <p
                className={classNames(
                  statuses[event.approval_status as keyof typeof statuses],
                  'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium'
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
          <div className="flex flex-none items-center gap-x-8 mr-5">
            <div className={event.approval_status=='approved'?'': 'ring-gradient-to-b-2 '}>
            <a
              href={`/app/events/edit/${event.id}?key=${event.key}`}
              className="hidden rounded-md bg-black w-[150px] text-center m-[2px] p-3 text-sm font-semibold text-white shadow-sm hover:bg-transparent sm:block"
            > {event.approval_status == 'approved' ? <div className="flex flex-row items-center gap-x-1">
              <EditIcon/>
              Edit
            </div> : 'Open for Approval'}
            <span className="sr-only">, {event.title}</span>
            </a></div>
            <div>
            {eventDropDown(event.id)}
            </div>
          </div>
        </li>
      ))}
    </ul>}
    </ScrollArea>}
    </div>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
        This action cannot be undone. This will delete the event and you will have to request a new one.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={
          (e)=>{
            deleteEvent(deleteEventID);
          }
        }>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
  )
}
