import { useGetBooks } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Layers, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import { useEffect, useState } from "react";

const GRADIENTS = [
  "linear-gradient(135deg, #6C5CE7, #A29BFE)",
  "linear-gradient(135deg, #00B894, #55EFC4)",
  "linear-gradient(135deg, #E17055, #FDCB6E)",
  "linear-gradient(135deg, #0984E3, #74B9FF)",
];

interface BookProgress {
  total: number;
  completed: number;
  percent: number;
  completedIds: number[];
}

export default function Home() {
  const { data: books, isLoading } = useGetBooks();
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<number, BookProgress>>({});

  useEffect(() => {
    if (!books) return;
    books.forEach(async (book) => {
      try {
        const data = await apiFetch<BookProgress>(`/api/progress/book/${book.id}`);
        setProgress(prev => ({ ...prev, [book.id]: data }));
      } catch {
        // unauthenticated or error — show 0%
      }
    });
  }, [books]);

  const totalChapters = books?.reduce((sum, b) => sum + (b.chapter_count || 0), 0) || 0;
  const totalContent = 18;

  const statCards = [
    { label: "Books Available", value: books?.length ?? 0, icon: BookOpen, iconBg: "rgba(108,92,231,0.12)", iconColor: "#6C5CE7" },
    { label: "Total Chapters", value: totalChapters, icon: Layers, iconBg: "rgba(0,184,148,0.12)", iconColor: "#00B894" },
    { label: "Content Pages", value: totalContent, icon: FileText, iconBg: "rgba(253,203,110,0.2)", iconColor: "#FDCB6E" },
  ];

  if (isLoading) {
    return (
      <div style={{ maxWidth: 1100 }}>
        <Skeleton className="h-12 w-64 mb-8 rounded-xl" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }}>
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-72 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#2D3436", marginBottom: 4 }}>
          Good morning, {user?.name?.split(" ")[0] || "Student"} 👋
        </h1>
        <p style={{ color: "#636E72", fontSize: 15 }}>Continue where you left off.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }}>
        {statCards.map(card => (
          <div key={card.label} style={{ background: "white", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 16, transition: "box-shadow 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(108,92,231,0.12)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)")}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: card.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <card.icon size={22} color={card.iconColor} />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#2D3436", lineHeight: 1 }}>{card.value}</div>
              <div style={{ fontSize: 13, color: "#636E72", marginTop: 4 }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#2D3436" }}>Your Library</h2>
        <span style={{ fontSize: 14, color: "#6C5CE7", fontWeight: 500, cursor: "pointer" }}>View All</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {books?.map((book, idx) => {
          const prog = progress[book.id];
          const pct = prog?.percent ?? 0;
          const gradient = GRADIENTS[idx % GRADIENTS.length];
          return (
            <div
              key={book.id}
              style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "all 0.25s", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ background: gradient, padding: "24px 20px 20px", minHeight: 100 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: "white", lineHeight: 1.3 }}>{book.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 6 }}>{book.chapter_count} chapters</div>
              </div>
              <div style={{ padding: "16px 20px 20px" }}>
                {book.description && (
                  <p style={{ fontSize: 13, color: "#636E72", lineHeight: 1.5, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {book.description}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#636E72" }}>{book.chapter_count} chapters</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#6C5CE7" }}>{pct}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: "#F0F1F5", marginBottom: 14, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 99, background: "#6C5CE7", width: `${pct}%`, transition: "width 0.6s ease" }} />
                </div>
                <Link href={`/books/${book.id}`}>
                  <button
                    style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "none", background: "#6C5CE7", color: "white", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "background 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#4834D4")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#6C5CE7")}
                  >
                    {pct > 0 ? "Continue Learning →" : "Start Learning →"}
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
