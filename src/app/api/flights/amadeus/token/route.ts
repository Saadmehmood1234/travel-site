
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const response = await fetch(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: process.env.AMADEUS_CLIENT_ID || "",
          client_secret: process.env.AMADEUS_CLIENT_SECRET || "",
        }),
      }
    );
    console.log("Tes99--",response);
    if (!response.ok) {
      throw new Error("Failed to get Amadeus token");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Amadeus token error:", error);
    return NextResponse.json(
      { error: "Failed to get access token" },
      { status: 500 }
    );
  }
}
