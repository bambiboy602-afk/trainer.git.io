import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';
import { Brain, HeartHandshake, ShieldCheck, Zap, Sparkles, Activity } from 'lucide-react';
import { PersonaProfile } from '../types';

interface LatestAnalysisRadarProps {
  profile: PersonaProfile;
}

export const LatestAnalysisRadar: React.FC<LatestAnalysisRadarProps> = ({ profile }) => {
  const latest = React.useMemo(() => {
    if (profile.progressHistory && profile.progressHistory.length > 0) {
      return profile.progressHistory[profile.progressHistory.length - 1];
    }
    
    // Fallback if no history yet
    const getSpectrum = (id: string, fallback = 50) =>
      profile.spectrums?.find((s) => s.id === id)?.score ?? fallback;

    const currentEmpathy = profile.socialGrowthFeedback?.empathyScore ?? getSpectrum('social_empathy', 50);
    const currentAssertiveness = getSpectrum('boundary_strength', 50);
    const currentDirectness = getSpectrum('directness', 50);
    const currentClarity = Math.min(100, Math.max(10, Math.round(currentDirectness * 0.7 + (profile.completenessScore || 0) * 0.3)));
    const currentDeEscalation = profile.socialGrowthFeedback?.deEscalationScore ?? getSpectrum('de_escalation', 50);
    const currentActiveListening = Math.min(100, Math.max(10, Math.round(currentEmpathy * 0.6 + currentDeEscalation * 0.4)));
    const currentLogicalReasoning = getSpectrum('reasoning_mode', 50);

    return {
      empathy: currentEmpathy,
      assertiveness: currentAssertiveness,
      clarity: currentClarity,
      deEscalation: currentDeEscalation,
      activeListening: currentActiveListening,
      logicalReasoning: currentLogicalReasoning
    };
  }, [profile]);

  const data = [
    { metric: 'Empathy', value: latest.empathy, icon: HeartHandshake, color: '#0d9488' },
    { metric: 'Assertiveness', value: latest.assertiveness, icon: ShieldCheck, color: '#d97706' },
    { metric: 'Clarity', value: latest.clarity, icon: Sparkles, color: '#2563eb' },
    { metric: 'De-escalation', value: latest.deEscalation, icon: Activity, color: '#0284c7' },
    { metric: 'Active Listening', value: latest.activeListening, icon: Zap, color: '#7c3aed' },
    { metric: 'Logical Reasoning', value: latest.logicalReasoning, icon: Brain, color: '#475569' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-amber-600" />
        <div>
          <h3 className="text-sm font-bold text-stone-900">Latest Communication Balance</h3>
          <p className="text-[11px] text-stone-500">Your current social and cognitive DNA map</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
              dataKey="metric" 
              stroke="#64748b" 
              fontSize={10} 
              tick={{ fill: '#64748b', fontWeight: 600 }}
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              stroke="#cbd5e1" 
              fontSize={9} 
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Communication Style"
              dataKey="value"
              stroke="#d97706"
              fill="#f59e0b"
              fillOpacity={0.5}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-stone-900 text-white p-2 px-3 rounded-lg shadow-xl text-xs flex items-center gap-2 border border-stone-700">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-bold">{item.metric}:</span>
                      <span className="text-amber-400">{item.value}/100</span>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
        {data.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.metric} className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-tight leading-none mb-0.5">
                  {item.metric}
                </div>
                <div className="text-sm font-bold text-stone-900">{item.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
