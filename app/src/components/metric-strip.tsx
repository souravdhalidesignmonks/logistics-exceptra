import type { PointerEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertDiamondIcon,
  InboxIcon,
  MoneyBag02Icon,
  Timer02Icon,
} from "@hugeicons/core-free-icons";

type MetricCase = { status?: string };

/* A soft light that follows the pointer across a card: design only, no data. */
const followPointer = (event: PointerEvent<HTMLDivElement>) => {
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--spot-x", `${event.clientX - box.left}px`);
  event.currentTarget.style.setProperty("--spot-y", `${event.clientY - box.top}px`);
};

/* The same four KPIs as before, as cards: a quiet label and icon, a large light figure, and the context chip. */
export function MetricStrip({ cases }: { cases: MetricCase[] }) {
  const activeCases = cases.filter((item) => item.status !== "closed");
  const metrics = [
    {
      label: "Open exceptions",
      value: activeCases.length.toString(),
      detail: "Across active shipments",
      icon: InboxIcon,
    },
    {
      label: "Critical",
      value: "1",
      detail: "Needs attention",
      icon: AlertDiamondIcon,
      accent: true,
    },
    {
      label: "At-risk value",
      value: "$184k",
      detail: "Across 4 shipments",
      icon: MoneyBag02Icon,
    },
    {
      label: "Median response",
      value: "8m",
      detail: "18% faster this week",
      icon: Timer02Icon,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          onPointerMove={followPointer}
          className={`kpi-card group relative isolate flex min-w-0 flex-col justify-between overflow-hidden rounded-[1.75rem] p-4 sm:p-6 ${
            metric.accent ? "hatch-light bg-brand-deep text-white" : "bg-card"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <p className={`text-sm ${metric.accent ? "text-white/80" : "text-muted-foreground"}`}>{metric.label}</p>
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                metric.accent
                  ? "bg-white/15 text-white"
                  : "bg-popover text-foreground/70 shadow-float"
              }`}
              aria-hidden="true"
            >
              <HugeiconsIcon icon={metric.icon} className="size-[1.05rem]" strokeWidth={1.8} />
            </span>
          </div>
          <div className="mt-8 sm:mt-10">
            <p className="text-[2.5rem] leading-none font-light tracking-[-0.04em] tabular-nums sm:text-[3.25rem]">
              {metric.value}
            </p>
            <span
              className={`mt-3 inline-flex h-6 max-w-full items-center truncate rounded-full px-2.5 text-xs ${
                metric.accent
                  ? "bg-white/15 text-white"
                  : "bg-popover text-foreground/75 shadow-float"
              }`}
            >
              {metric.detail}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
