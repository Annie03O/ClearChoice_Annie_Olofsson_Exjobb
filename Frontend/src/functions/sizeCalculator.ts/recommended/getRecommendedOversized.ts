import { oversizedFit } from "../../../models/objects/sizeCalculator/oversizedFit";
import type { Messurement } from "../../../models/Types/sizeCalculator/Messurements";

export function getRecommendedOversized(
  userShoulders: number,
  userChest: number,
  userWaist: number,
  tolerance = 4 
): string {
  const EPS = 0.0001;

  let bestMatch: Messurement | null = null;
  let bestDiff = Infinity;

  let secondBestMatch: Messurement | null = null;
  let secondDiff = Infinity;

  for (const size of oversizedFit) {
    
    const shouldersMin = (size as any).minShoulders ?? size.shoulders;
    const shouldersMax = (size as any).maxShoulders ?? size.shoulders;

    const chestMin = (size as any).minChest ?? size.maxChest; // om min saknas, anta “exakt max”
    const chestMax = size.maxChest;

    const waistMin = (size as any).minWaist ?? size.maxWaist;
    const waistMax = size.maxWaist;

    //s = 41
    // if sd = 41 < 40 ? 40 - 41 else 41 - 40 = 1
    const shouldersDiff =
      userShoulders < shouldersMin ? (shouldersMin - userShoulders)
    : userShoulders > shouldersMax ? (userShoulders - shouldersMax)
    : 0;

    // c=89  
    //if cd = 89 < 88 ? 88 -89 else 89 -88 = 1 
    const chestDiff =
      userChest < chestMin ? (chestMin - userChest)
    : userChest > chestMax ? (userChest - chestMax)
    : 0;

    const waistDiff =
      userWaist < waistMin ? (waistMin - userWaist)
    : userWaist > waistMax ? (userWaist - waistMax)
    : 0;

    //diff = 1 + 1 + 1
    const diff = shouldersDiff + chestDiff + waistDiff;

    //if 3 < Infinity
    // Update best/second
    if (diff < bestDiff) {
      secondBestMatch = bestMatch; //secondBestMatch is result
      secondDiff = bestDiff; //secondBestMatch is result
      bestMatch = size;  //Assign size
      bestDiff = diff; //Assign difference

      //if bestDiff is less than 0,0001
      if (bestDiff <= EPS) {
        return `Recommended Size ${bestMatch.size}`;
      }
    } else if (diff < secondDiff) {
      secondBestMatch = size;
      secondDiff = diff;
    }
  }

  // Not an exact match so return the two closest sizes
  if (bestMatch && secondBestMatch && bestDiff > EPS && (secondDiff - bestDiff) <= tolerance) {
    return `You are in between ${bestMatch.size} and ${secondBestMatch.size}`;
  }

  return bestMatch ? `Recommended Size ${bestMatch.size}` : "No size found";
}
