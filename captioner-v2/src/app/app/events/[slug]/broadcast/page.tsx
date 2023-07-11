"use client";

import AdminLayout from "@/components/layouts/admin-layout";
import { usePathname, useSearchParams } from "next/navigation";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import type { DGEvent } from "@/types/event";
import TranscriptDisplay from "@/components/ui/transcript-display";
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/utils/supabase-browser";

// Create a single supabase client for interacting with your database

const supabase = createClient();

let ws: WebSocket;
let mediaRecorder: MediaRecorder;

const EventHome: NextPage = () => {
  const pathname = usePathname();
  const slug = pathname.split('/').slice(-2)[0]
  const searchparams  = useSearchParams();
  const publisherKey = searchparams.get('key');
  const [event, setEvent] = useState({} as DGEvent | any);
  const [dgKey, setDgKey] = useState("");
  const [showMicCheck, setShowMicCheck] = useState(false);
  const [diableSubmit, setDisableSubmit] = useState(false);


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

  function start() {
    if (mediaRecorder) {
    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0 && ws.readyState == 1) {
        ws.send(event.data);
      }
    })
    console.log(mediaRecorder.state)
    mediaRecorder.start(250);
    console.log(mediaRecorder.state)
  };
  }

  async function handleResponse(message: MessageEvent) {
    const data = JSON.parse(message.data);
    const transcript = data.channel.alternatives[0].transcript;
    if (transcript.length > 0) {
      const insertData = await supabase.from("transcripts").insert({
        transcript_json: data,
        event_id: event.id,
        transcript,
      });
      if (insertData.error) {
        throw insertData.error;
      }
    }
  }

  const getDGKey = async () => {
    const res = await fetch("../../../api/tempKey", {
      body: JSON.stringify({ eventId: event.id, key: publisherKey }),
      method: "POST",
    });
    const resp = await res.json();
    if (resp.error) {
      mediaRecorder.stop();
      return alert(resp.error);
    }
    setDgKey(resp.deepgramToken);
    ws = new WebSocket(
      "wss://api.deepgram.com/v1/listen?tier=enhanced&punctuate=true&endpointing=5&smart_format=true",
      ["token", resp.deepgramToken]
    );
    ws.onopen = start;
    console.log('here')
    ws.onmessage = handleResponse;
    setDisableSubmit(true);
  };
  const getMicAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      setShowMicCheck(true);
    } catch (err) {
      alert("You must provide access to the microphone");
    }
  };

  console.log(showMicCheck, diableSubmit);
      

  return (
    <AdminLayout type="broadcast" eventName={event.title}>
      {(!showMicCheck || !diableSubmit)?
      <div className="h-full flex flex-row m-auto justify-center align-center">
        <div className="m-auto">
        <div className="flex flex-row justify-center align-center my-10">
        <button className="m-auto bg-gray-800 gradient-dark rounded-full shadow-md shadow-gray p-10" onClick={(e: React.SyntheticEvent) => {getMicAccess()
                e.preventDefault();
                getDGKey();}}>
        <MicrophoneIcon className=" h-[300px]"/>
        </button>
        </div>
        <h1 className="text-center font-semibold text-3xl">Start Transcribing</h1>
        <h1 className="text-center text-xl">Click on the microphone to get started.</h1>
        </div>
      </div>:
      <TranscriptDisplay
        eventId={event.id}
      />}
    </AdminLayout>
  );
};

export default EventHome;
