import { createClient } from "@/utils/supabase-server";
import { Deepgram } from "@deepgram/sdk";
import { NextRequest, NextResponse } from "next/server";
export async function POST (req: NextRequest) {

  // Create authenticated Supabase Client
  const supabase = createClient();
  const res = NextResponse.next();
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "not_authenticated",
    description:
      "The user does not have an active session or is not authenticated",}, { status: 401 });
  }

  try {
    const body = await req.json();
    const eventId = body.eventId
    const key = body.key
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("id", eventId);

    if (data && data.length > 0) {
      if (key != data[0].key) {
        return NextResponse.json(
          { error: "Key is missing or incorrect" }
        )
      }
      const deepgram = new Deepgram(data[0].dg_key);

      const newKey = await deepgram.keys.create(
        data[0].dg_project,
        "Temporary key - works for 10 secs",
        ["usage:write"],
        { timeToLive: 10 }
      );
      if ("key" in newKey) {
        return NextResponse.json({ deepgramToken: newKey.key });
      }
    } else {
      return NextResponse.json({ error: "Event not found or is not associated with this user's session" });
    }
  } catch (error) {
    return NextResponse.json({ error:error });
  }
};
