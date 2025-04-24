'use client';
import { CalendarRange, CalendarFold, FileText, SquareChartGantt, ChartPie, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface SidebarProps {
  onNavClick?: () => void;
}

export function Sidebar({ onNavClick }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter(); 

  const navItems = [
    {
      title: "Documentos",
      href: "/features/documents",
      displayHref: "/documents",
      icon: FileText,
      isActive: pathname === "/features/documents",
    },
    {
      title: "Planificación",
      href: "/features/planification",
      displayHref: "/planification",
      icon: SquareChartGantt,
      isActive: pathname === "/features/planification",
    },
    {
      title: "Reportabilidad",
      href: "/features/reportability",
      displayHref: "/reportability",
      icon: CalendarFold,
      isActive: pathname === "/features/reportability",
    },
    {
      title: "Programación",
      href: "/features/schedule",
      displayHref: "/schedule",
      icon: CalendarRange,
      isActive: pathname === "/features/schedule",
    },
    {
      title: "Resumen",
      href: "/features/resume",
      displayHref: "/resume",
      icon: ChartPie,
      isActive: pathname === "/features/resume",
    },
  ];

  return (
    <div className="flex flex-col gap-2 p-4 h-full min-h-screen">
      <div className="flex flex-1 flex-col items gap-5 relative">
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

        <Button
          variant="ghost"
          size="sm"
          className="justify-start cursor-pointer"
          onClick={() => router.push('/')} 
        >
          <LogOut className="mr-2 h-6 w-6" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
