interface FormCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function FormCard({ title, description, children }: FormCardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
      {(title || description) && (
        <header>
          {title && (
            <h2 className="text-base font-semibold tracking-tight text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-xs text-slate-400">{description}</p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
