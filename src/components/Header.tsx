'use client';
import Image from "next/image";
import { Menu } from "lucide-react";
import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NotificationsMenu } from "./NotificationsMenu";

interface HeaderProps {
  toggleSidebar: () => void;
  isOpen: boolean;
}

export function Header({ toggleSidebar, isOpen }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex flex-1 justify-between h-20 w-screen p-4 bg-gradient-to-r from-[#2771CC] to-[#041e3e] animate-darken">
      <div className="flex items-center gap-4">
        <Menu
          className={`text-white cursor-pointer transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          onClick={toggleSidebar}
        />
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex items-center mr-4 relative" ref={notificationRef}>
          <Bell 
            className="text-white cursor-pointer hover:animate-bounce hover:cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          />
          {showNotifications && <NotificationsMenu />}
        </div>
        <Image
          src="/CmpLogo.png"
          alt="Logo"
          width={100}
          height={50}
          className="object-contain"
          priority
        />
      </div>
    </header>
  );
}