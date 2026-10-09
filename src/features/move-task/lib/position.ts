export const POSITION_GAP = 1000;

/**
 * Position for an item dropped between two neighbours.
 * Only the moved task changes, its neighbours keep their positions.
 */
export function positionBetween(before?: number, after?: number): number {
  if (before === undefined && after === undefined) return POSITION_GAP;
  if (before === undefined) return after! / 2;
  if (after === undefined) return before + POSITION_GAP;
  return (before + after) / 2;
}
