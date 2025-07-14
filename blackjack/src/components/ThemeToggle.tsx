"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { MoonIcon, SunIcon } from "lucide-react"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState(typeof window !== "undefined" ? localStorage.getItem("theme") : "light")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark")
        localStorage.setItem("theme", "dark")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("theme", "light")
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return null
  }

  return (
    <label className="inline-flex items-center space-x-2 cursor-pointer">
      <SunIcon className="h-4 w-4 text-yellow-500" />
      <Switch id="theme-switch" checked={theme === "dark"} onCheckedChange={toggleTheme} />
      <MoonIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    </label>
  )
}
