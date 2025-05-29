'use client';
import { CalendarRange, CalendarFold, FileText, SquareChartGantt, ChartPie, LogOut, UsersRound  } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from 'react';

interface SidebarProps {
  onNavClick?: () => void;
  userRole: string;
}

export function Sidebar({ onNavClick, userRole }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isDisabled, setIsDisabled] = useState(false); 


  const navItems = [
    {
      title: "Documentos",
      href: "/features/documents",
      displayHref: "/documents",
      icon: FileText,
      isActive: pathname === "/features/documents",
      admitedRoles: ["gerente", "superintendente", "encargado valle elqui", "encargado copiapó", "encargado huasco", "encargado cumplimiento","Admin"]
    },
    {
      title: "Planificación",
      href: "/features/planification",
      displayHref: "/planification",
      icon: SquareChartGantt,
      isActive: pathname === "/features/planification",
      admitedRoles: ["encargado valle elqui", "encargado copiapó", "encargado huasco", "encargado cumplimiento","encargado comunicaciones","Admin"]
    },
    {
      title: "Beneficiarios",
      href: "/features/beneficiaries",
      displayHref: "/beneficiaries",
      icon: UsersRound,
      isActive: pathname === "/features/beneficiaries",
      admitedRoles: ["encargado valle elqui", "encargado copiapó", "encargado huasco", "encargado cumplimiento","Admin"]
    },
    {
      title: "Programación",
      href: "/features/reportability",
      displayHref: "/reportability",
      icon: CalendarFold,
      isActive: pathname === "/features/reportability",
      admitedRoles: ["gerente", "superintendente", "encargado cumplimiento","Admin", "encargado comunicaciones"]
    },
    {
      title: "Plan de trabajo",
      href: "/features/schedule",
      displayHref: "/schedule",
      icon: CalendarRange,
      isActive: pathname === "/features/schedule",
      admitedRoles: ["encargado valle elqui", "encargado copiapó", "encargado huasco"]
    },
    {
      title: "Resumen",
      href: "/features/resume",
      displayHref: "/resume",
      icon: ChartPie,
      isActive: pathname === "/features/resume",
      admitedRoles: ["gerente", "superintendente", "encargado cumplimiento","Admin"]
    },
  ];

  const filteredNavItems = navItems.filter(item => item.admitedRoles.includes(userRole));

  return (
    <div className="flex flex-col gap-2 p-4 h-full min-h-screen">
      <div className="flex flex-1 flex-col items gap-5 relative">
        {filteredNavItems.map((item) => (
          <Button
            key={item.title}
            asChild
            variant={item.isActive ? "secondary" : "ghost"}
            size="sm"
            className="justify-start"
            onClick={() => {
              setIsDisabled(true); 
              if (onNavClick) onNavClick();
            }}
            disabled={isDisabled} 
            data-test-id={`sidebar-${item.title.toLowerCase()}`}
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
          onClick={() => {
            setIsDisabled(true); 
            router.push('/');
          }}
          disabled={isDisabled} 
          data-test-id="sidebar-logout"
        >
          <LogOut className="mr-2 h-6 w-6" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}