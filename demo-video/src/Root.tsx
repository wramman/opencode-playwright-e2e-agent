import { Composition } from "remotion";
import { OneShape } from "./OneShape";
import { FPS, TOTAL_FRAMES } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="OneShapeVertical" component={OneShape} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
      <Composition id="OneShapeHorizontal" component={OneShape} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
    </>
  );
};
