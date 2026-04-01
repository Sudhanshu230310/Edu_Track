import { Link, useLocation } from "wouter";
import { Home, BookOpen, BarChart2, TrendingUp, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Home", href: "/", icon: Home, match: (loc: string) => loc === "/" },
    { name: "My Courses", href: "/", icon: BookOpen, match: (loc: string) => loc.startsWith("/books") || loc.startsWith("/content") },
    { name: "Analytics", href: "/analytics", icon: BarChart2, match: (loc: string) => loc === "/analytics" },
    { name: "Progress", href: "/", icon: TrendingUp, match: (_loc: string) => false },
  ];

  const initials = user ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <div className="flex min-h-screen" style={{ background: '#F4F5FA' }}>
      <aside style={{ width: 240, background: '#1E1B2E', position: 'fixed', top: 0, left: 0, height: '100vh', display: 'flex', flexDirection: 'column', zIndex: 50 }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/">
            <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#6C5CE7' }}>●</span> EduTrack
            </span>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => {
            const isActive = item.match(location);
            return (
              <Link key={item.name} href={item.href}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '12px', cursor: 'pointer',
                    background: isActive ? '#6C5CE7' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#A0A0B0',
                    transition: 'all 0.2s ease',
                    fontWeight: 500, fontSize: '14px'
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(108,92,231,0.15)'; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = '#A0A0B0'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: 12, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#6C5CE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'white', fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || "Guest"}</div>
              <div style={{ color: '#A0A0B0', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || ""}</div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px',
              borderRadius: 10, border: 'none', background: 'rgba(255,255,255,0.06)',
              color: '#A0A0B0', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(225,112,85,0.15)'; e.currentTarget.style.color = '#E17055'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#A0A0B0'; }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div style={{ marginLeft: 240, flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: 'white', borderBottom: '1px solid #E8EAED', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 40 }}>
          <span style={{ fontWeight: 600, fontSize: 16, color: '#2D3436' }}>Dashboard</span>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#6C5CE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 12 }}>
                {initials}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#2D3436' }}>{user.name}</span>
            </div>
          )}
        </header>
        <main style={{ padding: '32px', flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
