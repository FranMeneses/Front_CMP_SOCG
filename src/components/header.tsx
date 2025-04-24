'use client';
import Image from "next/image";
import { Menu } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
  isOpen: boolean;
}

export function Header({ toggleSidebar, isOpen }: HeaderProps) {
  return (
    <header className="flex flex-1 justify-between h-20 w-screen p-4 bg-[#2771CC]">
      <div className="flex items-center gap-4">
        <Menu
          className={`text-white cursor-pointer transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          onClick={toggleSidebar}
        />
      </div>
      <Image
        src="/CmpLogo.png"
        alt="Logo"
        width={100}
        height={50}
        className="object-contain cursor-pointer"
        priority
      />
    </header>
  );
}