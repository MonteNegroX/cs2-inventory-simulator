import { supabaseAdmin } from "~/db/supabaseServer";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const user_id = url.searchParams.get("user_id");

  if (!user_id) {
    return new Response(JSON.stringify({ error: "Missing user_id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data, error } = await supabaseAdmin
    .from("players")
    .select("balance")
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error("❌ Error fetching balance:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ balance: data.balance }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
