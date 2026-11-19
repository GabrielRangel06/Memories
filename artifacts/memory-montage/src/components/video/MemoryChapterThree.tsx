import { MemorySequenceScene } from './MemorySequenceScene';

export function MemoryChapterThree() {
  return (
    <MemorySequenceScene
      firstImage={41}
      shotStartsMs={[0, 1350, 2350, 2950, 4900, 6800, 7650, 8250, 9400]}
      chapter="Y de pronto, una foto"
      dateRange="29 JUN—06 JUL 2026"
      chapterIndex={2}
      totalChapters={4}
      filmOffsetMs={19250}
    />
  );
}
