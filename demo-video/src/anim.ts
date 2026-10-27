import { Easing, interpolate, useVideoConfig } from "remotion";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
// Slight overshoot used for the shape morph, like the reference video.
export const easeBack = Easing.bezier(0.34, 1.32, 0.64, 1);

// Fades a layer in at the start of its window and out at the end.
export const fadeInOut = (frame: number, dur: number, inAt = 8, len = 10) =>
  interpolate(frame, [inAt, inAt + len, dur - len, dur], [0, 1, 1, 0], {
    ...clamp,
    easing: easeOut,
  });

// Shape center and caption box for each format.
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  return vertical
    ? {
        vertical,
        shapeX: width / 2,
        shapeY: 780,
        caption: { left: 80, top: 1250, width: width - 160, height: 500 },
      }
    : {
        vertical,
        shapeX: 1330,
        shapeY: height / 2,
        caption: { left: 120, top: 0, width: 660, height },
      };
};
