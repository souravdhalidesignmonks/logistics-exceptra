import { HugeiconsIcon } from "@hugeicons/react"
import { ExceptraMark } from "@/components/exceptra-mark"
import { InboxIcon, Activity01Icon, Clock01Icon, AiLearningIcon, Analytics01Icon, Settings05Icon, ShipIcon, TruckIcon } from "@hugeicons/core-free-icons"


export const workspaceData = {
  user: {
    name: "Sourav Dhali",
    email: "coordinator@exceptra.app",
    avatar: "",
  },
  teams: [
    {
      name: "Exceptra Control",
      logo: (
        <ExceptraMark className="size-5" />
      ),
      plan: "Operations workspace",
    },
    {
      name: "North America",
      logo: (
        <HugeiconsIcon icon={ShipIcon} strokeWidth={2} />
      ),
      plan: "Regional workspace",
    },
    {
      name: "Europe",
      logo: (
        <HugeiconsIcon icon={TruckIcon} strokeWidth={2} />
      ),
      plan: "Regional workspace",
    },
  ],
  navMain: [
    {
      title: "Exception inbox",
      url: "#inbox",
      icon: (
        <HugeiconsIcon icon={InboxIcon} strokeWidth={2} />
      ),
      isActive: true,
    },
    {
      title: "Live monitoring",
      url: "#live-monitoring",
      icon: (
        <HugeiconsIcon icon={Activity01Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Decision history",
      url: "#decision-history",
      icon: (
        <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Learning review",
      url: "#learning-review",
      icon: (
        <HugeiconsIcon icon={AiLearningIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Reports",
      url: "#reports",
      icon: (
        <HugeiconsIcon icon={Analytics01Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Settings",
      url: "#settings",
      icon: (
        <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />
      ),
    },
  ],
}
