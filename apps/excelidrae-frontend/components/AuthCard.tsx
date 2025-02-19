export function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg w-96 text-center border border-white/20">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="mt-6 flex flex-col gap-4">{children}</div>
      </div>
    );
  }
  