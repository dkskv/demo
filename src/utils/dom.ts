import { BoundingBox } from "./boundingBox";

export function getElementBoundingBox(element: HTMLElement) {
    const { x, y, width, height } = element.getBoundingClientRect();

    return BoundingBox.createByDimensions(x, y, width, height);
}