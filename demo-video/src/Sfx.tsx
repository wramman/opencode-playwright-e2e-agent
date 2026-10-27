import { Audio } from "@remotion/media";
import { interpolate, staticFile } from "remotion";
import { APP_STAR_AT, APP_SUMMARIZE_AT } from "./scenes/AppScene";
import { TUI_INPUT_CLICK_AT } from "./scenes/TuiScene";
import { CONTENT_OUT_LEAD, SATELLITES, SCENES } from "./timeline";

// Sound effects generated with Higgsfield Seed Audio (public/sfx). Tuned for a
// noisy fair played through TV speakers: short, mid/high-frequency cues that
// mark what happens on screen; the video still works muted.
type Sound = "typing" | "enter" | "error" | "pop" | "whoosh" | "click" | "tick" | "warn" | "success" | "outro";

type Cue = { at: number; sound: Sound; volume: number; frames?: number; rate?: number };

const S = SCENES;
const lead = CONTENT_OUT_LEAD;
const sceneStarts = [S.prompt.from, S.app.from, S.bug.from, S.results.from, S.agents.from, S.close.from];

const CUES: Cue[] = [
  { at: 0, sound: "whoosh", volume: 0.5 },
  { at: 42, sound: "error", volume: 0.85 },
  // Each transition: whoosh as the shape shrinks, pop as it opens up again.
  ...sceneStarts.map((at): Cue => ({ at: at - lead, sound: "whoosh", volume: 0.55 })),
  ...sceneStarts.map((at): Cue => ({ at, sound: "pop", volume: 0.6 })),
  // OpenCode: click the input, type the prompt, press enter, tools tick in.
  { at: S.prompt.from + TUI_INPUT_CLICK_AT, sound: "click", volume: 0.9 },
  { at: S.prompt.from + 22, sound: "typing", volume: 0.7, frames: 52 },
  { at: S.prompt.from + 84, sound: "enter", volume: 0.9 },
  ...[0, 1, 2, 3, 4, 5].map((i): Cue => ({ at: S.prompt.from + 110 + i * 15, sound: "tick", volume: 0.55 })),
  // NotesAI: typing the title and its edit, color, star and summarize.
  { at: S.app.from + 14, sound: "typing", volume: 0.55, frames: 32 },
  { at: S.app.from + 66, sound: "typing", volume: 0.55, frames: 14 },
  { at: S.app.from + 84, sound: "pop", volume: 0.4 },
  { at: S.app.from + APP_STAR_AT, sound: "click", volume: 0.9 },
  { at: S.app.from + APP_STAR_AT + 2, sound: "pop", volume: 0.5, rate: 1.3 },
  { at: S.app.from + APP_SUMMARIZE_AT, sound: "click", volume: 0.9 },
  { at: S.bug.from + 12, sound: "warn", volume: 0.85 },
  // Results: one rising tick per requirement, then the success chime.
  ...[0, 1, 2, 3, 4, 5, 6].map((i): Cue => ({ at: S.results.from + 18 + i * 9, sound: "tick", volume: 0.65, rate: 1 + i * 0.08 })),
  { at: S.results.from + 81, sound: "success", volume: 0.85 },
  // Agents rotate in.
  ...[0, 1, 2, 3, 4].map((i): Cue => ({ at: S.agents.from + 14 + i * 14, sound: "tick", volume: 0.5 })),
  { at: S.close.from + 10, sound: "outro", volume: 0.8 },
  // Satellites slipping out from under the shape.
  ...SATELLITES.map((s): Cue => ({ at: s.from, sound: "pop", volume: 0.25, rate: 1.15 })),
];

export const Sfx = () => (
  <>
    {CUES.map((cue, i) => (
      <Audio
        key={i}
        name={`SFX ${cue.sound}`}
        src={staticFile(`sfx/${cue.sound}.wav`)}
        from={cue.at}
        durationInFrames={cue.frames}
        playbackRate={cue.rate ?? 1}
        // Long cues (typing) fade out instead of being cut off.
        volume={(f) => (cue.frames ? cue.volume * interpolate(f, [cue.frames - 6, cue.frames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : cue.volume)}
      />
    ))}
  </>
);
