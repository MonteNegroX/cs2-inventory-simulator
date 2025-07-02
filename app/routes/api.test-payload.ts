// app/routes/api.test-payload.ts

import { json } from "@remix-run/node";

export const action = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("✅ [api.test-payload] Received payload:", body);

    return new Response(JSON.stringify({ received: body }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ [api.test-payload] Error handling payload:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
