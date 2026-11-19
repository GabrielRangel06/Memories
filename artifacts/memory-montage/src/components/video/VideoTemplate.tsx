/// <reference lib="dom" />

import { AnimatePresence } from 'framer-motion';
import { useEffect, useRef, type ComponentType } from 'react';
import {
  VideoCanvas,
  VideoPausedContext,
  type VideoAspectRatio,
  useVideoPlayer,
} from '@/lib/video';

import { MemoryChapterFour } from './MemoryChapterFour';
import { MemoryChapterOne } from './MemoryChapterOne';
import { MemoryChapterThree } from './MemoryChapterThree';
import { MemoryChapterTwo } from './MemoryChapterTwo';

export const SCENE_DURATIONS = {
  openingThread: 8700,
  sharedJokes: 10550,
  photoFragments: 10600,
  keepsake: 11200,
};

const VIDEO_ASPECT_RATIO: VideoAspectRatio = '16:9';
const SCENE_START_SECONDS: Record<string, number> = {
  openingThread: 39.35,
  sharedJokes: 48.05,
  photoFragments: 58.6,
  keepsake: 69.2,
};
const SCENE_COMPONENTS: Record<string, ComponentType> = {
  openingThread: MemoryChapterOne,
  sharedJokes: MemoryChapterTwo,
  photoFragments: MemoryChapterThree,
  keepsake: MemoryChapterFour,
};

interface VideoTemplateProps {
  durations?: Record<string, number>;
  loop?: boolean;
  paused?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
}

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  paused = false,
  muted = false,
  onSceneChange,
}: VideoTemplateProps = {}) {
  const { currentSceneKey } = useVideoPlayer({ durations, loop, paused });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSceneKeyRef = useRef<string | null>(null);
  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '');
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.42;

    if (paused) {
      audio.pause();
      return;
    }

    if (lastSceneKeyRef.current !== currentSceneKey) {
      lastSceneKeyRef.current = currentSceneKey;
      const targetTime = SCENE_START_SECONDS[baseSceneKey] ?? 39.35;
      const seekToSceneStart = () => {
        if (Math.abs(audio.currentTime - targetTime) > 0.18) {
          try {
            audio.currentTime = targetTime;
          } catch {
            // The browser will retry playback after the audio metadata is ready.
          }
        }
      };
      if (audio.readyState >= 1) {
        seekToSceneStart();
      } else {
        audio.addEventListener('loadedmetadata', seekToSceneStart, { once: true });
      }
    }

    audio.play().catch(() => {});
  }, [baseSceneKey, currentSceneKey, muted, paused]);

  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const sceneName = ['opening thread', 'shared jokes', 'photo fragments', 'keepsake'][sceneIndex] ?? 'memory';

  return (
    <VideoPausedContext.Provider value={paused}>
      <VideoCanvas aspectRatio={VIDEO_ASPECT_RATIO} className="memory-stage">
        <div className="absolute inset-0 overflow-hidden" data-memory-chapter={sceneName}>
          <AnimatePresence mode="sync" initial={false}>
            {SceneComponent && <SceneComponent key={currentSceneKey} />}
          </AnimatePresence>
        </div>
        <audio
          ref={audioRef}
          src={`${import.meta.env.BASE_URL}audio/rockabye.mp3`}
          preload="auto"
          autoPlay
          muted={muted}
          aria-label="Rockabye soundtrack"
        />
      </VideoCanvas>
    </VideoPausedContext.Provider>
  );
}
