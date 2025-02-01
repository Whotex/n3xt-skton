"use client";

import Link from "next/link";
import { HomeIcon, ClipboardDocumentCheckIcon, TrophyIcon } from "@heroicons/react/24/outline";

const navItems = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/tasks", label: "Tasks", Icon: ClipboardDocumentCheckIcon },
  { href: "/ranking", label: "Ranking", Icon: TrophyIcon },
];

export default function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 p-3">
      <ul className="flex justify-around items-center">
        {navItems.map(({ href, label, Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex flex-col items-center justify-center text-xs sm:text-sm p-2 rounded-lg bg-gray-700 hover:bg-yellow-500 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="mt-1">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}