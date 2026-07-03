import type { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-6 text-xl font-semibold text-slate-800">
        {title}
      </h2>

      <div className="space-y-5">
        {children}
      </div>
    </section>
  );
}