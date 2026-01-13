"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Users, BookOpen, Building2, Home, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Emploi du temps", href: "/timetable", icon: Calendar },
  { name: "Enseignants", href: "/teachers", icon: Users },
  { name: "Cours", href: "/courses", icon: BookOpen },
  { name: "Salles", href: "/rooms", icon: Building2 },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-8">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">Université de Yaoundé I</span>
            <span className="text-xs text-muted-foreground">Gestion Emploi du Temps</span>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
