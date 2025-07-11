'use client';
import Image from "next/image";
import { Menu, Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NotificationsMenu } from "./NotificationsMenu";
import { useNotifications } from "@/app/features/notifications/hooks/useNotifications";

interface DynamicBannerProps {
  toggleSidebar: () => void;
  isOpen: boolean;
  userName?: string;
  userRole?: string;
}

export function DynamicBanner({ toggleSidebar, isOpen, userName, userRole }: DynamicBannerProps) {
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
      setCurrentIndex((prev: number) => (prev + 1) % bookImages.length);
    }, 4000); // Cambia cada 4 segundos
    return () => clearInterval(interval);
  }, [bookImages.length]);

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
      {/* Zona superior - Imágenes + UI */}
      <div className="relative h-[125px] w-full overflow-hidden">
        {/* Imágenes rotativas de fondo */}
        {bookImages.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={img}
              alt={`CMP Operations ${index + 1}`}
              fill
              className="object-cover object-center"
              priority={index === 0}
              quality={85}
            />
          </div>
        ))}
        
        {/* Overlay para mejorar legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
        
        {/* Contenido del header */}
        <div className="relative z-10 flex justify-between items-center h-full px-4">
          {/* Lado izquierdo - Menú hamburguesa */}
          <div className="flex items-center">
            <Menu
              size={40}
              className={`text-white cursor-pointer transition-transform duration-200 hover:scale-110 drop-shadow-lg ${
                isOpen ? 'rotate-90' : ''
              }`}
              onClick={toggleSidebar}
            />
          </div>
          
          {/* Lado derecho - Recuadro azul con esquina redondeada */}
          <div 
            className="flex items-center gap-4 px-6 py-3 backdrop-blur-sm"
            style={{
              backgroundColor: '#0068d0',
              borderTopLeftRadius: '1rem', // Esquina superior izquierda redondeada
              borderBottomLeftRadius: '0.25rem',
              borderTopRightRadius: '0.25rem',
              borderBottomRightRadius: '0.25rem'
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
                <span className="text-white font-semibold text-base leading-tight">
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
        
        {/* Indicadores de imagen (opcional) */}
        <div className="absolute bottom-2 left-4 z-10 flex space-x-1">
          {bookImages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
      
      {/* Barra inferior decorativa */}
      <div className="flex w-full h-[8px]">
        {/* Sección izquierda */}
        <div 
          className="flex-1"
          style={{ backgroundColor: '#0079b7' }}
        />
        {/* Sección centro */}
        <div 
          className="flex-1"
          style={{ backgroundColor: '#0065a8' }}
        />
        {/* Sección derecha */}
        <div 
          className="flex-1"
          style={{ backgroundColor: '#004793' }}
        />
      </div>
    </div>
  );
} 