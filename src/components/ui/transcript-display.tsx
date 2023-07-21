import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase-browser";

const supabase = createClient();

type TDProps = {
  eventId: string;
};

const TranscriptDisplay = (props: TDProps) => {
  const [transcript, setTranscript] = useState("");
  var lastTwo = '';

  const TranscriptColorizer = (transcriptColorizerProps: { htmlString: string; }) => {
    const lines = transcriptColorizerProps.htmlString.split('\n');
    const styledHtml = lines.map((line, index) => {
      if (index === 1) {
        return <span className="text-[#FFFCC7]" key={line}>{line}</span>;
      } else {
        return line + '\n';
      }
    });
  
    return <div className="text-[#FFF]">{styledHtml}</div>;
  };

  useEffect(() => {
    if (props.eventId) {
      const getPreviousTranscript = async () => {
        const { data, error } = await supabase
          .from("transcripts")
          .select("transcript_json")
          .eq("event_id", props.eventId)
          .order("created_at", { ascending: false }).limit(20);
        if (error) {
          throw error;
        }
        var count = 0;
        if (data) {
          for (let i = data.length - 1; i >= 0; i--) {
            if (count > 0) {
              break;
            }
            if (data[i].transcript_json.is_final) {
            setTranscript((prev) => prev + "\n" + data[i].transcript_json.channel.alternatives[0].transcript);
            count++;}
          }
          lastTwo = transcript.split('\n').slice(-1).join('\n');
        }
      };
      getPreviousTranscript().catch((err) => console.log(err));
    }
    const channel = supabase
      .channel("transcript changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transcripts",
          filter: `event_id=eq.${props.eventId}`,
        },
        (payload) => {
          setTranscript((prev) => {
            if (payload.new.transcript_json.is_final) {
              var res = lastTwo + '\n' + payload.new.transcript;
              const updatedLastTwo = payload.new.transcript;
              lastTwo = (updatedLastTwo);
              console.log(lastTwo);
              // console.log("final", lastTwo);
              return res
            } else{
            console.log("not final", lastTwo);
            return lastTwo + "\n" + payload.new.transcript;
            }
          });
          // const messageBody = document.getElementById("message-body");
          const anchor = document.getElementById("anchor");

          if (anchor) anchor.scrollIntoView({ behavior: "smooth" });
        }
      )
      .subscribe();
    // }
    return () => {
      console.log("unsubscribing");
      supabase.removeChannel(channel);
    };
  }, [props.eventId]);

  return (
    <div
      className={`p-2 max-h-[600px]`}
      style={{ overflowAnchor: "none" }}
    >
      <p
        id="message-body"
        className={`whitespace-pre-wrap m-x-auto text-center text-4xl p-10 text-center md:text-7xl `}>
        <TranscriptColorizer htmlString={transcript} />
      </p>
      <div id="anchor"></div>
    </div>
  );
};

export default TranscriptDisplay;
