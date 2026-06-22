import { Navbar } from "@/components/layout/navbar";
import { Board } from "@/components/board/board";

export default function Home() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Navbar />
      <main className="flex flex-1 flex-col overflow-hidden pt-4">
        <Board />
      </main>
    </div>
  );
}
