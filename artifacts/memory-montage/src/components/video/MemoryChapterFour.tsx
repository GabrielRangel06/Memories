import { MemorySequenceScene } from './MemorySequenceScene';

export function MemoryChapterFour() {
  return (
    <MemorySequenceScene
      firstImage={50}
      shotStartsMs={[0, 1200, 1750, 3250, 5000, 5450, 5900, 7650, 8250, 9000, 10600]}
      chapter="Lo que queda entre líneas"
      dateRange="07—18 JUL 2026"
      chapterIndex={3}
      totalChapters={4}
      filmOffsetMs={29850}
    />
  );
}
