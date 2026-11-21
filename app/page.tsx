import Library from "./components/Library";

export default function Home() {
  return (
    <>
      <section className="relative flex h-64 items-center justify-center bg-[url('/book.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-stone-900/65" />
        <div className="relative px-4 text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">My Book Library 📚</h1>
          <p className="mt-3 text-lg text-stone-200">Search, borrow, rate and organise your favourite reads.</p>
        </div>
      </section>
      <Library />
    </>
  );
}
