import { useGetAnalyticsSummary, getGetAnalyticsSummaryQueryKey } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { MousePointerClick, Clock, ArrowDownToLine, BarChart2 } from "lucide-react";
import { Link } from "wouter";

export default function Analytics() {
  const { data, isLoading } = useGetAnalyticsSummary({ query: { queryKey: getGetAnalyticsSummaryQueryKey() } });

  if (isLoading) {
    return <div className="space-y-8 max-w-6xl mx-auto">
      <Skeleton className="h-[40px] w-[300px]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[120px] rounded-2xl" />
        <Skeleton className="h-[120px] rounded-2xl" />
        <Skeleton className="h-[120px] rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[300px] rounded-2xl" />
        <Skeleton className="h-[300px] rounded-2xl" />
      </div>
    </div>;
  }

  if (!data || (data.buttonClicks.length === 0 && data.videoWatch.length === 0 && data.scrollDepth.length === 0)) {
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center'}}>
        <div style={{width: 80, height: 80, borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
          <BarChart2 size={40} color="#A0A0B0" />
        </div>
        <h2 style={{fontSize: 24, fontWeight: 700, color: '#2D3436', marginBottom: 8}}>No analytics data yet</h2>
        <p style={{color: '#636E72', fontSize: 16, marginBottom: 32}}>Visit content pages to start tracking engagement.</p>
        <Link href="/" style={{background: '#6C5CE7', color: '#FFFFFF', padding: '12px 24px', borderRadius: 12, fontWeight: 600, textDecoration: 'none'}}>
          Browse Library
        </Link>
      </div>
    );
  }

  const scrollData = [...data.scrollDepth].sort((a, b) => b.avg_scroll_percent - a.avg_scroll_percent);

  const totalClicks = data.buttonClicks.reduce((sum, item) => sum + item.count, 0);
  const totalWatchSec = data.videoWatch.reduce((sum, item) => sum + item.total_seconds, 0);
  const watchMin = Math.floor(totalWatchSec / 60);
  const watchSec = Math.floor(totalWatchSec % 60);
  const avgScrollAll = data.scrollDepth.length > 0 ? (data.scrollDepth.reduce((sum, item) => sum + item.avg_scroll_percent, 0) / data.scrollDepth.length).toFixed(0) : 0;

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-16">
      <div>
        <h1 style={{fontSize: 28, fontWeight: 600, color: '#2D3436'}}>Analytics Overview</h1>
      </div>

      {/* 2. Summary metric cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div style={{background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 56, height: 56, borderRadius: '50%', background: 'rgba(108, 92, 231, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6C5CE7'}}>
            <MousePointerClick size={24} />
          </div>
          <div>
            <div style={{color: '#636E72', fontSize: 14, fontWeight: 500}}>Total Button Clicks</div>
            <div style={{color: '#2D3436', fontSize: 24, fontWeight: 700}}>{totalClicks}</div>
          </div>
        </div>
        <div style={{background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 56, height: 56, borderRadius: '50%', background: 'rgba(0, 184, 148, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00B894'}}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{color: '#636E72', fontSize: 14, fontWeight: 500}}>Total Watch Time</div>
            <div style={{color: '#2D3436', fontSize: 24, fontWeight: 700}}>{watchMin}m {watchSec}s</div>
          </div>
        </div>
        <div style={{background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 56, height: 56, borderRadius: '50%', background: 'rgba(0, 184, 148, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00B894'}}>
            <ArrowDownToLine size={24} />
          </div>
          <div>
            <div style={{color: '#636E72', fontSize: 14, fontWeight: 500}}>Avg Scroll Depth</div>
            <div style={{color: '#2D3436', fontSize: 24, fontWeight: 700}}>{avgScrollAll}%</div>
          </div>
        </div>
      </div>

      {/* 3. Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div style={{background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.02)'}}>
          <h3 style={{fontWeight: 600, fontSize: 16, color: '#2D3436', marginBottom: 24}}>Button Clicks by Type</h3>
          <div style={{height: 300}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.buttonClicks}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EAED" />
                <XAxis dataKey="button_label" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => v.replace('_', ' ')} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#F4F5FA'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="count" fill="#6C5CE7" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div style={{background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.02)'}}>
          <h3 style={{fontWeight: 600, fontSize: 16, color: '#2D3436', marginBottom: 24}}>Watch Time by Content</h3>
          <div style={{height: 300}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.videoWatch}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EAED" />
                <XAxis dataKey="content_title" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => v.length > 15 ? v.substring(0, 15) + '...' : v} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#F4F5FA'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="total_seconds" fill="#00B894" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Full-width scroll depth table */}
      {data.scrollDepth.length > 0 && (
        <div style={{background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.02)'}}>
          <h3 style={{fontWeight: 600, fontSize: 18, color: '#2D3436', marginBottom: 24}}>Content Engagement — Scroll Depth</h3>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '1px solid #E8EAED'}}>
                <th style={{textAlign: 'left', paddingBottom: 16, color: '#636E72', fontWeight: 600, fontSize: 14}}>Content Title</th>
                <th style={{textAlign: 'right', paddingBottom: 16, color: '#636E72', fontWeight: 600, fontSize: 14}}>Avg Scroll %</th>
                <th style={{textAlign: 'left', paddingBottom: 16, color: '#636E72', fontWeight: 600, fontSize: 14, paddingLeft: 24, width: '40%'}}>Progress Bar</th>
                <th style={{textAlign: 'right', paddingBottom: 16, color: '#636E72', fontWeight: 600, fontSize: 14}}>Status Badge</th>
              </tr>
            </thead>
            <tbody>
              {scrollData.map((item, i) => {
                const percent = Math.round(item.avg_scroll_percent);
                let status = "Bounced";
                let badgeBg = "#FDE8E4";
                let badgeColor = "#E17055";
                
                if (percent > 75) {
                  status = "Engaged";
                  badgeBg = "#D4F4E8";
                  badgeColor = "#00B894";
                } else if (percent >= 40) {
                  status = "Partial";
                  badgeBg = "#FFF3D6";
                  badgeColor = "#FDCB6E";
                }

                return (
                  <tr key={i} style={{borderBottom: i === scrollData.length - 1 ? 'none' : '1px solid #F4F5FA'}}>
                    <td style={{padding: '16px 0', color: '#2D3436', fontWeight: 500, fontSize: 14}}>{item.content_title}</td>
                    <td style={{padding: '16px 0', color: '#2D3436', fontWeight: 600, fontSize: 14, textAlign: 'right'}}>{percent}%</td>
                    <td style={{padding: '16px 0 16px 24px'}}>
                      <div style={{height: 8, background: '#F0F0F0', borderRadius: 4, overflow: 'hidden'}}>
                        <div style={{width: `${percent}%`, height: '100%', background: badgeColor, borderRadius: 4}}></div>
                      </div>
                    </td>
                    <td style={{padding: '16px 0', textAlign: 'right'}}>
                      <span style={{background: badgeBg, color: badgeColor, padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600}}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
