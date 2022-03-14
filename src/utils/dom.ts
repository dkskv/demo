import { pick } from "ramda";
import { IPosition } from "./geometry";

export function getElementPosition(element: HTMLElement): IPosition {
    return pick(["x", "y", "width", "height"], element.getBoundingClientRect());
}