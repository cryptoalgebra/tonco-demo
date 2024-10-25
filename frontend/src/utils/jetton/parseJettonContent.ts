import { Cell } from '@ton/core';
import { displayContentCell, Jetton } from '@toncodex/sdk';

export function parseJettonContent(
  jettonMinterAddress: string,
  content: Cell,
): Jetton {
  const jettonMetadata = displayContentCell(content);

  if (!jettonMetadata) throw new Error('Jetton metadata not found');

  return new Jetton(
    jettonMinterAddress,
    Number(jettonMetadata.decimals),
    jettonMetadata.symbol,
    jettonMetadata.name,
    jettonMetadata.image,
  );
}
