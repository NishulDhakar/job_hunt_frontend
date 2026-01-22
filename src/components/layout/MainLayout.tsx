import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function MainLayout() {
    const location = useLocation()
    const isChatPage = location.pathname === '/chat'

    return (
        <div className="h-screen flex flex-col bg-background font-sans antialiased text-foreground">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <aside className="hidden md:block w-64 border-r bg-background/50 backdrop-blur z-0">
                    <Sidebar className="h-full mt-2 border-r-0" />
                </aside>
                <main className={`flex-1 mt-2 bg-muted/10 ${isChatPage ? 'overflow-hidden p-0' : 'overflow-y-auto p-4 md:p-6'}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
