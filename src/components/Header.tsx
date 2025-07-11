'use client';
import Image from "next/image";
import { Menu, Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NotificationsMenu } from "./NotificationsMenu";
import { useNotifications } from "@/app/features/notifications/hooks/useNotifications";

interface HeaderProps {
  toggleSidebar: () => void;
  isOpen: boolean;
  userName?: string;
  userRole?: string;
}

export function Header({ toggleSidebar, isOpen, userName, userRole }: HeaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { unreadCount } = useNotifications();

  // Imágenes del book disponibles
  const bookImages = [
    '/Book (1).jpg',
    '/Book (2).jpg', 
    '/Book (3).jpg',
    '/Book (4).jpg',
    '/Book (5).jpg',
    '/Book (6).jpg',
    '/Book (7).jpg',
    '/Book (1).JPEG'
  ];

  // Rotación automática de imágenes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev: number) => (prev + 1) % 4); // Solo cicla entre las primeras 4 imágenes
    }, 30000); // Cambia cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  // Click fuera para cerrar notificaciones
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
    <div className="relative w-full">
      {/* Banner principal con estructura de secciones */}
      <div className="relative h-[125px] w-full overflow-hidden flex">
        
        {/* Sección 1: Foto izquierda */}
        <div className="relative flex-1">
          <Image
            src={bookImages[currentIndex]}
            alt="CMP Operations Left"
            fill
            className="object-cover object-center"
            priority
            quality={85}
          />
          {/* Menú hamburguesa superpuesto con fondo azul */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
            <div 
              className="p-[5px] rounded-lg"
              style={{ backgroundColor: '#0068D1' }}
            >
              <Menu
                size={40}
                className={`text-white cursor-pointer transition-transform duration-200 hover:scale-110 ${
                  isOpen ? 'rotate-90' : ''
                }`}
                onClick={toggleSidebar}
              />
            </div>
          </div>
        </div>
        
        {/* Sección 2: Cuadro azul con texto motivacional */}
        <div 
          className="flex-1 flex items-center justify-center px-8 py-4 rounded-tl-lg rounded-br-lg"
          style={{ backgroundColor: '#0068d0' }}
        >
          <div className="text-center">
            <h2 className="text-white text-lg md:text-xl font-bold leading-tight">
              Desde el corazón de nuestros procesos<br />
              creamos una minería diferente,<br />
              para el desarrollo sostenible<br />
              del territorio y de su gente
            </h2>
          </div>
        </div>
        
        {/* Sección 3: Foto centro-derecha */}
        <div className="relative flex-1">
          <Image
            src={bookImages[currentIndex + 4]} // Imágenes 5-8 (índices 4-7)
            alt="CMP Operations Center"
            fill
            className="object-cover object-center"
            quality={85}
          />
        </div>
        
        {/* Sección 4: Cuadro azul derecha con logo y UI */}
        <div 
          className="flex-1 flex items-center gap-3 px-4 py-3"
          style={{
            backgroundColor: '#0068d0',
            borderTopLeftRadius: '1rem'
          }}
        >
          {/* Notificaciones */}
          <div className="relative" ref={notificationRef}>
            <div className="relative">
              <Bell 
                className="text-white cursor-pointer hover:animate-bounce transition-transform duration-200"
                size={24}
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
          
          {/* Usuario y rol */}
          {userName && (
            <div className="flex flex-col items-end">
              <span className="text-white font-semibold text-sm leading-tight">
                {userName}
              </span>
              {userRole && (
                <span className="text-white text-xs leading-tight opacity-90">
                  {userRole}
                </span>
              )}
            </div>
          )}
          
          {/* Logo */}
          <Image
            src="/CmpLogo.png"
            alt="Logo CMP"
            width={120}
            height={40}
            className="object-contain"
            priority
          />
        </div>
      </div>
      
      {/* Barra inferior decorativa */}
      <div className="flex w-full h-[8px]">
        <div className="flex-1" style={{ backgroundColor: '#0079b7' }} />
        <div className="flex-1" style={{ backgroundColor: '#0065a8' }} />
        <div className="flex-1" style={{ backgroundColor: '#004793' }} />
      </div>
    </div>
  );
}