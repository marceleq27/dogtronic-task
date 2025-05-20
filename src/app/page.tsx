import { ShopList } from "@/components/ShopList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[#2d2d2d] text-white">
      <div className="container flex flex-col items-center gap-8 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Dogtronic - zadanie rekrutacyjne
        </h1>
        <ShopList />
      </div>
    </main>
  );
}
