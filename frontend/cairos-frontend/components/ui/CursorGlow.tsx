"use client";

type CursorGlowProps = Record<
  string,
  unknown
>;

/*
  Legacy cursor renderer intentionally disabled.

  CAIROS Home now owns the single global cursor
  through components/home/CairosGlobalField.tsx.

  Keeping this component as a no-op preserves any
  existing imports elsewhere in the app while
  preventing duplicate cursor / orbit visuals.
*/

export function CursorGlow(
  _props: CursorGlowProps
) {
  return null;
}

export default CursorGlow;