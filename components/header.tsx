"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Users, BookOpen, Building2, Home, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

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
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 mr-8">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">Université de Yaoundé I</span>
            <span className="text-xs text-muted-foreground">Gestion Emploi du Temps</span>
          </div>
        </Link>
        <nav className="flex items-center gap-1" aria-label="Principale">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {typeof window !== 'undefined' && (
            <AuthStatus />
          )}
        </div>
      </div>
    </header>
  )
}

function AuthStatus() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const raw = localStorage.getItem('user')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">Connexion</Link>
        <Link href="/auth/register" className="text-sm text-primary">Inscription</Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm">Bonjour, <span className="font-medium">{user.username}</span></div>
      <Link href="/" onClick={() => { localStorage.removeItem('user') }} className="text-sm text-destructive">Déconnexion</Link>
    </div>
  )
}
