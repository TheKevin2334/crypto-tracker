import { NextResponse } from "next/server";

export const config = {
  matcher: "/api/:path*",
  runtime: "edge", // ✅ Tells Vercel to deploy as Edge Function
};

export function middleware(request) {
  if (request.method === "OPTIONS") {
    const preflight = new NextResponse(null, { status: 200 });
    preflight.headers.set("Access-Control-Allow-Origin", "*");
    preflight.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    preflight.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return preflight;
  }

  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
