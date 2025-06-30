'use client';
import { CalendarRange, CalendarFold, FileText, SquareChartGantt, ChartPie, LogOut, UsersRound, Clipboard, History, UserCheck  } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from 'react';

interface SidebarProps {
  onNavClick?: () => void;
  userRole: string;
  handleLogout: () => void;
}

export function Sidebar({ onNavClick, userRole, handleLogout }: SidebarProps) {
  const pathname = usePathname();

  const [isDisabled, setIsDisabled] = useState(false); 


  const navItems = [
    {
      title: "Documentos",
      href: "/features/documents",
      displayHref: "/documents",
      icon: FileText,
      isActive: pathname === "/features/documents",
      admitedRoles: ["Admin", "Encargado Cumplimiento", "Jefe Relacionamiento VH", "Jefe Relacionamiento VC", "Jefe Relacionamiento VE"]
    },
    {
      title: "Compliance",
      href: "/features/compliance",
      displayHref: "/compliance",
      icon: Clipboard,
      isActive: pathname === "/features/compliance",
      admitedRoles: ["Admin","Encargado Cumplimiento"]
    },    
    {
      title: "Historial",
      href: "/features/history",
      displayHref: "/history",
      icon: History,
      isActive: pathname === "/features/history",
      admitedRoles: ["Admin","Encargado Cumplimiento", "Superintendente Relacionamiento", "Superintendente Comunicaciones", "Gerente"]
    },
    {
      title: "Planificación",
      href: "/features/planification",
      displayHref: "/planification",
      icon: SquareChartGantt,
      isActive: pathname === "/features/planification",
      admitedRoles: ["Admin", "Encargado Cumplimiento","Encargado Comunicaciones", "Superintendente Relacionamiento", "Superintendente Comunicaciones", "Jefe Relacionamiento VH", "Jefe Relacionamiento VC", "Jefe Relacionamiento VE"]
    },
    {
      title: "Beneficiarios",
      href: "/features/beneficiaries",
      displayHref: "/beneficiaries",
      icon: UsersRound,
      isActive: pathname === "/features/beneficiaries",
      admitedRoles: ["Admin", "Encargado Cumplimiento","Jefe Relacionamiento VH", "Jefe Relacionamiento VC", "Jefe Relacionamiento VE", "Encargado Comunicaciones"]
    },
    {
      title: "Programación",
      href: "/features/reportability",
      displayHref: "/reportability",
      icon: CalendarFold,
      isActive: pathname === "/features/reportability",
      admitedRoles: ["Admin","Gerente", "Superintendente Relacionamiento", "Superintendente Comunicaciones", "Encargado Cumplimiento","Jefe Relacionamiento VH", "Jefe Relacionamiento VC", "Jefe Relacionamiento VE", "Encargado Comunicaciones"]
    },
    {
      title: "Plan de trabajo",
      href: "/features/schedule",
      displayHref: "/schedule",
      icon: CalendarRange,
      isActive: pathname === "/features/schedule",
      admitedRoles: ["Admin","Jefe Relacionamiento VH", "Jefe Relacionamiento VC", "Jefe Relacionamiento VE"]
    },
    {
      title: "Resumen",
      href: "/features/resume",
      displayHref: "/resume",
      icon: ChartPie,
      isActive: pathname === "/features/resume",
      admitedRoles: ["Admin","Gerente", "Superintendente Relacionamiento", "Superintendente Comunicaciones", "Encargado Cumplimiento"]
    },
    {
      title: "Usuarios",
      href: "/features/users",
      displayHref: "/users",
      icon: UserCheck,
      isActive: pathname === "/features/users",
      admitedRoles: ["Admin"]
    },
  ];

  const filteredNavItems = navItems.filter(item => item.admitedRoles.includes(userRole));

  return (
    <div className="flex flex-col gap-2 p-4 h-full min-h-screen font-[Helvetica] bg-white border-r">
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
          onClick={() => handleLogout()}
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