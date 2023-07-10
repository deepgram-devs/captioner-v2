import { PhotoIcon} from '@heroicons/react/24/solid'

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState, useEffect } from 'react'
import { Database } from '@/types/supabase'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import AdminLayout from '@/components/layouts/AdminLayout'
import router from 'next/router'
import FileUploadNewEvent from '@/components/FileUploadNewEvent'
import { data } from 'autoprefixer'
import SuccessPage from '@/components/SuccessPopUp'

export default function NewEvent() {

  const supabase = useSupabaseClient<Database>();


  // Get today's date to use as the default date in the calendar
  let today = new Date()

  const [date, setDate] = useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 0),
  })

  const  [eventName, setEventName] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");
  const [organizerName, setOrganizerName] = useState<string>("");
  const [organizerEmail, setOrganizerEmail] = useState<string>("");
  const [websiteLink, setWebsiteLink] = useState<string>("");
  const [country, setCountry] = useState<string>("United States");
  const [city, setCity] = useState<string>("");
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [eventState, setEventState] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [event_prospectus, setEventProspectus] = useState({} as File);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const submitNewEvent = async (updateEvent: any) => {
    updateEvent.preventDefault();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    const data = await supabase
      .from("events")
      .insert(
        {
          title:eventName,
          start_date: date?.from,
          end_date: date?.to,
          description: eventDescription,
          organizer_name: organizerName,
          contact_email: organizerEmail,
          website: websiteLink,
          country: country,
          approval_status: "pending",
          user_id: user?.id,
          city: city,
          street_address: streetAddress,
          state: eventState,
          zip_code: zipCode
        },
        { count: "estimated" }
      )
      .select();
    console.log("data", { data });
    if (data.error) {
      // updateSuccessMessage("Error creating event");
    } else {
      // updateSuccessMessage("Event created");
      if (event_prospectus.name) {
        const { data: fileData, error: fileError } = await supabase.storage
          .from("event-prospectus")
          .upload(`${data.data[0].id}/Prospectus`, event_prospectus, {
            cacheControl: "3600",
            upsert: false,
          });
        console.log({ fileData, fileError });
        if (!fileError) {
            console.log("file uploaded");
            setShowSuccess(true);
        }
        else{
            alert("There was an error uploading the file. Please try again.");
            return;
        }
      }
      else{ 
        setShowSuccess(true);
      }
    }
  };


  return (
    <AdminLayout>
      { showSuccess? <SuccessPage 
        heading="Event Created"
        subheading="Your event has been created successfully. You can view it in the events page."
       /> : null}
      <div className='p-10'>
    <form>
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-12">
          <h2 className="text-3xl font-semibold leading-7 text-white">New Event</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            After you propose a new event collaboration with Deepgram. It will be reviewed by our team for approval.
          </p>
          
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            
          <div className="col-span-full">
              <label className="block text-sm font-medium leading-6 text-white">
                Event Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="event-title"
                  id="event-title"
                  autoComplete="event-title"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium leading-6 text-white">
                Event Dates
              </label>
              <div className='ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 w-[300px]'>
              <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"ghost"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
            </div>
            </div>
            
            <div className="col-span-full">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-white">
                Event Description
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  defaultValue={''}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-400">Write a few sentences about the event.</p>
            </div>



            <FileUploadNewEvent prospectusFile={event_prospectus} setProspectusFile={setEventProspectus}/>
          </div>
        </div>

        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">Company Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">Use the address where the event will be physically held.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">
              <label className="block text-sm font-medium leading-6 text-white">
                Organizer Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={(e) => setOrganizerName(e.target.value)}
                />
              </div>
            </div>

            
            <div className="sm:col-span-full">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={(e) => setOrganizerEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium leading-6 text-white">
                Website Link
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="website"
                  id="website"
                  autoComplete="website"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={(e) => setWebsiteLink(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                Country
              </label>
              <div className="mt-2">
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black"
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-white">
                Street address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="street-address"
                  id="street-address"
                  autoComplete="street-address"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={(e) => setStreetAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-white">
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="region" className="block text-sm font-medium leading-6 text-white">
                State / Province
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={(e) => setEventState(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-white">
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-white"
        onClick={(e)=>{
          router.push('/app/events')
        }}>
          Cancel
        </button>
        <div className="ring-gradient-to-b-2">
      <button onClick={(e)=>{submitNewEvent(e)}} className="bg-black hover:bg-transparent m-[2px] rounded-md">
        <div className="my-3 mx-5 sm:mx-10">
        Create event
        </div>
      </button>
      </div>
      </div>
    </form>
    </div>
    </AdminLayout>
  )
}
