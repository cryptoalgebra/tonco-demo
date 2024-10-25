import { gql } from '@apollo/client';

export const POSITION_FRAGMENT = gql`
  fragment PositionFields on Position {
    id
    owner
    pool
    jetton0 {
      ...JettonFields
    }
    jetton1 {
      ...JettonFields
    }
    tickLower
    tickUpper
    liquidity
    nftAddress
    nftImage
    feeGrowthInside0LastX128
    feeGrowthInside1LastX128
  }
`;

export const ALL_POSITIONS = gql`
  query AllPositions($owner: String!, $pool: String!) {
    positions(where: { owner: $owner, pool: $pool }) {
      ...PositionFields
    }
  }
`;
