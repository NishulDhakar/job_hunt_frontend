import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Navbar() {
    return (
        <div className="border-b h-16 flex items-center px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 w-full justify-between">
            <div className="flex items-center font-bold text-xl">
                <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">

                    <span className='font-serif'>AI Job Tracker</span>
                </Link>
            </div>
            <div className="flex items-center gap-3">
                <Link to="/profile">
                    <Button variant="outline" size="sm" className="gap-2">
                        <User className="h-4 w-4" />
                        Profile
                    </Button>
                </Link>
            </div>
        </div>
    )
}
