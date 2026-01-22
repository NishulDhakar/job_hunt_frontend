import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom" // if you use react-router

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0">
        <img
          src="/background.png"
          alt="Landing background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>
      <div className="relative z-10 h-full flex flex-col text-white">

        <header className="w-full px-10 py-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">

            <Link to="/" className="text-2xl font-serif tracking-tight">
              Job Hunting
            </Link>


            <Link
              to="/dashboard"
              className="hidden md:inline-flex px-5 py-2.5 text-sm
              text-white bg-white/10 backdrop-blur-md border border-white/30 rounded-full
              hover:bg-white/20 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              Start Creating
            </Link>


            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>


          {mobileMenuOpen && (
            <div className="md:hidden mt-4 px-4">
              <div className="rounded-2xl bg-black/70 backdrop-blur-lg p-5 space-y-4 text-sm">
                {["Home", "Product", "About", "Blog", "Contact"].map((item) => (
                  <Link
                    key={item}
                    to="/"
                    className="block text-white/90 hover:text-white"
                  >
                    {item}
                  </Link>
                ))}
                <Link
                  to="/dashboard"
                  className="inline-flex px-4 py-2 mt-2 text-white bg-white/10 border border-white/30 rounded-full"
                >
                  Start Tracking
                </Link>
              </div>
            </div>
          )}
        </header>


        <main className="flex-1 flex justify-center mt-16 lg:mt-20">
          <div className="text-center max-w-4xl space-y-8">
            <h1
              className="text-3xl lg:text-7xl tracking-tight font-serif
              drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]"
            >
              Your job search, but finally organized.
            </h1>

            <p className="text-[12px] p-2 lg:text-[20px] text-zinc-400">
              A focused workspace to track applications, follow-ups, interviews,
              and wins. Built for developers, designers, and dreamers who take
              their careers seriously.
            </p>

            <div>
              <Link
                to="/jobs"
                className="inline-flex items-center lg:px-8 px-4 lg:py-4 py-2 text-lg
                bg-white/10 backdrop-blur-md border border-white/30 rounded-full
                hover:bg-white/20 transition-all
                shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                Job Hunting Workspace
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
