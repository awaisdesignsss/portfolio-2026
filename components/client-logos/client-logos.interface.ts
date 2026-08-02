/** Hover-chip payload — each card proves a different thing (role, stat, or quote). */
export type TClientReveal =
  | { kind: "role"; label: string; detail: string; meta: string }
  | { kind: "impact"; label: string; detail: string; meta: string }
  | { kind: "review"; label: string; detail: string; attribution: string };

export interface IClient {
  name: string;
  src: string;
  /** slightly different logo footprints read better when tuned per-mark */
  maxH?: number;
  maxW?: number;
  reveal: TClientReveal;
}
