// const getRatioPosition = (min: number, max: number, x: number) =>
//   (x - min) / (max - min);

export const clamp = (min: number, max: number, x: number) =>
  Math.max(min, Math.min(max, x));

export const createThumbHandler =
  (track: HTMLElement, callback: (pos: number) => void) =>
  (mouseDown: Pick<MouseEvent, "preventDefault" | "target" | "pageX">) => {
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
      const { left: trackX1, width: trackWidth } = track.getBoundingClientRect();

      const fromTrackX1 = (mouseX - trackX1) + thumbShiftX;

      callback(fromTrackX1 / trackWidth);
    }

    function getThumbShiftX(element: HTMLElement, clickX: number) {
      const { left: x, width } = element.getBoundingClientRect();
      // + width / 2, т.к. thumb позиционируется центром
      const thumbX = x + width / 2;

      return thumbX - clickX;
    }
  };
