"use client";

import Link from "next/link";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Home", src: "/home.svg" },
  { href: "/tasks", label: "Tasks", src: "/tasks.png" },
  { href: "/ranking", label: "Ranking", src: "/ranking.png" },
];

export default function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 p-3">
      <ul className="flex justify-around items-center">
        {navItems.map(({ href, label, src }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex flex-col items-center justify-center text-xs sm:text-sm p-2 rounded-lg bg-gray-700 hover:bg-yellow-500 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
            >
              <Image
                src={src}
                alt={label}
                width={24}
                height={24}
                className="object-contain"
              />
              <span className="mt-1">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
