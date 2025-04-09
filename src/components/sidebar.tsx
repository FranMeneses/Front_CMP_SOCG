'use client'
import { CalendarRange , CalendarFold, FileText , SquareChartGantt , ChartPie } from 'lucide-react' 
import Link from 'next/link'

import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"


import { usePathname } from "next/navigation";

interface SidebarProps {
    onNavClick?: () => void
}


export function Sidebar({ onNavClick }: SidebarProps) {
  const pathname = usePathname(); 

  const navItems = [
    {
      title: "Documentos",
      href: "/documents",
      icon: FileText,
      isActive: pathname === "/documents",
    },
    {
      title: "Planificación",
      href: "/planification",
      icon: SquareChartGantt,
      isActive: pathname === "/planification",
    },
    {
      title: "Reportabilidad",
      href: "/reportability",
      icon: CalendarFold,
      isActive: pathname === "/reportability",
    },
    {
      title: "Programación",
      href: "/gantt",
      icon: CalendarRange,
      isActive: pathname === "/gantt",
    },
    {
      title: "Resumen",
      href: "/",
      icon: ChartPie,
      isActive: pathname === "/",
    },
  ];

  return (
    <div className="flex flex-col gap-2 p-4 h-full min-h-screen">
      <div className="flex flex-1 flex-col items gap-5">
        {navItems.map((item) => (
          <Button
            key={item.title}
            asChild
            variant={item.isActive ? "secondary" : "ghost"}
            size="sm"
            className="justify-start"
            onClick={onNavClick}
          >
            <Link href={item.href}>
              <item.icon className={cn("mr-2 h-6 w-6", item.isActive && "text-primary")} />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}