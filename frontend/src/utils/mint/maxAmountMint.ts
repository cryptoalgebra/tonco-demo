import { jettons } from 'src/constants/jettons';
import {
  Jetton,
  JettonAmount,
  ONE,
  Percent,
  ZERO,
  PoolMessageManager,
} from '@toncodex/sdk';

export function maxAmountMint(
  jettonAmount: JettonAmount<Jetton>,
  slippage: Percent,
): JettonAmount<Jetton> {
  const multiplier = slippage.add(ONE);
  let maxAmount = jettonAmount.divide(multiplier);

  // subtract 0.61 TON for gas
  if (jettonAmount.jetton.equals(jettons.TON)) {
    maxAmount = maxAmount.subtract(
      JettonAmount.fromRawAmount(
        jettons.TON,
        PoolMessageManager.gasUsage.MINT_GAS_LIMIT.toString(),
      ),
    );
  }

  return maxAmount.greaterThan(ZERO)
    ? maxAmount
    : JettonAmount.fromRawAmount(jettonAmount.jetton, 0);
}
