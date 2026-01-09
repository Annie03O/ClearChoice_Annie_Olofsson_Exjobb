import type { Messurement } from "../../../models/Types/sizeCalculator/Messurements";

type Values = {
  shoulder: number;
  chest: number;
  waist: number;
}
const distanceToRange = (v: number, min: number, max: number) => {
  if (v < min) return min - v;
  if (v > max) return v - max;
  return 0; 
}


export function getSizeFromRules(
  rules: Messurement[],
  values: Values
): string {
  const { shoulder, chest, waist } = values;

  const exactMatch = rules.find((rule) => {
    const okShoulder = shoulder >= rule.shoulders! && shoulder <= rule.shoulders!;
    const okChest    = chest    >= rule.minChest!    && chest    <= rule.maxChest!;
    const okWaist    = waist    >= rule.minWaist!    && waist    <= rule.maxWaist!;
    return okShoulder && okChest && okWaist;
  });

  if (exactMatch) exactMatch.size.toString();

  const ranked = rules.map((r) => {
    const shoulders = 1;
    const dChest = distanceToRange(chest, r.minChest!, r.maxChest!);
    const dWaist = distanceToRange(waist, r.minWaist!, r.maxWaist! );

    return {rule: r, score: shoulders + dChest + dWaist}
  }).sort((a, b) => a.score - b.score);

  const best = ranked[0]?.rule;
  const second = ranked[1]?.rule;

  if (!best) return "No rules found";

  const threshold = 1;

  if ( second && Math.abs(ranked[0].score - ranked[1].score) <= threshold) {
    return `You are in between ${best.size} and ${second.size}`
  };

  return best.size.toString();
}
