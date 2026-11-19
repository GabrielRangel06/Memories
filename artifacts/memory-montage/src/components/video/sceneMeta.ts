// Optional scene metadata for Replit workspace integrations. When the
// workspace's scene controls are enabled for this project, a viewer's click on
// a scene segment scopes their next chat request to that scene's source file.
// Fill one entry per SCENE_DURATIONS key in VideoTemplate.tsx only when a
// skill reference asks for it; otherwise leave the map empty. Scenes missing
// from the map still play and can be jumped to.
//
// Example:
//   export const SCENE_DETAILS: Record<string, SceneDetails> = {
//     open: { title: 'Intro', filePath: 'src/components/video/video_scenes/Scene1.tsx' },
//   };

export interface SceneDetails {
  title: string;
  filePath: string;
}

export const SCENE_DETAILS: Record<string, SceneDetails> = {
  openingThread: {
    title: 'Un partido, mil mensajes',
    filePath: 'src/components/video/MemoryChapterOne.tsx',
  },
  sharedJokes: {
    title: 'El hilo no termina',
    filePath: 'src/components/video/MemoryChapterTwo.tsx',
  },
  photoFragments: {
    title: 'Y de pronto, una foto',
    filePath: 'src/components/video/MemoryChapterThree.tsx',
  },
  keepsake: {
    title: 'Lo que queda entre líneas',
    filePath: 'src/components/video/MemoryChapterFour.tsx',
  },
};
