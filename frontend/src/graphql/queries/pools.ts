import { gql } from '@apollo/client';

export const POOL_FRAGMENT = gql`
  fragment PoolFields on Pool {
    address
    name
    positionsCount
    jetton0 {
      address
      symbol
      name
      decimals
      image
      description
    }
    jetton1 {
      address
      symbol
      name
      decimals
      image
      description
    }
    creationUnix
    adminAddress
    lastUpdateTime
    isInitialized
    poolInfo
    fee
    liquidity
    tick
    tickSpacing
    priceSqrt
    feeGrowthGlobal0X128
    feeGrowthGlobal1X128
    jetton0Price
    jetton1Price
    volumeJetton0
    volumeJetton1
    volumeUsd
    feesUsd
    txCount
    collectedFeesJetton0
    collectedFeesJetton1
    collectedFeesUsd
    totalValueLockedJetton0
    totalValueLockedJetton1
    totalValueLockedUsd
    totalValueLockedTon
  }
`;

export const POOL_DATA_FRAGMENT = gql`
  fragment PoolDataFields on PoolData {
    unix
    poolInfo
    fee
    liquidity
    tick
    tickSpacing
    priceSqrt
    feeGrowthGlobal0X128
    feeGrowthGlobal1X128
    jetton0Price
    jetton1Price
    volumeJetton0
    volumeJetton1
    volumeUsd
    feesUsd
    txCount
    collectedFeesJetton0
    collectedFeesJetton1
    collectedFeesUsd
    totalValueLockedJetton0
    totalValueLockedJetton1
    totalValueLockedUsd
    totalValueLockedTon
  }
`;

export const SINGLE_POOL = gql`
  query Pool($poolAddress: String!) {
    pools(where: { address: $poolAddress }) {
      ...PoolFields
    }
  }
`;

export const POOLS_BY_JETTON = gql`
  query PoolsByJetton($jettonAddress: String!) {
    pools(where: { jetton0: $jettonAddress }) {
      ...PoolFields
    }
  }
`;

export const ALL_POOLS = gql`
  query AllPools {
    pools {
      ...PoolFields
    }
  }
`;

export const POOL_DATA = gql`
  query GetPoolData(
    $poolDataId: String!
    $from: Date!
    $to: Date!
    $groupBy: GroupBy!
  ) {
    poolData(id: $poolDataId, from: $from, to: $to, groupBy: $groupBy) {
      ...PoolDataFields
    }
  }
`;
