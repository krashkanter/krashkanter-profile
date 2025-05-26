import { Gruppo } from "next/font/google";
import { HydrateClient } from "~/trpc/server";

import { TextMorph } from "~/components/textMorph";

const gruppo = Gruppo({
  subsets: ["latin"],
  weight: "400",
});

export default async function Home() {
  return (
    <HydrateClient>
      <main
        className={`flex min-h-screen flex-col items-center justify-center bg-white text-black ${gruppo.className}`}
      >
        <TextMorph strings={["KrashKanter", "Keerthan"]} />
      </main>
    </HydrateClient>
  );
}
