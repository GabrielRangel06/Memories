import { MemorySequenceScene } from './MemorySequenceScene';

export function MemoryChapterOne() {
  return (
    <MemorySequenceScene
      firstImage={0}
      shotStartsMs={[0, 450, 750, 1200, 1600, 1950, 2350, 2800, 3100, 3550, 3950, 4300, 4700, 5150, 5450, 5900, 6350, 7050, 7650, 8250]}
      chapter="Un partido, mil mensajes"
      dateRange="19—20 JUN 2026"
      chapterIndex={0}
      totalChapters={4}
      filmOffsetMs={0}
    />
  );
}
