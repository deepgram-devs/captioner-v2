import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { Database } from "@/types/supabase";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  const supabase = createMiddlewareClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log(pathname.split('/')[1])
  if (!session && pathname.split('/')[1] == 'app') {
    const url = new URL(req.url);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (!session && pathname === "/") {
    const url = new URL(req.url);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return res;
}