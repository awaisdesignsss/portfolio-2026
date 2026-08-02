export interface IService {
  /** Pre-formatted row index, rendered verbatim — "(01)" … "(06)". */
  num: string;
  name: string;
  description: string;
  /** Full background-image value: the photo layered over a radial-gradient that doubles as its loading tint. */
  thumbBackground: string;
}
