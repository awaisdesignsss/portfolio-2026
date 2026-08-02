export interface IMetric {
  /** Count-up target — the counted text node is just this number. */
  value: number;
  /** Unit rendered in the .metrics__affix span; omitted entirely when absent. */
  affix?: string;
  label: string;
}
