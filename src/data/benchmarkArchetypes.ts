export interface BenchmarkArchetype {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  color: string;
  fillColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  scores: {
    empathy: number;
    assertiveness: number;
    clarity: number;
    deEscalation: number;
    activeListening: number;
    logicalReasoning: number;
  };
  strengths: string[];
  signatureTactic: string;
  blindSpots: string[];
  idealEnvironments: string[];
  coachingDirective: string;
}

export const BENCHMARK_ARCHETYPES: BenchmarkArchetype[] = [
  {
    id: 'empathetic_negotiator',
    name: 'Empathetic Negotiator',
    subtitle: 'High-Attunement Bridge Builder',
    tagline: 'Secures unshakeable agreements by unearthing emotional motives and establishing psychological safety before bargaining.',
    color: '#059669', // emerald-600
    fillColor: '#10b981', // emerald-500
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-800',
    scores: {
      empathy: 90,
      assertiveness: 80,
      clarity: 78,
      deEscalation: 86,
      activeListening: 92,
      logicalReasoning: 72
    },
    strengths: [
      'Uncovers latent needs and hidden non-monetary leverage',
      'Validates counterpart emotions without conceding boundaries',
      'Transforms adversarial impasses into collaborative problem solving'
    ],
    signatureTactic: 'Tactical Empathy & Calibrated "How" / "What" Questions',
    blindSpots: [
      'Can over-accommodate bad-faith negotiators if boundary vigilance lapses',
      'May spend excessive time building rapport when rapid closure is mandatory'
    ],
    idealEnvironments: [
      'High-stakes commercial contracts, labor mediation, multi-party alliances, client retention'
    ],
    coachingDirective: 'To shift toward this archetype: Increase active listening pauses and label counterpart feelings before presenting counter-proposals.'
  },
  {
    id: 'logical_analyst',
    name: 'Logical Analyst',
    subtitle: 'First-Principles Deconstructer',
    tagline: 'Dismantles complex ambiguity with surgical clarity, rigorous evidence chains, and razor-sharp objective reasoning.',
    color: '#4f46e5', // indigo-600
    fillColor: '#6366f1', // indigo-500
    badgeBg: 'bg-indigo-50',
    badgeBorder: 'border-indigo-200',
    badgeText: 'text-indigo-800',
    scores: {
      empathy: 52,
      assertiveness: 76,
      clarity: 95,
      deEscalation: 65,
      activeListening: 64,
      logicalReasoning: 96
    },
    strengths: [
      'Pinpoint signal-to-noise ratio in technical explanations',
      'Immunized against cognitive biases, vanity metrics, and emotional manipulation',
      'Excavates root systemic causes rather than treating surface symptoms'
    ],
    signatureTactic: 'Socratic First-Principles Inquiry & Evidence Triangulation',
    blindSpots: [
      'Can inadvertently trigger counterpart defensiveness by treating emotional friction purely as a logic problem',
      'May prioritize correctness over emotional receptivity'
    ],
    idealEnvironments: [
      'Architecture reviews, algorithmic safety auditing, strategic risk modeling, forensic debates'
    ],
    coachingDirective: 'To shift toward this archetype: Strip away conversational filler, structure points as premises leading to conclusions, and cite verifiable metrics.'
  },
  {
    id: 'diplomatic_leader',
    name: 'Diplomatic Leader',
    subtitle: 'Balanced Executive Statesman',
    tagline: 'Harmonizes strategic direction with human dignity, commanding respect through composed poise, clarity, and transparent rationale.',
    color: '#2563eb', // blue-600
    fillColor: '#3b82f6', // blue-500
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-blue-800',
    scores: {
      empathy: 84,
      assertiveness: 85,
      clarity: 88,
      deEscalation: 86,
      activeListening: 86,
      logicalReasoning: 84
    },
    strengths: [
      'Maintains equilibrium and social cohesion during high-pressure crises',
      'Articulates hard decisions with transparent, humane justification',
      'Bridges diverse factions without diluting institutional goals'
    ],
    signatureTactic: 'Grounded Framing & Inclusive Synthesis',
    blindSpots: [
      'May gravitate toward consensus when an urgent, unilateral disruption is required',
      'High balance can occasionally dilute bold, polarizing creative risks'
    ],
    idealEnvironments: [
      'Executive leadership, organizational change management, board meetings, cross-functional directorship'
    ],
    coachingDirective: 'To shift toward this archetype: Balance every firm requirement with an empathetic acknowledgment of its human impact.'
  },
  {
    id: 'crisis_deescalator',
    name: 'Crisis De-escalator',
    subtitle: 'Somatic Grounder & Safety Anchor',
    tagline: 'Rapidly lowers acute autonomic arousal, absorbs verbal hostility with poise, and re-establishes grounded psychological safety.',
    color: '#0284c7', // sky-600
    fillColor: '#0ea5e9', // sky-500
    badgeBg: 'bg-sky-50',
    badgeBorder: 'border-sky-200',
    badgeText: 'text-sky-800',
    scores: {
      empathy: 95,
      assertiveness: 68,
      clarity: 78,
      deEscalation: 98,
      activeListening: 96,
      logicalReasoning: 65
    },
    strengths: [
      'Exceptional tolerance for intense verbal hostility and emotional distress',
      'Paces vocal tone and breathing to trigger down-regulation in others',
      'Protects patient/participant autonomy without escalating power struggles'
    ],
    signatureTactic: 'Low-Arousal Pacing & Autonomous Validation (See → Sit → Move)',
    blindSpots: [
      'Can absorb secondary traumatic stress if intentional decompression rituals are skipped',
      'May soften necessary administrative or legal boundaries to maintain harmony'
    ],
    idealEnvironments: [
      'Mental health peer support, ER triage, crisis hotlines, customer rage escalations, domestic violence safety planning'
    ],
    coachingDirective: 'To shift toward this archetype: Slow your speech cadence by 20%, replace defensive counter-arguments with silent presence, and validate physical safety first.'
  },
  {
    id: 'assertive_anchor',
    name: 'Assertive Anchor',
    subtitle: 'Decisive Boundary Guardian',
    tagline: 'Cuts through paralysis and ambiguity with unwavering boundaries, high accountability, and fearless directness.',
    color: '#e11d48', // rose-600
    fillColor: '#f43f5e', // rose-500
    badgeBg: 'bg-rose-50',
    badgeBorder: 'border-rose-200',
    badgeText: 'text-rose-800',
    scores: {
      empathy: 58,
      assertiveness: 96,
      clarity: 92,
      deEscalation: 60,
      activeListening: 58,
      logicalReasoning: 88
    },
    strengths: [
      'Zero susceptibility to guilt trips, passive aggression, or scope creep',
      'Instant clarity on resource constraints and non-negotiables',
      'High momentum execution in time-pressured or hostile operational arenas'
    ],
    signatureTactic: 'CUS Protocol (Concerned, Uncomfortable, Safety) & Firm Non-Defensive Refusal',
    blindSpots: [
      'Can be experienced as intimidating or cold by trauma-sensitive or consensus-oriented peers',
      'May cut off valuable emotional nuance prematurely in collaborative ideation'
    ],
    idealEnvironments: [
      'Turnaround operations, vendor hardball, ethical whistleblowing, urgent incident command, emergency resource triage'
    ],
    coachingDirective: 'To shift toward this archetype: State boundaries in one concise sentence without over-explaining or apologizing for holding the line.'
  }
];

export interface ArchetypeMatchResult {
  archetype: BenchmarkArchetype;
  similarityScore: number; // 0 - 100
  deltaTotal: number;
  dimensionDeltas: {
    metric: string;
    userScore: number;
    benchmarkScore: number;
    delta: number; // user - benchmark
  }[];
}

/**
 * Computes match similarity across 6 core dimensions between user scores and benchmark archetype
 */
export function calculateArchetypeMatches(userScores: {
  empathy: number;
  assertiveness: number;
  clarity: number;
  deEscalation: number;
  activeListening: number;
  logicalReasoning: number;
}): ArchetypeMatchResult[] {
  const metrics: Array<{ key: keyof typeof userScores; label: string }> = [
    { key: 'empathy', label: 'Empathy' },
    { key: 'assertiveness', label: 'Assertiveness' },
    { key: 'clarity', label: 'Clarity' },
    { key: 'deEscalation', label: 'De-escalation' },
    { key: 'activeListening', label: 'Active Listening' },
    { key: 'logicalReasoning', label: 'Logical Reasoning' }
  ];

  const results: ArchetypeMatchResult[] = BENCHMARK_ARCHETYPES.map((archetype) => {
    let sumAbsDiff = 0;
    const dimensionDeltas = metrics.map(({ key, label }) => {
      const userVal = userScores[key] ?? 50;
      const benchVal = archetype.scores[key] ?? 50;
      const delta = userVal - benchVal;
      sumAbsDiff += Math.abs(delta);
      return {
        metric: label,
        userScore: userVal,
        benchmarkScore: benchVal,
        delta
      };
    });

    const avgDiff = sumAbsDiff / metrics.length;
    // 0 avg diff = 100%, 40+ avg diff = ~40%
    const similarityScore = Math.max(15, Math.min(100, Math.round(100 - avgDiff * 1.35)));

    return {
      archetype,
      similarityScore,
      deltaTotal: sumAbsDiff,
      dimensionDeltas
    };
  });

  // Sort descending by highest similarity
  return results.sort((a, b) => b.similarityScore - a.similarityScore);
}
