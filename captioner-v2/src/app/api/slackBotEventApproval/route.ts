import { NextRequest } from 'next/server'
const {createClient} = require('@supabase/supabase-js');

// load env variables

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_SUPABASE_ELEVATED_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Takes in request from the Slack bot with the event id and event_status and approves/rejects the event
// based on the action passed

export async function POST (req: NextRequest) {

    const body = await req.json();

    const {event_id, event_status} = body;

    if (event_status != "approved" && event_status != "rejected") {
        return new Response(JSON.stringify({text: "Invalid event status"}));
    }

    if (event_id == null) {
        return new Response(JSON.stringify({text: "Invalid event id"}));
    }

    const {data,error} = await supabase.from('events').update({approval_status: event_status}).eq('id',event_id).select();

    if (error) {
        // add status code
        return new Response(JSON.stringify({text: "Error approving event"}));
    } else {
        // add status code
        return new Response(data);
    }
}