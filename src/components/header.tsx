'use client';
import Image from "next/image";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="flex flex-1 justify-between w-screen p-4 bg-[#2771CC]">
      <Image
        src="/CmpLogo.png"
        alt="Logo"
        width={100}
        height={50}
        className="object-contain cursor-pointer"
        priority
        onClick={toggleSidebar} 
      />
    </header>
  );
}