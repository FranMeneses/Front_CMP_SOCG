'use client'
import Image from "next/image"

export function Header() {
    return (
        <header className="flex flex-1 justify-between w-screen p-4 bg-[#2771CC]">
            <Image
                src="/LogoCMP.png"
                alt="Logo"
                width={100}
                height={50}
                className="object-contain"
                priority
            />
        </header>
    )
}