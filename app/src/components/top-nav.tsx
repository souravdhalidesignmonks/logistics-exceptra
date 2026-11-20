import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BellIcon,
  CheckmarkBadgeIcon,
  CreditCardIcon,
  LogoutIcon,
  NotificationIcon,
  PlusSignIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"

import { ExceptraMark } from "@/components/exceptra-mark"
import { workspaceData } from "@/components/workspace-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "cn"


/* The same hash routing the sidebar used: the active section is whatever the hash says. */
function useActiveHash() {
  const [activeHash, setActiveHash] = React.useState(window.location.hash || "#inbox")
  React.useEffect(() => {
    const handleHashChange = () => setActiveHash(window.location.hash || "#inbox")
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])
  return activeHash
}

function TeamMenu() {
  const { teams } = workspaceData
  const [activeTeam, setActiveTeam] = React.useState(teams[0])
  if (!activeTeam) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group flex shrink-0 items-center gap-2.5 justify-self-start rounded-full bg-foreground/[0.04] py-1 pr-4 pl-2 outline-none transition-colors hover:bg-foreground/[0.07] focus-visible:ring-3 focus-visible:ring-ring/30"
          aria-label={`Workspace: ${activeTeam.name}`}
        >
          <ExceptraMark className="size-8" />
          <span className="text-left leading-tight">
            <span className="block text-lg font-[450] tracking-tight">Exceptra</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start" sideOffset={8}>
        <DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
        {teams.map((team, index) => (
          <DropdownMenuItem key={team.name} onClick={() => setActiveTeam(team)} className="gap-2 p-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-background [&_img]:size-6">
              {team.logo}
            </div>
            <div className="grid leading-tight">
              <span>{team.name}</span>
              <span className="text-xs text-muted-foreground">{team.plan}</span>
            </div>
            <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 p-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-background">
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-4" />
          </div>
          <div className="text-muted-foreground">Add team</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* One element per section that morphs between states, so switching sections animates:
   the active item widens from a white circle into the dark pill as its label opens,
   while the previous one closes back into a circle. */
function SectionNav() {
  const activeHash = useActiveHash()
  return (
    <nav aria-label="Operations" className="-mx-1 flex min-w-0 items-center gap-1.5 overflow-x-auto px-1 py-1 [scrollbar-width:none]">
      {workspaceData.navMain.map((item) => {
        const active = activeHash === item.url
        return (
          <Tooltip key={item.title} open={active ? false : undefined}>
            <TooltipTrigger asChild>
              <a
                href={item.url}
                aria-label={item.title}
                aria-current={active ? "page" : undefined}
                data-active={active || undefined}
                className="nav-morph group/nav flex h-10 shrink-0 items-center rounded-full text-sm focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none [&_svg]:size-[1.1rem]"
              >
                <span className="nav-morph-icon flex size-4.5 shrink-0 items-center justify-center">{item.icon}</span>
                <span className="nav-morph-label grid">
                  <span className="overflow-hidden whitespace-nowrap">{item.title}</span>
                </span>
              </a>
            </TooltipTrigger>
            <TooltipContent side="bottom">{item.title}</TooltipContent>
          </Tooltip>
        )
      })}
    </nav>
  )
}

function NotificationsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative size-10" aria-label="Notifications">
          <HugeiconsIcon icon={BellIcon} className="size-[1.15rem]" strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72" sideOffset={8}>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <div className="px-2 py-6 text-center">
          <p className="text-sm font-medium">No new notifications</p>
          <p className="mt-1 text-xs text-muted-foreground">You’re all caught up.</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function UserMenu() {
  const { user } = workspaceData
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Account: ${user.name}`}
          className="shrink-0 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          <Avatar className="size-10 shadow-float after:hidden">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary text-[0.8rem] tracking-wide text-primary-foreground">SD</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-xs tracking-wide text-primary-foreground">SD</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HugeiconsIcon icon={CheckmarkBadgeIcon} strokeWidth={2} />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={NotificationIcon} strokeWidth={2} />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function TopNav({ className }: { className?: string }) {
  return (
    <header className={cn("sticky top-0 z-20 bg-canvas/85 backdrop-blur-md supports-[backdrop-filter]:bg-canvas/70", className)}>
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:py-4">
        <TeamMenu />
        <div className="order-last w-full min-w-0 lg:order-none lg:w-auto lg:justify-self-center">
          <SectionNav />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2 lg:justify-self-end">
          <NotificationsMenu />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
