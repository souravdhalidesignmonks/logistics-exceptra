/* The Exceptra mark, drawn bare and coloured with the warm palette */
export function ExceptraMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true" className={className}>
      <path d="M13.5 16.875H45L38.25 32.625H6.75Z" fill="var(--brand-soft)" />
      <path d="M33.75 39.375H65.25L58.5 55.125H27Z" fill="var(--brand-deep)" />
    </svg>
  )
}
