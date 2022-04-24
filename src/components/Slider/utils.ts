import { isNormalized } from "../../utils/normalization";
import { NumbersRange } from "../../utils/numbersRange";

export function validateSliderRange(range: NumbersRange) {
  if (Array.from(range).every(isNormalized) && range.direction >= 0) {
    return;
  }

  throw new Error(`Incorrect arg 'range': ${JSON.stringify(range)}`);
}


