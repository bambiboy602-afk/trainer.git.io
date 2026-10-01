import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend
} from 'recharts';
import {
  Brain,
  HeartHandshake,
  ShieldCheck,
  Zap,
  Sparkles,
  Activity,
  Compass,
  Target,
  CheckCircle2,
  ArrowRight,
  Info,
  Award,
  Layers,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { PersonaProfile } from '../types';
import {
  BENCHMARK_ARCHETYPES,
  BenchmarkArchetype,
  calculateArchetypeMatches,
  ArchetypeMatchResult
} from '../data/benchmarkArchetypes';

interface LatestAnalysisRadarProps {
  profile: PersonaProfile;
  onSelectScenarioWithTopic?: (topic: string) => void;
}

export const LatestAnalysisRadar: React.FC<LatestAnalysisRadarProps> = ({ profile }) => {
  // Extract or synthesize user scores across 6 core dimensions
  const userScores = useMemo(() => {
    if (profile.progressHistory && profile.progressHistory.length > 0) {
      const latestSnap = profile.progressHistory[profile.progressHistory.length - 1];
      return {
        empathy: latestSnap.empathy ?? 50,
        assertiveness: latestSnap.assertiveness ?? 50,
        clarity: latestSnap.clarity ?? 50,
        deEscalation: latestSnap.deEscalation ?? 50,
        activeListening: latestSnap.activeListening ?? 50,
        logicalReasoning: latestSnap.logicalReasoning ?? 50
      };
    }

    const getSpectrum = (id: string, fallback = 50) =>
      profile.spectrums?.find((s) => s.id === id)?.score ?? fallback;

    const currentEmpathy =
      profile.socialGrowthFeedback?.empathyScore ?? getSpectrum('social_empathy', 50);
    const currentAssertiveness = getSpectrum('boundary_strength', 50);
    const currentDirectness = getSpectrum('directness', 50);
    const currentClarity = Math.min(
      100,
      Math.max(10, Math.round(currentDirectness * 0.7 + (profile.completenessScore || 0) * 0.3))
    );
    const currentDeEscalation =
      profile.socialGrowthFeedback?.deEscalationScore ?? getSpectrum('de_escalation', 50);
    const currentActiveListening = Math.min(
      100,
      Math.max(10, Math.round(currentEmpathy * 0.6 + currentDeEscalation * 0.4))
    );
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

  // Compute similarity rankings across all 5 benchmark archetypes
  const archetypeMatches: ArchetypeMatchResult[] = useMemo(() => {
    return calculateArchetypeMatches(userScores);
  }, [userScores]);

  const bestMatch = archetypeMatches[0];

  // Selected benchmark overlay: null means "solo" (user only)
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string | null>(
    bestMatch ? bestMatch.archetype.id : 'diplomatic_leader'
  );

  const [showDetailedDeltas, setShowDetailedDeltas] = useState(true);

  // Active benchmark archetype object
  const activeBenchmark: BenchmarkArchetype | null = useMemo(() => {
    if (!selectedBenchmarkId) return null;
    return BENCHMARK_ARCHETYPES.find((b) => b.id === selectedBenchmarkId) || null;
  }, [selectedBenchmarkId]);

  // Active match result for currently selected benchmark
  const activeMatchResult: ArchetypeMatchResult | null = useMemo(() => {
    if (!activeBenchmark) return null;
    return archetypeMatches.find((m) => m.archetype.id === activeBenchmark.id) || null;
  }, [activeBenchmark, archetypeMatches]);

  // Radar chart data preparation
  const radarChartData = useMemo(() => {
    const dimensionDefs = [
      { key: 'empathy' as const, label: 'Empathy', icon: HeartHandshake, color: '#0d9488' },
      { key: 'assertiveness' as const, label: 'Assertiveness', icon: ShieldCheck, color: '#d97706' },
      { key: 'clarity' as const, label: 'Clarity', icon: Sparkles, color: '#2563eb' },
      { key: 'deEscalation' as const, label: 'De-escalation', icon: Activity, color: '#0284c7' },
      { key: 'activeListening' as const, label: 'Active Listening', icon: Zap, color: '#7c3aed' },
      { key: 'logicalReasoning' as const, label: 'Logical Reasoning', icon: Brain, color: '#475569' }
    ];

    return dimensionDefs.map((dim) => {
      const userVal = userScores[dim.key];
      const benchVal = activeBenchmark ? activeBenchmark.scores[dim.key] : undefined;
      const delta = benchVal !== undefined ? userVal - benchVal : 0;

      return {
        metric: dim.label,
        key: dim.key,
        userValue: userVal,
        benchmarkValue: benchVal,
        delta,
        icon: dim.icon,
        color: dim.color,
        fullMark: 100
      };
    });
  }, [userScores, activeBenchmark]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Header with Title and Closest Archetype Badge */}
      <div className="p-5 border-b border-stone-200 bg-gradient-to-r from-stone-50 via-white to-amber-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900">Communication Radar & Archetype Overlay</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  Live DNA
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Compare your current conversational posture against gold-standard professional archetypes
              </p>
            </div>
          </div>
        </div>

        {/* Closest Match Callout */}
        {bestMatch && (
          <button
            onClick={() => setSelectedBenchmarkId(bestMatch.archetype.id)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-200/90 bg-amber-50 hover:bg-amber-100/70 transition-all text-left cursor-pointer group shadow-2xs self-start sm:self-auto"
            title="Click to overlay your closest archetype benchmark"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
              <Award className="w-3.5 h-3.5 fill-stone-950" />
            </div>
            <div>
              <div className="text-[9px] uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1">
                <span>Closest Archetype</span>
                <span className="font-extrabold text-amber-950">({bestMatch.similarityScore}% Fit)</span>
              </div>
              <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                {bestMatch.archetype.name}
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Benchmark Selector Segmented Bar */}
      <div className="px-5 py-3 border-b border-stone-200 bg-stone-50/70">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            Select Benchmark Overlay:
          </span>
          <button
            onClick={() => setShowDetailedDeltas(!showDetailedDeltas)}
            className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{showDetailedDeltas ? 'Hide Breakdown' : 'Show Breakdown'}</span>
          </button>
        </div>

        {/* Selector Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Solo Button */}
          <button
            onClick={() => setSelectedBenchmarkId(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
              selectedBenchmarkId === null
                ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                selectedBenchmarkId === null ? 'bg-amber-400' : 'bg-stone-400'
              }`}
            />
            <span>Solo (Your DNA Only)</span>
          </button>

          {/* Benchmark Archetype Buttons */}
          {BENCHMARK_ARCHETYPES.map((archetype) => {
            const isSelected = selectedBenchmarkId === archetype.id;
            const matchInfo = archetypeMatches.find((m) => m.archetype.id === archetype.id);
            const isBest = bestMatch?.archetype.id === archetype.id;

            return (
              <button
                key={archetype.id}
                onClick={() => setSelectedBenchmarkId(archetype.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-white shadow-xs ring-2 ring-stone-900/10'
                    : 'bg-white/80 hover:bg-white text-stone-600 border-stone-200/90'
                }`}
                style={{
                  borderColor: isSelected ? archetype.color : undefined
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: archetype.color }}
                />
                <span className={isSelected ? 'font-bold text-stone-900' : 'text-stone-700'}>
                  {archetype.name}
                </span>
                {matchInfo && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                      isBest
                        ? 'bg-amber-100 text-amber-900 border border-amber-300/80'
                        : isSelected
                        ? 'bg-stone-100 text-stone-700'
                        : 'text-stone-400'
                    }`}
                  >
                    {matchInfo.similarityScore}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Radar Display Stage */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Graphic (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="h-72 sm:h-80 w-full max-w-md">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="metric"
                  stroke="#475569"
                  fontSize={11}
                  tick={{ fill: '#475569', fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  stroke="#cbd5e1"
                  fontSize={9}
                  tick={{ fill: '#94a3b8' }}
                  ticks={[25, 50, 75, 100]}
                />

                {/* User Radar Area */}
                <Radar
                  name="Your Communication DNA"
                  dataKey="userValue"
                  stroke="#d97706"
                  fill="#f59e0b"
                  fillOpacity={activeBenchmark ? 0.35 : 0.55}
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 1.5, fill: '#ffffff', stroke: '#d97706' }}
                />

                {/* Overlay Benchmark Radar Area */}
                {activeBenchmark && (
                  <Radar
                    name={`Benchmark: ${activeBenchmark.name}`}
                    dataKey="benchmarkValue"
                    stroke={activeBenchmark.color}
                    fill={activeBenchmark.fillColor}
                    fillOpacity={0.22}
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    dot={{ r: 4, strokeWidth: 1.5, fill: '#ffffff', stroke: activeBenchmark.color }}
                  />
                )}

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const dataPoint = payload[0].payload;
                      const hasBenchmark = dataPoint.benchmarkValue !== undefined;

                      return (
                        <div className="bg-stone-950 text-white p-3 rounded-xl shadow-2xl text-xs space-y-2 border border-stone-800 min-w-44">
                          <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                            <span className="font-bold text-stone-100 flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: dataPoint.color }}
                              />
                              {dataPoint.metric}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            {/* User score */}
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-amber-400 font-medium flex items-center gap-1.5">
                                <span className="w-2 h-0.5 bg-amber-400 rounded-full" />
                                Your Score:
                              </span>
                              <span className="font-bold text-white text-sm">
                                {dataPoint.userValue}/100
                              </span>
                            </div>

                            {/* Benchmark score if active */}
                            {hasBenchmark && activeBenchmark && (
                              <div className="flex items-center justify-between gap-4">
                                <span
                                  className="font-medium flex items-center gap-1.5"
                                  style={{ color: activeBenchmark.color }}
                                >
                                  <span
                                    className="w-2 h-0.5 rounded-full"
                                    style={{ backgroundColor: activeBenchmark.color }}
                                  />
                                  {activeBenchmark.name}:
                                </span>
                                <span className="font-bold text-white text-sm">
                                  {dataPoint.benchmarkValue}/100
                                </span>
                              </div>
                            )}

                            {/* Delta diff */}
                            {hasBenchmark && (
                              <div className="pt-1 border-t border-stone-800 flex items-center justify-between text-[11px]">
                                <span className="text-stone-400">Variance Gap:</span>
                                <span
                                  className={`font-bold ${
                                    dataPoint.delta > 0
                                      ? 'text-emerald-400'
                                      : dataPoint.delta < 0
                                      ? 'text-amber-400'
                                      : 'text-stone-300'
                                  }`}
                                >
                                  {dataPoint.delta > 0
                                    ? `+${dataPoint.delta} (Ahead)`
                                    : dataPoint.delta < 0
                                    ? `${dataPoint.delta} (Gap)`
                                    : 'Exact Match'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  height={28}
                  formatter={(value) => (
                    <span className="text-xs font-semibold text-stone-700 px-1">{value}</span>
                  )}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Info & Comparison Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {activeBenchmark && activeMatchResult ? (
            <div className="p-4 rounded-xl border bg-stone-50/70 border-stone-200/90 space-y-3">
              {/* Benchmark Title & Similarity Meter */}
              <div className="flex items-start justify-between gap-2 border-b border-stone-200/70 pb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: activeBenchmark.color }}
                    />
                    <h4 className="text-sm font-bold text-stone-900">{activeBenchmark.name}</h4>
                  </div>
                  <p className="text-[11px] font-medium text-stone-500 mt-0.5">
                    {activeBenchmark.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-stone-900">
                    {activeMatchResult.similarityScore}%
                  </div>
                  <span className="text-[9px] uppercase font-bold text-stone-400 tracking-wider">
                    Archetype Fit
                  </span>
                </div>
              </div>

              {/* Tagline quote */}
              <p className="text-xs text-stone-700 italic bg-white p-2.5 rounded-lg border border-stone-200/70 leading-relaxed">
                "{activeBenchmark.tagline}"
              </p>

              {/* Core Strengths */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Key Superpowers:
                </span>
                <ul className="text-xs text-stone-700 space-y-1">
                  {activeBenchmark.strengths.slice(0, 2).map((str, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-snug">
                      <span className="text-stone-400 shrink-0">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Signature Technique */}
              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60">
                <div className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                  <Target className="w-3 h-3 text-amber-700" /> Signature Playbook:
                </div>
                <div className="text-xs font-semibold text-stone-900 mt-0.5">
                  {activeBenchmark.signatureTactic}
                </div>
              </div>

              {/* Coaching Directive to bridge the gap */}
              <div className="text-xs text-stone-600 leading-relaxed pt-1">
                <span className="font-bold text-stone-800">Growth Directive: </span>
                {activeBenchmark.coachingDirective}
              </div>
            </div>
          ) : (
            /* Solo Mode Card */
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Solo Profile Mode
                </h4>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                You are currently viewing your un-overlayed communication polygon. Select any of the
                benchmark archetypes above to observe where your natural conversational posture exceeds
                or aligns with standard negotiation, leadership, or crisis profiles.
              </p>

              {bestMatch && (
                <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Calculated Archetype Fit
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">
                      {bestMatch.archetype.name}
                    </span>
                    <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {bestMatch.similarityScore}% Match
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedBenchmarkId(bestMatch.archetype.id)}
                    className="w-full mt-2 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Inspect {bestMatch.archetype.name} Overlay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Dimension Gap Breakdown (when toggled on) */}
      {showDetailedDeltas && (
        <div className="p-5 border-t border-stone-200 bg-stone-50/40">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              Dimension Breakdown {activeBenchmark ? `vs. ${activeBenchmark.name}` : '(Current Scores)'}
            </h4>
            <span className="text-[10px] text-stone-400">Scores calibrated 0 - 100</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {radarChartData.map((item) => {
              const Icon = item.icon;
              const hasBenchmark = item.benchmarkValue !== undefined;

              return (
                <div
                  key={item.metric}
                  className="p-3 bg-white rounded-xl border border-stone-200/90 shadow-2xs space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                        style={{ backgroundColor: `${item.color}18`, color: item.color }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {hasBenchmark && (
                        <span
                          className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                            item.delta > 0
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.delta < 0
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {item.delta > 0 ? `+${item.delta}` : item.delta}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-stone-800 truncate" title={item.metric}>
                      {item.metric}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-extrabold text-stone-900">
                        {item.userValue}
                        <span className="text-[10px] font-normal text-stone-400">/100</span>
                      </span>
                      {hasBenchmark && activeBenchmark && (
                        <span
                          className="text-xs font-semibold truncate ml-1"
                          style={{ color: activeBenchmark.color }}
                          title={`${activeBenchmark.name}: ${item.benchmarkValue}`}
                        >
                          T: {item.benchmarkValue}
                        </span>
                      )}
                    </div>

                    {/* Comparative Visual Bar */}
                    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-1.5 relative">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${item.userValue}%` }}
                      />
                      {hasBenchmark && (
                        <div
                          className="absolute top-0 bottom-0 w-1 bg-stone-900 rounded-full opacity-80"
                          style={{ left: `${item.benchmarkValue}%` }}
                          title={`Benchmark target: ${item.benchmarkValue}`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Archetype Quick-Comparison Matrix Footer */}
      <div className="px-5 py-3 border-t border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-[11px] text-stone-500">
            Archetype fits are computed using Euclidean multi-dimensional variance across all 6 traits.
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-stone-400">Quick Rank:</span>
          {archetypeMatches.slice(0, 3).map((m, idx) => (
            <button
              key={m.archetype.id}
              onClick={() => setSelectedBenchmarkId(m.archetype.id)}
              className="px-2 py-0.5 rounded-md bg-white border border-stone-200 hover:border-stone-300 text-stone-700 font-semibold cursor-pointer transition-colors"
            >
              #{idx + 1} {m.archetype.name} ({m.similarityScore}%)
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
