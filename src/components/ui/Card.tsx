import type { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  withLeftAccent?: boolean;
}

export default function Card({
  title,
  children,
  withLeftAccent = false,
}: CardProps) {
  const accentClassName = withLeftAccent
    ? "border-l-4 border-ekd-primary"
    : "";

  return (
    <section
      className={`rounded-2xl bg-ekd-surface p-6 shadow-sm shadow-ekd-text/5 ring-1 ring-ekd-border ${accentClassName}`}
    >
      <h2 className="mb-6 text-xl font-semibold text-ekd-text">
        {title}
      </h2>

      <div className="space-y-5">
        {children}
      </div>
    </section>
  );
}
