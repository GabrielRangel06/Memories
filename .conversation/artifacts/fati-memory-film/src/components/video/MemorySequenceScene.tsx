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
  { x: -16, y: 4, scale: 1.045, rotate: 0.16, tiltX: 0.22, tiltY: -0.34 },
  { x: 12, y: -7, scale: 1.025, rotate: -0.12, tiltX: -0.26, tiltY: 0.42 },
  { x: -8, y: -5, scale: 1.055, rotate: 0.08, tiltX: 0.31, tiltY: 0.24 },
  { x: 18, y: 6, scale: 1.018, rotate: -0.18, tiltX: -0.2, tiltY: -0.38 },
  { x: -12, y: 8, scale: 1.04, rotate: 0.12, tiltX: 0.28, tiltY: 0.36 },
  { x: 8, y: -9, scale: 1.03, rotate: -0.08, tiltX: -0.32, tiltY: -0.22 },
] as const;
const REVEAL_ORIGINS = [
  'inset(0% 100% 0% 0%)',
  'inset(0% 0% 100% 0%)',
  'inset(0% 0% 0% 100%)',
  'inset(100% 0% 0% 0%)',
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
  const revealOrigin = REVEAL_ORIGINS[globalImageIndex % REVEAL_ORIGINS.length];
  const shotEnd = shotStartsMs[localShot + 1] ?? CHAPTER_DURATIONS[chapterIndex];
  const shotDuration = Math.max(0.28, (shotEnd - shotStartsMs[localShot]) / 1000);
  const isFinalPlate = globalImageIndex === 60;
  const isMemoryField = globalImageIndex === 59;

  return (
    <motion.section
      className="memory-film absolute inset-0 overflow-hidden"
      initial={{ opacity: 0, scale: 1.035, x: 12 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 1.025, x: -10 }}
      transition={{ duration: 0.34, ease: EASE }}
      style={{ backgroundColor: PALETTES[chapterIndex] }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse at 52% 48%, rgb(228 117 96 / 11%), transparent 52%), linear-gradient(130deg, #151217 0%, ${PALETTES[chapterIndex]} 58%, #111014 100%)`,
        }}
      />
      <div aria-hidden="true" className="memory-depth-grid absolute inset-0" />
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

      <div className="memory-camera absolute inset-0" aria-label={`Archive frame ${globalImageIndex + 1}`}>
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={`plate-${globalImageIndex}`}
          className="memory-image-frame"
          initial={{
            opacity: 0.3,
            x: camera.x * -1.5,
            y: camera.y * -1.2,
            scale: 0.965,
            rotate: composition.rotate + 0.45,
            rotateX: camera.tiltX + 0.28,
            rotateY: camera.tiltY + 0.32,
            clipPath: revealOrigin,
          }}
          animate={{
            opacity: 1,
            x: camera.x,
            y: camera.y,
            scale: isMemoryField ? 0.88 : camera.scale,
            rotate: composition.rotate + camera.rotate,
            rotateX: camera.tiltX,
            rotateY: camera.tiltY,
            clipPath: 'inset(0% 0% 0% 0%)',
          }}
          exit={{
            opacity: 0,
            x: camera.x * -1.6,
            scale: 1.055,
            rotate: composition.rotate - 0.35,
            rotateX: camera.tiltX * -1,
            rotateY: camera.tiltY * -1,
            clipPath: 'inset(0% 0% 0% 100%)',
          }}
          transition={{
            duration: shotDuration,
            ease: EASE,
            clipPath: { duration: Math.min(0.42, shotDuration), ease: EASE },
            opacity: { duration: Math.min(0.32, shotDuration), ease: EASE },
          }}
          style={{
            left: composition.x,
            top: composition.y,
            width: composition.width,
            height: composition.height,
            marginLeft: '-43vw',
            marginTop: '-41vh',
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
      </div>

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
