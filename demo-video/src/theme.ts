import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const { fontFamily: sans } = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const { fontFamily: mono } = loadMono("normal", {
  weights: ["500"],
  subsets: ["latin"],
});

export const colors = {
  bg: "#E8E5DF",
  ink: "#0B0B0B",
  inkSoft: "#1E1E1E",
  white: "#FFFFFF",
  muted: "#8A877F",
  mutedOnInk: "#9C9A94",
  line: "#ECE9E3",
  surface: "#F3F4F6",
  green: "#22A55B",
  amber: "#F2A516",
  red: "#E5484D",
  violet: "#8B5CF6",
  noteBlue: "#3B6A8E",
};
