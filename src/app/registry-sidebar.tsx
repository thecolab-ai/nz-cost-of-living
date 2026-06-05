"use client";

import {
  Building2,
  FileText,
  Hammer,
  HeartHandshake,
  Home,
  Info,
  LineChart,
  MapPin,
  ShoppingBasket,
  SlidersHorizontal,
  Wallet,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const NAV_MAIN = [{ href: "/", label: "Home", icon: Home }];

// Grouped navigation — categorised by what each tool measures, ending with the
// "why / how" methodology pages.
const NAV_GROUPS: {
  label: string;
  items: { href: string; label: string; icon: typeof Home }[];
}[] = [
  {
    label: "Income & budget",
    items: [
      { href: "/budget", label: "Budget Builder", icon: Wallet },
      {
        href: "/simulator",
        label: "Indexation Simulator",
        icon: SlidersHorizontal,
      },
    ],
  },
  {
    label: "Cost of living",
    items: [
      { href: "/grocery", label: "Grocery Tracker", icon: LineChart },
      { href: "/basket", label: "Basket Tracker", icon: ShoppingBasket },
      { href: "/energy", label: "Energy & Power", icon: Zap },
      { href: "/housing", label: "Housing & Rent", icon: Building2 },
    ],
  },
  {
    label: "Where it lands",
    items: [{ href: "/map", label: "Deprivation Map", icon: MapPin }],
  },
  {
    label: "About & methodology",
    items: [
      { href: "/brief", label: "State of Play brief", icon: FileText },
      { href: "/why", label: 'Why "for good"', icon: HeartHandshake },
      { href: "/how-its-built", label: "How it's built", icon: Hammer },
      { href: "/about", label: "About & sources", icon: Info },
    ],
  },
];

function isActivePath(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function LogoMark() {
  return (
    <svg
      viewBox="0 0 32 32"
      className="size-6"
      role="img"
      aria-label="thecolab.ai logo"
    >
      <defs>
        <linearGradient id="colab-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E4057" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <circle cx="8" cy="16" r="5" fill="url(#colab-grad)" />
      <circle cx="24" cy="8" r="4" fill="url(#colab-grad)" />
      <circle cx="24" cy="24" r="4" fill="url(#colab-grad)" />
      <line
        x1="12"
        y1="14"
        x2="20"
        y2="9"
        stroke="url(#colab-grad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="18"
        x2="20"
        y2="23"
        stroke="url(#colab-grad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="24"
        y1="12"
        x2="24"
        y2="20"
        stroke="url(#colab-grad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RegistrySidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark />
            <span className="font-serif text-lg font-bold text-brand-navy">
              thecolab<span className="text-brand-cyan">.ai</span>
            </span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {NAV_MAIN.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActivePath(pathname, item.href)}
                >
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActivePath(pathname, item.href)}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
