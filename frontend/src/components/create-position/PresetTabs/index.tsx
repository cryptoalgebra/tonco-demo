import { DollarSign, Tally2, Tally3, Tally4, Tally5 } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from 'src/components/ui/Button';
import { jettons } from 'src/constants/jettons';
import { Jetton, Percent } from '@toncodex/sdk';
import {
  IDerivedMintInfo,
  useMintActionHandlers,
  useMintState,
} from 'src/state/mintStore';
import {
  PresetProfits,
  Presets,
  PresetsArgs,
  PresetsType,
} from 'src/types/presets';

interface RangeSidebarProps {
  currencyA: Jetton | undefined;
  currencyB: Jetton | undefined;
  mintInfo: IDerivedMintInfo;
}

const stablecoinsPreset: PresetsArgs[] = [
  {
    type: Presets.STABLE,
    title: `Stable`,
    min: new Percent(99, 100), // 0.99,
    max: new Percent(101, 100), // 1.01,
    risk: PresetProfits.VERY_LOW,
    profit: PresetProfits.HIGH,
  },
];

const commonPresets: PresetsArgs[] = [
  {
    type: Presets.RISK,
    title: `Narrow`,
    min: new Percent(95, 100), // 0.95,
    max: new Percent(110, 100), // 1.1
    risk: PresetProfits.HIGH,
    profit: PresetProfits.HIGH,
  },
  {
    type: Presets.NORMAL,
    title: `Common`,
    min: new Percent(90, 100), // 0.9
    max: new Percent(120, 100), // 1.2
    risk: PresetProfits.MEDIUM,
    profit: PresetProfits.MEDIUM,
  },
  {
    type: Presets.SAFE,
    title: `Wide`,
    min: new Percent(80, 100), // 0.8
    max: new Percent(140, 100), // 1.4
    risk: PresetProfits.LOW,
    profit: PresetProfits.LOW,
  },
  {
    type: Presets.FULL,
    title: `Full`,
    min: new Percent(0, 100), // unused
    max: new Percent(100, 100), // unused
    risk: PresetProfits.VERY_LOW,
    profit: PresetProfits.VERY_LOW,
  },
];

function PresetTabs({ currencyA, currencyB, mintInfo }: RangeSidebarProps) {
  const {
    preset,
    actions: { updateSelectedPreset, setFullRange },
  } = useMintState();

  const { onLeftRangeInput, onRightRangeInput } = useMintActionHandlers(
    mintInfo.noLiquidity,
  );

  const isStablecoinPair = useMemo(() => {
    if (!currencyA || !currencyB) return false;

    // const stablecoins = [USDC.address, USDT.address, DAI.address];
    const stablecoins = [
      jettons.ALG_USD.address,
      jettons.USD.address,
      jettons.USDC.address,
    ];

    return (
      stablecoins.includes(currencyA.address) &&
      stablecoins.includes(currencyB.address)
    );
  }, [currencyA, currencyB]);

  function handlePresetRangeSelection(preset: PresetsArgs) {
    if (!mintInfo.price || !mintInfo.pool || !currencyA || !currencyB) return;

    updateSelectedPreset(preset.type);

    const leftRangeValue = mintInfo.price.asFraction.multiply(preset.min);
    const rightRangeValue = mintInfo.price.asFraction.multiply(preset.max);

    if (preset && preset.type === Presets.FULL) {
      setFullRange();
    } else if (mintInfo.invertPrice) {
      onRightRangeInput(leftRangeValue.toFixed(12) || '');
      onLeftRangeInput(rightRangeValue.toFixed(12) || '');
    } else {
      onLeftRangeInput(leftRangeValue.toFixed(12) || '');
      onRightRangeInput(rightRangeValue.toFixed(12) || '');
    }
  }

  const presets = isStablecoinPair ? stablecoinsPreset : commonPresets;

  function onPresetSelect(range: PresetsArgs) {
    if (preset === range.type) return;
    handlePresetRangeSelection(range);
  }

  const renderPresetLogo = (rangeType: PresetsType) => {
    switch (rangeType) {
      case Presets.RISK:
        return <Tally2 className="ml-3 text-pink-500" />;
      case Presets.NORMAL:
        return <Tally3 className="ml-2 text-pink-400" />;
      case Presets.SAFE:
        return <Tally4 className="text-pink-300" />;
      case Presets.FULL:
        return <Tally5 className="text-pink-200" />;
      case Presets.STABLE:
        return <DollarSign className="text-green-300" />;
      default:
        return <span />;
    }
  };

  return (
    <div className="bg-card grid h-fit w-full grid-cols-2 gap-4 rounded-3xl p-1 sm:grid-cols-4">
      {presets.map((range) => (
        <Button
          className="flex h-[85px] w-full flex-col items-center gap-2 border border-border-light max-sm:text-xs sm:h-[100px]"
          variant={preset === range.type ? 'outlineActive' : 'outline'}
          size={'sm'}
          key={`preset-range-${range.title}`}
          onClick={() => onPresetSelect(range)}
        >
          {renderPresetLogo(range.type)}
          {range.title}
        </Button>
      ))}
    </div>
  );
}

export default PresetTabs;
