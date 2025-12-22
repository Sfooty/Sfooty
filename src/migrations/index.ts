import * as migration_20251222_073529 from './20251222_073529';

export const migrations = [
  {
    up: migration_20251222_073529.up,
    down: migration_20251222_073529.down,
    name: '20251222_073529'
  },
];
