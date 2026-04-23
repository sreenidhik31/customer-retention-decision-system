import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: NextRequest) {
  try {
    if (!API_BASE_URL) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_API_BASE_URL is not set." },
        { status: 500 }
      );
    }

    const body = await req.json();

    const response = await fetch(`${API_BASE_URL}/campaign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy campaign request failed", details: String(error) },
      { status: 500 }
    );
  }
}