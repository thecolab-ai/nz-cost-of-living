export default function Home() {
  return (
    <main className="relative flex-1 overflow-hidden p-6 md:p-10">
      {/* signature gradient blobs */}
      <div className="pointer-events-none absolute top-[-10%] left-[15%] size-[400px] rounded-full bg-brand-indigo/10 blur-3xl" />
      <div className="pointer-events-none absolute top-[-10%] right-[15%] size-[400px] rounded-full bg-brand-cyan/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center text-center">
        <span className="mb-4 inline-flex items-center rounded-full border border-brand-cyan/30 bg-brand-white/60 px-3 py-1 font-mono text-xs text-brand-cyan-dark">
          AI expertise, built together
        </span>
        <h1 className="font-serif text-5xl font-bold tracking-tight text-brand-navy md:text-6xl">
          Template{" "}
          <span className="bg-gradient-to-r from-brand-indigo to-brand-cyan bg-clip-text text-transparent">
            Hello World
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-brand-slate-muted">
          A starter template by thecolab.ai — New Zealand's community-driven AI
          consultancy. Build something that actually ships.
        </p>
      </div>
    </main>
  );
}
