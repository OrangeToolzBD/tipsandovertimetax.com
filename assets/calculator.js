/* calculator.js — tipsandovertimetax.com
 * Two tools: "overtime" and "tips". Federal income-tax deductions under the 2025 reconciliation act (tax years 2025–2028).
 *
 * FIGURE STATUS (see README → Figures & verification):
 *   VERIFIED on irs.gov 2026-09-14: tips cap $25,000 · overtime cap $12,500 ($25,000 joint) ·
 *     phase-out starts above MAGI $150,000 ($300,000 joint) · SSN required · married must file jointly.
 *   VERIFY_BEFORE_LAUNCH: the phase-out RATE ($100 per $1,000 of MAGI over the threshold) and whether the
 *     reduction is per full $1,000 or proportional. Not found on irs.gov pages checked; congress.gov blocked.
 *     Check the Schedule 1-A instructions (irs.gov/forms-pubs) and set PHASEOUT below, then delete this note.
 */
(function (root, factory) {
  const C = factory();
  if (typeof module === 'object' && module.exports) module.exports = C; else root.CALCS = C;
})(typeof self !== 'undefined' ? self : this, function () {
  const RULES = {
    tips_cap: 25000,                     // VERIFIED irs.gov
    overtime_cap: { single: 12500, mfj: 25000 },   // VERIFIED irs.gov
    threshold: { single: 150000, mfj: 300000 },    // VERIFIED irs.gov
    PHASEOUT: { per: 1000, reduce: 100, whole_steps: false }, // VERIFY_BEFORE_LAUNCH
    years: '2025–2028',
  };

  const reduction = (magi, status) => {
    const over = Math.max(0, (magi || 0) - RULES.threshold[status]);
    const steps = RULES.PHASEOUT.whole_steps ? Math.floor(over / RULES.PHASEOUT.per) : over / RULES.PHASEOUT.per;
    return steps * RULES.PHASEOUT.reduce;
  };

  const statusInput = { id: 'status', label: 'Filing status', type: 'select', default: 'single', options: [
    { value: 'single', label: 'Single / Head of household' },
    { value: 'mfj', label: 'Married filing jointly' },
    { value: 'mfs', label: 'Married filing separately' },
  ] };
  const common = [
    statusInput,
    { id: 'magi', label: 'Modified adjusted gross income (MAGI)', type: 'number', prefix: '$', default: 65000, min: 0, help: 'For most people this is the AGI line on Form 1040.' },
    { id: 'rate', label: 'Your federal tax bracket', type: 'select', default: '22', options: ['10', '12', '22', '24', '32', '35', '37'].map(v => ({ value: v, label: `${v}%` })), help: 'Used only to estimate tax saved.' },
    { id: 'ssn', label: 'I have a valid Social Security number (and so does my spouse, if filing jointly)', type: 'checkbox', default: true },
  ];

  function gate(v) {
    const w = [];
    if (v.status === 'mfs') w.push('Married taxpayers must file jointly to claim this deduction. Married filing separately: $0.');
    if (!v.ssn) w.push('A valid Social Security number is required to claim this deduction.');
    return w;
  }

  const overtime = {
    title: 'No tax on overtime calculator',
    inputs: [
      { id: 'mode', label: 'How do you want to enter overtime?', type: 'radio', default: 'hours', options: [
        { value: 'hours', label: 'Hourly rate and overtime hours' }, { value: 'premium', label: 'I know my overtime premium total' }] },
      { id: 'hourly', label: 'Regular hourly rate', type: 'number', prefix: '$', default: 25, min: 0, showIf: s => s.mode === 'hours' },
      { id: 'hours', label: 'Overtime hours worked in the year (over 40/week)', type: 'number', default: 300, min: 0, showIf: s => s.mode === 'hours' },
      { id: 'premium', label: 'Overtime premium paid (the "half" in time-and-a-half)', type: 'number', prefix: '$', default: 3750, min: 0, showIf: s => s.mode === 'premium',
        help: 'Only the FLSA-required premium above your regular rate counts, not your whole overtime pay.' },
      ...common,
    ],
    compute(v, fmt) {
      const status = v.status === 'mfj' ? 'mfj' : 'single';
      const premium = v.mode === 'premium' ? (v.premium || 0) : (v.hourly || 0) * 0.5 * (v.hours || 0);
      const w = gate(v);
      const cap = RULES.overtime_cap[status];
      const capped = Math.min(premium, cap);
      const cut = reduction(v.magi, status);
      const deduction = w.length ? 0 : Math.max(0, capped - cut);
      const saved = deduction * Number(v.rate) / 100;
      return {
        raw: { premium, capped, cut, deduction, saved },
        warnings: w,
        summary: [
          { label: 'Estimated overtime deduction', value: fmt.money0(deduction), strong: true },
          { label: 'Estimated federal tax saved', value: fmt.money0(saved) },
        ],
        rows: [
          { label: 'Qualified overtime premium', value: fmt.money0(premium) },
          { label: `Annual cap (${status === 'mfj' ? 'joint' : 'single'})`, value: fmt.money0(cap) },
          { label: 'Income phase-out reduction', value: `− ${fmt.money0(Math.min(cut, capped))}` },
          { label: 'Deduction', value: fmt.money0(deduction), total: true },
        ],
        notes: [
          `Applies to tax years ${RULES.years}. Reduces federal income tax only — Social Security, Medicare and most state taxes still apply.`,
          'You can claim it whether you itemize or take the standard deduction.',
        ],
      };
    },
  };

  const tips = {
    title: 'No tax on tips calculator',
    inputs: [
      { id: 'w2tips', label: 'Qualified tips reported on your W-2', type: 'number', prefix: '$', default: 12000, min: 0 },
      { id: 'setips', label: 'Qualified tips from self-employment (1099)', type: 'number', prefix: '$', default: 0, min: 0 },
      { id: 'senet', label: 'Net profit from that self-employed work', type: 'number', prefix: '$', default: 0, min: 0, showIf: s => (s.setips || 0) > 0,
        help: 'Self-employed tips can’t exceed the net income of the business they came from.' },
      { id: 'occupation', label: 'My job is on the IRS list of occupations that customarily receive tips', type: 'checkbox', default: true },
      ...common,
    ],
    compute(v, fmt) {
      const status = v.status === 'mfj' ? 'mfj' : 'single';
      const w = gate(v);
      if (!v.occupation) w.push('Only tips received in an occupation on the IRS list of tipped occupations qualify.');
      const se = Math.min(v.setips || 0, (v.setips || 0) > 0 ? (v.senet || 0) : 0);
      const qualified = (v.w2tips || 0) + se;
      const capped = Math.min(qualified, RULES.tips_cap);
      const cut = reduction(v.magi, status);
      const deduction = w.length ? 0 : Math.max(0, capped - cut);
      const saved = deduction * Number(v.rate) / 100;
      return {
        raw: { qualified, capped, cut, deduction, saved },
        warnings: w,
        summary: [
          { label: 'Estimated tips deduction', value: fmt.money0(deduction), strong: true },
          { label: 'Estimated federal tax saved', value: fmt.money0(saved) },
        ],
        rows: [
          { label: 'Qualified tips', value: fmt.money0(qualified) },
          { label: 'Annual cap', value: fmt.money0(RULES.tips_cap) },
          { label: 'Income phase-out reduction', value: `− ${fmt.money0(Math.min(cut, capped))}` },
          { label: 'Deduction', value: fmt.money0(deduction), total: true },
        ],
        notes: [
          `Applies to tax years ${RULES.years}. Reduces federal income tax only — Social Security, Medicare and most state taxes still apply.`,
          'Tips must be voluntary (not automatic service charges) and reported. You can claim it whether you itemize or not.',
        ],
      };
    },
  };

  return {
    overtime, tips,
    __rules: RULES,
    __tests: [
      { calc: 'overtime', name: '300 OT hours at $25 → $3,750 premium, under cap and threshold',
        input: { mode: 'hours', hourly: 25, hours: 300, status: 'single', magi: 65000, rate: '22', ssn: true },
        expect: { premium: 3750, deduction: 3750, saved: 825 } },
      { calc: 'overtime', name: 'single premium above cap → capped at $12,500',
        input: { mode: 'premium', premium: 20000, status: 'single', magi: 90000, rate: '22', ssn: true },
        expect: { capped: 12500, deduction: 12500 } },
      { calc: 'overtime', name: 'single MAGI $160,000 → $1,000 reduction (VERIFY rate)',
        input: { mode: 'premium', premium: 8000, status: 'single', magi: 160000, rate: '24', ssn: true },
        expect: { cut: 1000, deduction: 7000 } },
      { calc: 'overtime', name: 'joint cap $25,000',
        input: { mode: 'premium', premium: 30000, status: 'mfj', magi: 200000, rate: '22', ssn: true },
        expect: { deduction: 25000 } },
      { calc: 'overtime', name: 'married filing separately → $0',
        input: { mode: 'premium', premium: 5000, status: 'mfs', magi: 60000, rate: '22', ssn: true },
        expect: { deduction: 0 } },
      { calc: 'tips', name: 'W-2 tips $12,000',
        input: { w2tips: 12000, setips: 0, senet: 0, occupation: true, status: 'single', magi: 45000, rate: '12', ssn: true },
        expect: { deduction: 12000, saved: 1440 } },
      { calc: 'tips', name: 'self-employed tips limited to net profit',
        input: { w2tips: 5000, setips: 9000, senet: 4000, occupation: true, status: 'single', magi: 45000, rate: '12', ssn: true },
        expect: { qualified: 9000, deduction: 9000 } },
      { calc: 'tips', name: 'tips above $25,000 cap, MAGI $400,000 joint → $10,000 reduction (VERIFY rate)',
        input: { w2tips: 40000, setips: 0, occupation: true, status: 'mfj', magi: 400000, rate: '32', ssn: true },
        expect: { capped: 25000, deduction: 15000 } },
      { calc: 'tips', name: 'no SSN → $0',
        input: { w2tips: 10000, setips: 0, occupation: true, status: 'single', magi: 40000, rate: '12', ssn: false },
        expect: { deduction: 0 } },
    ],
  };
});
