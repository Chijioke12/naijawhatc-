// Safe stub file to prevent runtime crash when Phaser is not loaded on window
class DummyScene {}
class DummyGame {}

const Phaser = (typeof window !== 'undefined' && (window as any).Phaser) || {
  Scene: DummyScene,
  Game: DummyGame,
  AUTO: 0,
  CANVAS: 1,
  WEBGL: 2,
  Scale: { FIT: 0, CENTER_BOTH: 0 },
  Types: {},
};

export default Phaser;
