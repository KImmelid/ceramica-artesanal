"use client";

type LoaderProps = {
  label?: string;
};

export default function Loader({ label }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#C4623E]" />
      {label ? <p className="text-sm text-muted-foreground">{label}</p> : null}
    </div>
  );
}
