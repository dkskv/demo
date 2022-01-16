import { clamp, update } from "ramda";

const boundsAround = (i: number, xs: number[]) =>
  [xs[i - 1] ?? 0, xs[i + 1] ?? 1] as const;

export const normalizeValues = (xs: number[]) =>
  xs.map((x, i) => clampPosition(i, x, xs));

export const clampPosition = (i: number, x: number, positions: number[]) =>
  clamp(...boundsAround(i, positions), x);

export const updatePositions = (i: number, x: number, positions: number[]) =>
  update(i, clampPosition(i, x, positions), positions);

export const handleThumbCapture =
  (mouseDown: Pick<MouseEvent, "preventDefault" | "target" | "pageX">, track: HTMLElement, callback: (pos: number) => void) => {
    mouseDown.preventDefault();

    const { target: thumb, pageX: mouseX0 } = mouseDown;

    if (!thumb) {
      return;
    }

    const thumbShiftX = getThumbShiftX(thumb as HTMLElement, mouseX0);

    document.addEventListener("mousemove", handleMoveThumb);

    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", handleMoveThumb);
    });

    function handleMoveThumb({ pageX: mouseX }: MouseEvent) {
      const { left: trackX1, width: trackWidth } =
        track.getBoundingClientRect();

      const betweenMouseAndTrackX1 = mouseX - trackX1 + thumbShiftX;

      callback(betweenMouseAndTrackX1 / trackWidth);
    }

    function getThumbShiftX(element: HTMLElement, clickX: number) {
      const { left: x, width } = element.getBoundingClientRect();
      // + width / 2, т.к. thumb позиционируется центром
      const thumbX = x + width / 2;

      return thumbX - clickX;
    }
  };
