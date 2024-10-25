import { gql } from '@apollo/client';

export const DEX_DATA_FRAGMENT = gql`
  fragment DexDataFields on DexData {
    time
    poolCount
    txCount
    tonPriceUsd
    totalFeesTon
    totalFeesUsd
    totalValueLockedTon
    totalValueLockedUsd
    totalVolumeTon
    totalVolumeUsd
  }
`;

export const DEX_DATA = gql`
  query DexData($from: Date!, $to: Date!, $groupBy: GroupBy!) {
    dexData(from: $from, to: $to, groupBy: $groupBy) {
      ...DexDataFields
    }
  }
`;
