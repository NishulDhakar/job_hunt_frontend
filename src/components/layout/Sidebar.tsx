import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Briefcase, Star, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Sidebar({ className }: { className?: string }) {
    const location = useLocation()

    const links = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/jobs', label: 'Job Feed', icon: Briefcase },
        { href: '/matches', label: 'Best Matches', icon: Star },
        { href: '/applications', label: 'Applications', icon: Briefcase },
        { href: '/chat', label: 'AI Assistant', icon: MessageSquare },
    ]

    return (
        <div className={cn("pb-12 min-h-screen border-r bg-background", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-bold tracking-tight">
                        Discover
                    </h2>
                    <div className="space-y-1">
                        {links.map((link) => (
                            <Link to={link.href} key={link.href}>
                                <Button variant={location.pathname === link.href ? "secondary" : "ghost"} className="w-full justify-start">
                                    <link.icon className="mr-2 h-4 w-4" />
                                    {link.label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
