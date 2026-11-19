import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';

interface MemorySequenceSceneProps {
  firstImage: number;
  shotStartsMs: number[];
  chapter: string;
  dateRange: string;
  chapterIndex: number;
  totalChapters: number;
  filmOffsetMs: number;
}

const COMPOSITIONS = [
  { x: '48%', y: '50%', width: '86vw', height: '82vh', rotate: -0.35 },
  { x: '53%', y: '49%', width: '82vw', height: '79vh', rotate: 0.45 },
  { x: '50%', y: '52%', width: '88vw', height: '84vh', rotate: 0.2 },
  { x: '47%', y: '49%', width: '81vw', height: '78vh', rotate: -0.55 },
  { x: '52%', y: '52%', width: '85vw', height: '81vh', rotate: 0.3 },
] as const;

const PALETTES = ['#211a22', '#1a1e22', '#241d1d', '#1b1b20'] as const;
const CAMERA_MOVES = [
  { x: -13, y: 3, scale: 1.032, rotateX: 1.8, rotateY: -2.6 },
  { x: 9, y: -5, scale: 1.018, rotateX: -2.2, rotateY: 3.2 },
  { x: -6, y: -4, scale: 1.04, rotateX: 2.8, rotateY: 1.8 },
  { x: 14, y: 4, scale: 1.016, rotateX: -1.8, rotateY: -3.1 },
  { x: -9, y: 6, scale: 1.028, rotateX: 2.4, rotateY: 2.8 },
  { x: 6, y: -7, scale: 1.02, rotateX: -2.9, rotateY: -1.8 },
] as const;
const TRANSITION_STYLES = [
  { name: 'panel-y', fromX: 2, fromY: -9, toX: 0, toY: 0, z: 110, roll: 0.8, mask: 'inset(0% 100% 0% 0%)', exitX: -2, exitY: 9, exitRoll: -1.4, scaleStart: 0.94, perspectiveOrigin: '72% 48%', cameraX: 10, cameraY: -3 },
  { name: 'hinge-x', fromX: 8, fromY: -2, toX: 0, toY: 0, z: 30, roll: -0.6, mask: 'inset(0% 0% 100% 0%)', exitX: -7, exitY: 2, exitRoll: 1.2, scaleStart: 0.97, perspectiveOrigin: '50% 18%', cameraX: -7, cameraY: 5 },
  { name: 'z-zoom', fromX: -2, fromY: 3, toX: 0, toY: 0, z: 0, roll: -3.2, mask: 'inset(0% 0% 0% 100%)', exitX: 3, exitY: -4, exitRoll: 3.5, scaleStart: 0.9, perspectiveOrigin: '50% 52%', cameraX: -6, cameraY: 2 },
  { name: 'card-flip', fromX: 2, fromY: -9, toX: 0, toY: 0, z: 150, roll: 0.8, mask: 'inset(0% 100% 0% 0%)', exitX: -2, exitY: 9, exitRoll: -1.4, scaleStart: 0.92, perspectiveOrigin: '70% 50%', cameraX: 8, cameraY: 0 },
  { name: 'whip-orbit', fromX: -3, fromY: 7, toX: 0, toY: 0, z: 20, roll: -1.7, mask: 'inset(0% 0% 0% 100%)', exitX: 4, exitY: -8, exitRoll: 2, scaleStart: 0.96, perspectiveOrigin: '24% 48%', cameraX: -18, cameraY: 5 },
  { name: 'cube-face', fromX: 3, fromY: -9, toX: 0, toY: 0, z: 125, roll: 0.7, mask: 'inset(100% 0% 0% 0%)', exitX: -3, exitY: 9, exitRoll: -1.3, scaleStart: 0.95, perspectiveOrigin: '82% 50%', cameraX: 13, cameraY: -2 },
  { name: 'camera-orbit', fromX: -6, fromY: 4, toX: 0, toY: 0, z: 45, roll: -0.7, mask: 'inset(0% 0% 100% 0%)', exitX: 6, exitY: -4, exitRoll: 1.3, scaleStart: 0.96, perspectiveOrigin: '35% 40%', cameraX: 16, cameraY: -6 },
  { name: 'rotational-zoom', fromX: 4, fromY: 6, toX: 0, toY: 0, z: 70, roll: 2.6, mask: 'inset(100% 0% 0% 0%)', exitX: -4, exitY: -6, exitRoll: -2.8, scaleStart: 0.88, perspectiveOrigin: '64% 68%', cameraX: -9, cameraY: 7 },
  { name: 'whip-pan', fromX: -3, fromY: -6, toX: 0, toY: 0, z: 0, roll: -1.2, mask: 'inset(0% 50% 0% 50%)', exitX: 4, exitY: 8, exitRoll: 1.6, scaleStart: 0.94, perspectiveOrigin: '48% 54%', cameraX: 20, cameraY: -4 },
  { name: 'cube-x', fromX: -8, fromY: 4, toX: 0, toY: 0, z: 105, roll: -0.7, mask: 'inset(0% 0% 100% 0%)', exitX: 8, exitY: -4, exitRoll: 1.4, scaleStart: 0.94, perspectiveOrigin: '46% 82%', cameraX: -10, cameraY: 6 },
  { name: 'parallax-fold', fromX: 5, fromY: -7, toX: 0, toY: 0, z: 90, roll: 1.5, mask: 'inset(0% 0% 0% 100%)', exitX: -5, exitY: 7, exitRoll: -1.8, scaleStart: 0.91, perspectiveOrigin: '76% 34%', cameraX: 11, cameraY: 7 },
  { name: 'tilted-reveal', fromX: 7, fromY: 3, toX: 0, toY: 0, z: 85, roll: 1.1, mask: 'inset(0% 0% 100% 0%)', exitX: -7, exitY: -3, exitRoll: -1.5, scaleStart: 0.93, perspectiveOrigin: '28% 22%', cameraX: -12, cameraY: -5 },
] as const;
const CHAPTER_DURATIONS = [8700, 10550, 10600, 11200] as const;
const EASE = [0.22, 1, 0.36, 1] as const;

const photoUrl = (zeroBasedIndex: number) =>
  `${import.meta.env.BASE_URL}images/screenshot-${String(zeroBasedIndex + 1).padStart(2, '0')}.png`;

export function MemorySequenceScene({
  firstImage,
  shotStartsMs,
  chapter,
  dateRange,
  chapterIndex,
  totalChapters,
  filmOffsetMs,
}: MemorySequenceSceneProps) {
  const [localShot, setLocalShot] = useState(0);
  const [titleVisible, setTitleVisible] = useState(true);
  const timerEvents = useMemo(
    () => [
      ...shotStartsMs.slice(1).map((time, index) => ({
        time,
        callback: () => setLocalShot(index + 1),
      })),
      {
        time: 2450,
        callback: () => setTitleVisible(false),
      },
    ],
    [shotStartsMs],
  );
  useSceneTimer(timerEvents);

  const globalImageIndex = firstImage + localShot;
  const imageSrc = photoUrl(globalImageIndex);
  const composition = COMPOSITIONS[(globalImageIndex + chapterIndex) % COMPOSITIONS.length];
  const camera = CAMERA_MOVES[(globalImageIndex * 3 + chapterIndex) % CAMERA_MOVES.length];
  const transitionStyle = TRANSITION_STYLES[
    globalImageIndex >= 59 ? 3 : (globalImageIndex + chapterIndex * 2) % TRANSITION_STYLES.length
  ];
  const shotEnd = shotStartsMs[localShot + 1] ?? CHAPTER_DURATIONS[chapterIndex];
  const shotDuration = Math.max(0.28, (shotEnd - shotStartsMs[localShot]) / 1000);
  const entranceDuration = Math.min(0.36, Math.max(0.15, shotDuration * 0.62));
  const exitDuration = Math.min(0.24, Math.max(0.14, shotDuration * 0.48));
  const isFinalPlate = globalImageIndex === 60;
  const isMemoryField = globalImageIndex === 59;

  return (
    <motion.section
      className="memory-film absolute inset-0 overflow-hidden"
      initial={{ opacity: 0, scale: 0.97, x: 12, rotateY: -5, rotateX: 2, clipPath: 'inset(0% 12% 0% 0%)' }}
      animate={{ opacity: 1, scale: 1, x: 0, rotateY: 0, rotateX: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{
        opacity: 0,
        scale: 1.025,
        x: -10,
        rotateY: 5,
        rotateX: -2,
        clipPath: 'inset(0% 0% 0% 12%)',
        transition: { duration: 0.32, ease: [0.72, 0, 0.22, 1] },
      }}
      transition={{ duration: 0.36, ease: EASE, clipPath: { duration: 0.32, ease: EASE } }}
      style={{ transformPerspective: 1400, backgroundColor: PALETTES[chapterIndex] }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse at 52% 48%, rgb(228 117 96 / 11%), transparent 52%), linear-gradient(130deg, #151217 0%, ${PALETTES[chapterIndex]} 58%, #111014 100%)`,
        }}
      />
      <motion.div
        aria-hidden="true"
        className="memory-depth-grid absolute inset-0"
        animate={{
          x: [camera.x * 0.08, camera.x * 0.18, camera.x * 0.12],
          y: [camera.y * 0.08, camera.y * 0.18, camera.y * 0.12],
          rotate: [0, globalImageIndex % 2 === 0 ? 0.18 : -0.18, 0],
        }}
        transition={{ duration: shotDuration, ease: EASE }}
        style={{ transformOrigin: '50% 50%' }}
      />
      <div aria-hidden="true" className="memory-vignette absolute inset-0" />
      <motion.div
        aria-hidden="true"
        className="memory-chapter-sweep memory-chapter-sweep--upper"
        initial={{ x: '-115%', opacity: 0.78 }}
        animate={{ x: '115%', opacity: 0 }}
        transition={{ duration: 0.76, delay: 0.03, ease: [0.72, 0, 0.22, 1] }}
      />
      <motion.div
        aria-hidden="true"
        className="memory-chapter-sweep memory-chapter-sweep--lower"
        initial={{ x: '115%', opacity: 0.62 }}
        animate={{ x: '-115%', opacity: 0 }}
        transition={{ duration: 0.84, delay: 0.08, ease: [0.72, 0, 0.22, 1] }}
      />

      <div className="absolute left-[5.8%] right-[5.8%] top-[6.8%] z-10">
        <div className="flex items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-[1.2vmin]">
            <span
              className="memory-mono inline-block h-[0.8vmin] w-[0.8vmin] rounded-full"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />
            <p className="memory-mono m-0 text-[1.5vmin] leading-none text-[var(--color-text-secondary)]">
              {dateRange}
            </p>
          </div>
          <p className="memory-mono m-0 shrink-0 text-[1.35vmin] text-[var(--color-text-muted)]">
            FATI / MEMORY ARCHIVE
          </p>
        </div>
        <motion.div
          key={`top-rule-${globalImageIndex}`}
          className="memory-rule mt-[1.7vmin] h-px"
          initial={{ width: '10%' }}
          animate={{ scaleX: [0.3, 1, 0.72] }}
          style={{ width: '33%', transformOrigin: 'left' }}
          transition={{ duration: shotDuration, ease: 'easeInOut' }}
        />
      </div>

      <div
        aria-hidden="true"
        className="memory-serif absolute left-[5.4%] top-[22%] z-0 select-none text-[15vmin] leading-[0.8] text-[var(--color-primary)] opacity-[0.075]"
      >
        {String(chapterIndex + 1).padStart(2, '0')}
      </div>

      <motion.div
        className="memory-camera absolute inset-0"
        aria-label={`Archive frame ${globalImageIndex + 1}`}
        animate={{
          x: [camera.x * 0.35, camera.x + transitionStyle.cameraX * 0.18, camera.x],
          y: [camera.y * 0.35, camera.y + transitionStyle.cameraY * 0.18, camera.y],
          scale: [1, camera.scale + 0.006, camera.scale],
          rotateX: [camera.rotateX * 0.35, camera.rotateX + transitionStyle.fromX * 0.18, camera.rotateX],
          rotateY: [camera.rotateY * 0.35, camera.rotateY + transitionStyle.fromY * 0.18, camera.rotateY],
        }}
        transition={{ duration: shotDuration, ease: EASE }}
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: '50% 50%',
          perspectiveOrigin: transitionStyle.perspectiveOrigin,
        }}
      >
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={`plate-${globalImageIndex}`}
          className="memory-image-frame"
          initial={{
            opacity: transitionStyle.name === 'whip-orbit' ? 0.72 : 0.45,
            x: transitionStyle.name === 'whip-orbit' ? transitionStyle.fromY * 4 : transitionStyle.fromY * 1.5,
            y: transitionStyle.name === 'whip-orbit' ? transitionStyle.fromX * 2 : transitionStyle.fromX * 1.2,
            z: transitionStyle.z,
            scale: isMemoryField ? 0.96 : isFinalPlate ? 0.94 : transitionStyle.scaleStart,
            rotate: composition.rotate + transitionStyle.roll,
            rotateX: transitionStyle.fromX,
            rotateY: transitionStyle.fromY,
            clipPath: transitionStyle.mask,
            filter: transitionStyle.name === 'whip-orbit' ? 'blur(5px)' : 'blur(0px)',
          }}
          animate={{
            opacity: 1,
            x: transitionStyle.name === 'whip-orbit' ? [transitionStyle.fromY * 4, 5, 0] : [transitionStyle.fromY * 1.5, -2, 0],
            y: transitionStyle.name === 'whip-orbit' ? [transitionStyle.fromX * 2, -3, 0] : [transitionStyle.fromX * 1.2, 2, 0],
            z: 0,
            scale: isMemoryField
              ? [0.96, 0.92, 0.88]
              : isFinalPlate
                ? [0.94, 1, 1]
                : [transitionStyle.scaleStart, camera.scale + 0.018, camera.scale],
            rotate: [composition.rotate + transitionStyle.roll, composition.rotate - transitionStyle.roll * 0.28, composition.rotate],
            rotateX: [transitionStyle.fromX, transitionStyle.toX, transitionStyle.toX + camera.rotateX * 0.18],
            rotateY: [transitionStyle.fromY, transitionStyle.toY, transitionStyle.toY + camera.rotateY * 0.18],
            clipPath: 'inset(0% 0% 0% 0%)',
            filter: transitionStyle.name === 'whip-orbit' ? ['blur(5px)', 'blur(0px)', 'blur(0px)'] : 'blur(0px)',
          }}
          exit={{
            opacity: 0,
            x: transitionStyle.exitY * 1.5,
            y: transitionStyle.exitX * 0.8,
            z: transitionStyle.z * -0.5,
            scale: isMemoryField ? 0.82 : 1.045,
            rotate: composition.rotate + transitionStyle.exitRoll,
            rotateX: transitionStyle.exitX,
            rotateY: transitionStyle.exitY,
            clipPath: transitionStyle.mask === 'inset(0% 50% 0% 50%)'
              ? 'inset(0% 50% 0% 50%)'
              : 'inset(0% 0% 0% 100%)',
            filter: transitionStyle.name === 'whip-orbit' ? 'blur(6px)' : 'blur(0px)',
            transition: { duration: exitDuration, ease: [0.72, 0, 0.22, 1] },
          }}
          transition={{
            duration: shotDuration,
            ease: EASE,
            x: { duration: shotDuration, ease: EASE },
            y: { duration: shotDuration, ease: EASE },
            scale: { duration: shotDuration, ease: EASE },
            rotate: { duration: entranceDuration, ease: EASE },
            rotateX: { duration: entranceDuration, ease: EASE },
            rotateY: { duration: entranceDuration, ease: EASE },
            z: { duration: entranceDuration, ease: EASE },
            clipPath: { duration: entranceDuration, ease: EASE },
            opacity: { duration: Math.min(0.24, entranceDuration), ease: EASE },
            filter: { duration: Math.min(0.2, entranceDuration), ease: EASE },
          }}
          style={{
            left: composition.x,
            top: composition.y,
            width: composition.width,
            height: composition.height,
            marginLeft: '-43vw',
            marginTop: '-41vh',
            transformStyle: 'preserve-3d',
            willChange: 'transform, opacity',
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-[1.12] opacity-[0.21]"
            style={{
              backgroundImage: `url("${imageSrc}")`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              filter: 'blur(18px) saturate(.72)',
            }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[#100e13]/35" />
          <img
            className="memory-image relative z-[1]"
            src={imageSrc}
            alt={`Original conversation screenshot ${globalImageIndex + 1} of 61`}
            draggable={false}
            loading="eager"
          />
          <div className="memory-image-glass absolute inset-0 z-[2]" aria-hidden="true" />
          <motion.div
            key={`edge-${globalImageIndex}`}
            aria-hidden="true"
            className="memory-edge absolute left-0 top-0 z-[3] h-[2px] w-full origin-left"
            style={{ backgroundColor: 'var(--color-accent)' }}
            initial={{ scaleX: 0, opacity: 0.95 }}
            animate={{ scaleX: 1, opacity: 0.4 }}
            transition={{ duration: Math.min(0.48, shotDuration), ease: 'easeOut' }}
          />
        </motion.div>
      </AnimatePresence>
      </motion.div>

      <motion.div
        layoutId="fati-archive-rail"
        aria-hidden="true"
        className="absolute left-[5.8%] top-[16.4%] z-20 h-px w-[19%] origin-left"
        style={{ backgroundColor: 'var(--color-accent)' }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      />

      <AnimatePresence>
        {titleVisible && (
          <motion.div
            key={`chapter-title-${chapterIndex}`}
            className="memory-title-lockup absolute bottom-[21%] left-[6%] z-20"
            initial={{ opacity: 0, y: 22, clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ opacity: 0, y: -12, clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.62, delay: chapterIndex === 0 ? 0.18 : 0.08, ease: EASE }}
          >
            <span className="memory-mono memory-kicker">
              {String(chapterIndex + 1).padStart(2, '0')} / THREAD ARCHIVE
            </span>
            <h1 className="memory-serif m-0 mt-[0.7vmin] max-w-[68vw] text-[clamp(2.4rem,7.2vmin,7.5rem)] leading-[0.9] text-[var(--color-primary)]">
              {chapter}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="memory-frame-mark memory-frame-mark--tl" aria-hidden="true" />
      <div className="memory-frame-mark memory-frame-mark--br" aria-hidden="true" />
      <div className="memory-scanline" aria-hidden="true" />

      <div className="absolute bottom-[6.7%] left-[5.8%] right-[5.8%] z-10 flex items-end justify-between gap-8">
        <div className="min-w-0">
          <p className="memory-mono mb-[0.8vmin] mt-0 text-[1.2vmin] text-[var(--color-text-muted)]">
            CHAPTER {String(chapterIndex + 1).padStart(2, '0')} / {String(totalChapters).padStart(2, '0')}
          </p>
          <h2 className="memory-serif m-0 max-w-[70vw] text-[clamp(1.25rem,2.2vmin,2.3rem)] leading-[0.94] text-[var(--color-primary)]">
            {chapter}
          </h2>
        </div>
        <div className="mb-[0.4vmin] flex shrink-0 items-center gap-[1.1vmin]">
          <div className="memory-rule w-[5vmin]" />
          <span className="memory-mono text-[1.4vmin] tabular-nums text-[var(--color-text-secondary)]">
            {String(globalImageIndex + 1).padStart(2, '0')} / 61
          </span>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="memory-mono absolute bottom-[2.8%] right-[5.8%] z-10 text-[0.95vmin] text-[var(--color-text-muted)]"
      >
        {isFinalPlate ? 'ARCHIVE / LOOP POINT' : 'A MOMENT, KEPT'}
      </div>
      <div className="memory-shot-index memory-mono" aria-hidden="true">
        FRAME {String(globalImageIndex + 1).padStart(2, '0')}<span> — </span>{dateRange}
      </div>

      <span aria-hidden="true" className="sr-only">
        Film time {filmOffsetMs} milliseconds
      </span>
    </motion.section>
  );
}
