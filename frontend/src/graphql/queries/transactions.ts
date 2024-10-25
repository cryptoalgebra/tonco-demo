import { gql } from '@apollo/client';

export const MINT_TRANSACTIONS = gql`
  query GetMints($where: MintWhere) {
    mints(where: $where) {
      hash
      time
      pool {
        address
        jetton0 {
          address
          symbol
          decimals
        }
        jetton1 {
          address
          symbol
          decimals
        }
      }
      feeGrowthInside0X128
      feeGrowthInside1X128
      amount0
      amount1
      liquidity
      wallet: recipient
      tickLower
      tickUpper
    }
  }
`;

export const SWAP_TRANSACTIONS = gql`
  query GetSwaps($where: SwapWhere) {
    swaps(where: $where) {
      toRefund1
      toRefund0
      to
      time
      sqrtPriceLimitX96
      pool {
        address
        jetton0 {
          address
          symbol
          decimals
        }
        jetton1 {
          address
          symbol
          decimals
        }
      }
      hash
      wallet: from
      amount
    }
  }
`;

export const BURN_TRANSACTIONS = gql`
  query GetBurns($where: BurnWhere) {
    burns(where: $where) {
      time
      tickUpper
      tickLower
      wallet: recipient
      positionId
      pool {
        address
        jetton0 {
          address
          symbol
          decimals
        }
        jetton1 {
          address
          symbol
          decimals
        }
      }
      liquidity2Burn
      liquidity
      hash
      feeGrowthInside1LastX128
      feeGrowthInside0LastX128
      amount1
      amount0
    }
  }
`;

export const COLLECT_TRANSACTIONS = gql`
  query GetCollects($where: CollectWhere) {
    collects(where: $where) {
      time
      wallet: recipient
      positionId
      pool {
        address
        jetton0 {
          address
          symbol
          decimals
        }
        jetton1 {
          address
          symbol
          decimals
        }
      }
      hash
      feeGrowthInside1LastX128
      feeGrowthInside0LastX128
      amount1
      amount0
    }
  }
`;
