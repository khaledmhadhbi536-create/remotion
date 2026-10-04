import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";

// A replaceable visual slot. Priority: video → photo → code-drawn fallback (children).
// Photos get a slow Ken Burns push-in so a still never looks frozen.
export const MediaSlot: React.FC<{
  readonly image?: string | null;
  readonly video?: string | null;
  readonly zoom?: [number, number]; // scale from → to over the slot's lifetime
  readonly children: React.ReactNode;
}> = ({ image, video, zoom = [1.04, 1.14], children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], zoom);

  if (video) {
    return (
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Video
          src={staticFile(video)}
          muted
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </AbsoluteFill>
    );
  }
  if (image) {
    return (
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Img
          src={staticFile(image)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};
