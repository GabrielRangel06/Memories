import { MemorySequenceScene } from './MemorySequenceScene';

export function MemoryChapterTwo() {
  return (
    <MemorySequenceScene
      firstImage={20}
      shotStartsMs={[0, 300, 700, 1150, 1450, 1900, 2350, 3050, 3500, 3800, 4250, 4700, 5000, 5400, 6150, 6600, 7050, 7350, 8200, 8800, 9400]}
      chapter="El hilo no termina"
      dateRange="22—29 JUN 2026"
      chapterIndex={1}
      totalChapters={4}
      filmOffsetMs={8700}
    />
  );
}
