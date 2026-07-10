import type { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <section className="rounded-2xl bg-ekd-surface p-6 shadow-sm shadow-ekd-text/5 ring-1 ring-ekd-border">
      <h2 className="mb-6 text-xl font-semibold text-ekd-text">
        {title}
      </h2>

      <div className="space-y-5">
        {children}
      </div>
    </section>
  );
}
