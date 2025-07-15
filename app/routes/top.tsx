// app/routes/top.tsx
import { Overlay } from "~/components/overlay";
import TopPlayers from "~/components/TopPlayers";

export default function TopOverlay() {
  return (
    <Overlay className="bg-zinc-900 p-6 rounded-xl max-w-xl w-full text-white">
      <TopPlayers />
    </Overlay>
  );
}
