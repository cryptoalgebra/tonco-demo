import { gql } from '@apollo/client';

export const JETTON_FRAGMENT = gql`
  fragment JettonFields on Jetton {
    address
    symbol
    name
    decimals
    image
    description
    derivedTon
    feesUsd
    totalSupply
    totalValueLocked
    totalValueLockedUsd
    txCount
    volume
    volumeUsd
  }
`;

export const JETTON_DATA_FRAGMENT = gql`
  fragment JettonDataFields on JettonData {
    derivedTon
    feesUsd
    jettonInfo
    time
    totalSupply
    totalValueLocked
    totalValueLockedUsd
    txCount
    volume
    volumeUsd
  }
`;

export const SINGLE_JETTON = gql`
  query Jettons($where: JettonWhere) {
    jettons(where: $where) {
      ...JettonFields
    }
  }
`;

export const ALL_JETTONS = gql`
  query AllJettons {
    jettons {
      ...JettonFields
    }
  }
`;

export const JETTON_DATA = gql`
  query GetJettonData(
    $jettonDataId: String!
    $from: Date!
    $to: Date!
    $groupBy: GroupBy!
  ) {
    jettonData(id: $jettonDataId, from: $from, to: $to, groupBy: $groupBy) {
      ...JettonDataFields
    }
  }
`;
