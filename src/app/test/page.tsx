"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/theme-toggle"

export default function TestPage() {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center gap-8 bg-background text-foreground">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <h1 className="text-4xl font-bold text-center">Tailwind & shadcn/ui Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Tailwind Styles</CardTitle>
            <CardDescription>Testing Tailwind CSS utility classes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-500 text-white rounded-lg">
              Blue background with white text
            </div>
            <div className="p-4 bg-green-500 text-white rounded-lg">
              Green background with white text
            </div>
            <div className="p-4 bg-purple-500 text-white rounded-lg">
              Purple background with white text
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square bg-red-500 rounded-md"></div>
              <div className="aspect-square bg-yellow-500 rounded-md"></div>
              <div className="aspect-square bg-indigo-500 rounded-md"></div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              These colors use Tailwind's default color palette
            </p>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>shadcn/ui Components</CardTitle>
            <CardDescription>Testing shadcn/ui components with theme support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <span>Toggle Switch</span>
              <Switch 
                checked={isChecked} 
                onCheckedChange={setIsChecked} 
              />
            </div>
            <div>
              <p className="mb-2">Switch is {isChecked ? 'ON' : 'OFF'}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button>Default Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="destructive">Destructive Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              These components adapt to light/dark mode
            </p>
          </CardFooter>
        </Card>
      </div>
      
      <div className="text-center mt-8">
        <p className="text-muted-foreground">
          Try toggling the theme using the button in the top-right corner
        </p>
      </div>
    </div>
  )
}
