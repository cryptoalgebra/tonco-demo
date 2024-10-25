import { Percent } from '@toncodex/sdk';

export const Presets = {
  SAFE: 'SAFE',
  RISK: 'RISK',
  NORMAL: 'NORMAL',
  FULL: 'FULL',
  STABLE: 'STABLE',
};

export type PresetsType = (typeof Presets)[keyof typeof Presets];

export const PresetProfits = {
  VERY_LOW: 'VERY_LOW',
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export type PresetProfitsType =
  (typeof PresetProfits)[keyof typeof PresetProfits];

export interface PresetsArgs {
  title: string;
  type: PresetsType;
  min: Percent;
  max: Percent;
  risk: PresetProfitsType;
  profit: PresetProfitsType;
}
