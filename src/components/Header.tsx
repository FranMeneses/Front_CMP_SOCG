'use client';
import Image from "next/image";
import { Menu } from "lucide-react";
import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NotificationsMenu } from "./NotificationsMenu";
import { useNotifications } from "@/app/features/notifications/hooks/useNotifications";

interface HeaderProps {
  toggleSidebar: () => void;
  isOpen: boolean;
}

export function Header({ toggleSidebar, isOpen }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { unreadCount } = useNotifications();

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
    <header className="flex justify-between items-center h-[125px] w-full px-4 bg-[#0068D1] flex-shrink-0">
      <div className="flex items-center gap-4">
        <Menu
          size={40}
          className={`text-white cursor-pointer transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          onClick={toggleSidebar}
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative" ref={notificationRef}>
          <div className="relative">
            <Bell 
              className="text-white cursor-pointer hover:animate-bounce transition-transform duration-200"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          {showNotifications && <NotificationsMenu />}
        </div>
        <Image
          src="/CmpLogo.png"
          alt="Logo"
          width={120}
          height={40}
          className="object-contain"
          priority
        />
      </div>
    </header>
  );
}