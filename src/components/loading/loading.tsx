"use client";

type LoadingProps = {
  label?: string;
  fullScreen?: boolean;
};

export function Loading({
  label = "Carregando...",
  fullScreen = false,
}: LoadingProps) {
  const Wrapper = fullScreen ? "div" : "span";

  return (
    <Wrapper
      className={
        fullScreen
          ? "flex min-h-dvh items-center justify-center"
          : "inline-flex items-center gap-2"
      }
    >
      <span
        className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900"
        aria-label={label}
        role="status"
      />
      {!fullScreen && <span className="text-sm text-zinc-600">{label}</span>}
    </Wrapper>
  );
}
