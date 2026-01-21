import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function MainLayout() {
    return (
        <div className="h-screen flex flex-col bg-background font-sans antialiased text-foreground">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <aside className="hidden md:block w-64 border-r bg-background/50 backdrop-blur z-0">
                    <Sidebar className="h-full border-r-0" />
                </aside>
                <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
