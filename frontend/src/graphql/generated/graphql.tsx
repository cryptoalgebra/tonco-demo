import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: any; output: any };
};

export type Burn = {
  __typename?: 'Burn';
  amount0: Scalars['String']['output'];
  amount1: Scalars['String']['output'];
  feeGrowthInside0LastX128: Scalars['String']['output'];
  feeGrowthInside1LastX128: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  liquidity: Scalars['String']['output'];
  liquidity2Burn: Scalars['String']['output'];
  pool: Pool;
  positionId: Scalars['Int']['output'];
  recipient: Scalars['String']['output'];
  tickLower: Scalars['Int']['output'];
  tickUpper: Scalars['Int']['output'];
  time: Scalars['Date']['output'];
};

export type BurnWhere = {
  amount0?: InputMaybe<Scalars['String']['input']>;
  amount1?: InputMaybe<Scalars['String']['input']>;
  feeGrowthInside0LastX128?: InputMaybe<Scalars['String']['input']>;
  feeGrowthInside1LastX128?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  liquidity?: InputMaybe<Scalars['String']['input']>;
  liquidity2Burn?: InputMaybe<Scalars['String']['input']>;
  pool?: InputMaybe<Scalars['String']['input']>;
  positionId?: InputMaybe<Scalars['Int']['input']>;
  recipient?: InputMaybe<Scalars['String']['input']>;
  tickLower?: InputMaybe<Scalars['Int']['input']>;
  tickUpper?: InputMaybe<Scalars['Int']['input']>;
  time?: InputMaybe<Scalars['Date']['input']>;
};

export type Collect = {
  __typename?: 'Collect';
  amount0: Scalars['String']['output'];
  amount1: Scalars['String']['output'];
  feeGrowthInside0LastX128: Scalars['String']['output'];
  feeGrowthInside1LastX128: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  pool: Pool;
  positionId: Scalars['Int']['output'];
  recipient: Scalars['String']['output'];
  time: Scalars['Date']['output'];
};

export type CollectWhere = {
  amount0?: InputMaybe<Scalars['String']['input']>;
  amount1?: InputMaybe<Scalars['String']['input']>;
  feeGrowthInside0LastX128?: InputMaybe<Scalars['String']['input']>;
  feeGrowthInside1LastX128?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  pool?: InputMaybe<Scalars['String']['input']>;
  positionId?: InputMaybe<Scalars['Int']['input']>;
  recipient?: InputMaybe<Scalars['String']['input']>;
  time?: InputMaybe<Scalars['Date']['input']>;
};

export type Comparisons = {
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
};

export type DexData = {
  __typename?: 'DexData';
  poolCount: Scalars['Int']['output'];
  time: Scalars['Date']['output'];
  tonPriceUsd: Scalars['Float']['output'];
  totalFeesTon: Scalars['Float']['output'];
  totalFeesUsd: Scalars['Float']['output'];
  totalValueLockedTon: Scalars['Float']['output'];
  totalValueLockedUsd: Scalars['Float']['output'];
  totalVolumeTon: Scalars['Float']['output'];
  totalVolumeUsd: Scalars['Float']['output'];
  txCount: Scalars['Int']['output'];
};

export type DexDataWhere = {
  poolCount?: InputMaybe<Scalars['Int']['input']>;
  time?: InputMaybe<Scalars['Date']['input']>;
  tonPriceUsd?: InputMaybe<Scalars['Float']['input']>;
  totalFeesTon?: InputMaybe<Scalars['Float']['input']>;
  totalFeesUsd?: InputMaybe<Scalars['Float']['input']>;
  totalValueLockedTon?: InputMaybe<Scalars['Float']['input']>;
  totalValueLockedUsd?: InputMaybe<Scalars['Float']['input']>;
  totalVolumeTon?: InputMaybe<Scalars['Float']['input']>;
  totalVolumeUsd?: InputMaybe<Scalars['Float']['input']>;
  txCount?: InputMaybe<Scalars['Int']['input']>;
};

export type DistributorClaim = {
  __typename?: 'DistributorClaim';
  farmingId: Scalars['String']['output'];
  fwdAmount: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  jettonAmount: Scalars['String']['output'];
  positionId: Scalars['String']['output'];
  time: Scalars['Date']['output'];
  toWallet: Scalars['String']['output'];
};

export type DistributorClaimWhere = {
  farmingId?: InputMaybe<Scalars['String']['input']>;
  fwdAmount?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  index?: InputMaybe<Scalars['Int']['input']>;
  jettonAmount?: InputMaybe<Scalars['String']['input']>;
  positionId?: InputMaybe<Scalars['String']['input']>;
  time?: InputMaybe<Comparisons>;
  toWallet?: InputMaybe<Scalars['String']['input']>;
};

export type Filter = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};

export enum GroupBy {
  Day = 'DAY',
  Month = 'MONTH',
  Year = 'YEAR',
}

export type Jetton = {
  __typename?: 'Jetton';
  address: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  derivedTon: Scalars['Float']['output'];
  description: Scalars['String']['output'];
  feesUsd: Scalars['Float']['output'];
  image: Scalars['String']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  totalSupply: Scalars['Float']['output'];
  totalValueLocked: Scalars['Float']['output'];
  totalValueLockedUsd: Scalars['Float']['output'];
  txCount: Scalars['Int']['output'];
  volume: Scalars['Float']['output'];
  volumeUsd: Scalars['Float']['output'];
  wallet: Scalars['String']['output'];
};

export type JettonData = {
  __typename?: 'JettonData';
  derivedTon: Scalars['Float']['output'];
  feesUsd: Scalars['Float']['output'];
  jettonInfo: Scalars['String']['output'];
  time: Scalars['Date']['output'];
  totalSupply: Scalars['Float']['output'];
  totalValueLocked: Scalars['Float']['output'];
  totalValueLockedUsd: Scalars['Float']['output'];
  txCount: Scalars['Int']['output'];
  volume: Scalars['Float']['output'];
  volumeUsd: Scalars['Float']['output'];
};

export type JettonDataWhere = {
  derivedTon?: InputMaybe<Scalars['Float']['input']>;
  feesUsd?: InputMaybe<Scalars['Float']['input']>;
  jettonInfo?: InputMaybe<Scalars['String']['input']>;
  time?: InputMaybe<Scalars['Date']['input']>;
  totalSupply?: InputMaybe<Scalars['Float']['input']>;
  totalValueLocked?: InputMaybe<Scalars['Float']['input']>;
  totalValueLockedUsd?: InputMaybe<Scalars['Float']['input']>;
  txCount?: InputMaybe<Scalars['Int']['input']>;
  volume?: InputMaybe<Scalars['Float']['input']>;
  volumeUsd?: InputMaybe<Scalars['Float']['input']>;
};

export type JettonWhere = {
  address?: InputMaybe<Scalars['String']['input']>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  wallet?: InputMaybe<Scalars['String']['input']>;
};

export type Meta = {
  __typename?: 'Meta';
  initTime: Scalars['Date']['output'];
  lastPoolsUpdateTime: Scalars['Date']['output'];
  lastPriceUpdateTime: Scalars['Date']['output'];
};

export type Mint = {
  __typename?: 'Mint';
  amount0: Scalars['String']['output'];
  amount1: Scalars['String']['output'];
  feeGrowthInside0X128: Scalars['String']['output'];
  feeGrowthInside1X128: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  liquidity: Scalars['String']['output'];
  pool: Pool;
  recipient: Scalars['String']['output'];
  tickLower: Scalars['Int']['output'];
  tickUpper: Scalars['Int']['output'];
  time: Scalars['Date']['output'];
};

export type MintWhere = {
  amount0?: InputMaybe<Scalars['String']['input']>;
  amount1?: InputMaybe<Scalars['String']['input']>;
  feeGrowthInside0X128?: InputMaybe<Scalars['String']['input']>;
  feeGrowthInside1X128?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  liquidity?: InputMaybe<Scalars['String']['input']>;
  pool?: InputMaybe<Scalars['String']['input']>;
  recipient?: InputMaybe<Scalars['String']['input']>;
  tickLower?: InputMaybe<Scalars['Int']['input']>;
  tickUpper?: InputMaybe<Scalars['Int']['input']>;
  time?: InputMaybe<Scalars['Date']['input']>;
};

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type Pool = {
  __typename?: 'Pool';
  address: Scalars['String']['output'];
  adminAddress: Scalars['String']['output'];
  collectedFeesJetton0: Scalars['Float']['output'];
  collectedFeesJetton1: Scalars['Float']['output'];
  collectedFeesUsd: Scalars['Float']['output'];
  creationUnix: Scalars['Int']['output'];
  fee: Scalars['Int']['output'];
  feeGrowthGlobal0X128: Scalars['String']['output'];
  feeGrowthGlobal1X128: Scalars['String']['output'];
  feesUsd: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  isInitialized: Scalars['Boolean']['output'];
  jetton0: Jetton;
  jetton0Price: Scalars['Float']['output'];
  jetton1: Jetton;
  jetton1Price: Scalars['Float']['output'];
  lastUpdateTime: Scalars['Date']['output'];
  liquidity: Scalars['String']['output'];
  name: Scalars['String']['output'];
  poolInfo: Scalars['String']['output'];
  positionsCount: Scalars['Int']['output'];
  priceSqrt: Scalars['String']['output'];
  tick: Scalars['Int']['output'];
  tickSpacing: Scalars['Int']['output'];
  totalValueLockedJetton0: Scalars['Float']['output'];
  totalValueLockedJetton1: Scalars['Float']['output'];
  totalValueLockedTon: Scalars['Float']['output'];
  totalValueLockedUsd: Scalars['Float']['output'];
  txCount: Scalars['Int']['output'];
  unix: Scalars['Date']['output'];
  volumeJetton0: Scalars['Float']['output'];
  volumeJetton1: Scalars['Float']['output'];
  volumeUsd: Scalars['Float']['output'];
};

export type PoolData = {
  __typename?: 'PoolData';
  collectedFeesJetton0: Scalars['Float']['output'];
  collectedFeesJetton1: Scalars['Float']['output'];
  collectedFeesUsd: Scalars['Float']['output'];
  fee: Scalars['Int']['output'];
  feeGrowthGlobal0X128: Scalars['String']['output'];
  feeGrowthGlobal1X128: Scalars['String']['output'];
  feesUsd: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  jetton0Price: Scalars['Float']['output'];
  jetton1Price: Scalars['Float']['output'];
  liquidity: Scalars['String']['output'];
  poolInfo: Scalars['String']['output'];
  positionsCount: Scalars['Int']['output'];
  priceSqrt: Scalars['String']['output'];
  tick: Scalars['Int']['output'];
  tickSpacing: Scalars['Int']['output'];
  totalValueLockedJetton0: Scalars['Float']['output'];
  totalValueLockedJetton1: Scalars['Float']['output'];
  totalValueLockedTon: Scalars['Float']['output'];
  totalValueLockedUsd: Scalars['Float']['output'];
  txCount: Scalars['Int']['output'];
  unix: Scalars['Date']['output'];
  volumeJetton0: Scalars['Float']['output'];
  volumeJetton1: Scalars['Float']['output'];
  volumeUsd: Scalars['Float']['output'];
};

export type PoolDataWhere = {
  collectedFeesJetton0?: InputMaybe<Scalars['Float']['input']>;
  collectedFeesJetton1?: InputMaybe<Scalars['Float']['input']>;
  collectedFeesUsd?: InputMaybe<Scalars['Float']['input']>;
  fee?: InputMaybe<Scalars['Int']['input']>;
  feeGrowthGlobal0X128?: InputMaybe<Scalars['String']['input']>;
  feeGrowthGlobal1X128?: InputMaybe<Scalars['String']['input']>;
  feesUsd?: InputMaybe<Scalars['Float']['input']>;
  jetton0Price?: InputMaybe<Scalars['Float']['input']>;
  jetton1Price?: InputMaybe<Scalars['Float']['input']>;
  liquidity?: InputMaybe<Scalars['String']['input']>;
  poolInfo?: InputMaybe<Scalars['String']['input']>;
  priceSqrt?: InputMaybe<Scalars['String']['input']>;
  tick?: InputMaybe<Scalars['Int']['input']>;
  totalValueLockedJetton0?: InputMaybe<Scalars['Float']['input']>;
  totalValueLockedJetton1?: InputMaybe<Scalars['Float']['input']>;
  totalValueLockedTon?: InputMaybe<Scalars['Float']['input']>;
  totalValueLockedUsd?: InputMaybe<Scalars['Float']['input']>;
  txCount?: InputMaybe<Scalars['Int']['input']>;
  unix?: InputMaybe<Scalars['Date']['input']>;
  volumeJetton0?: InputMaybe<Scalars['Float']['input']>;
  volumeJetton1?: InputMaybe<Scalars['Float']['input']>;
  volumeUsd?: InputMaybe<Scalars['Float']['input']>;
};

export type PoolWhere = {
  address?: InputMaybe<Scalars['String']['input']>;
  adminAddress?: InputMaybe<Scalars['String']['input']>;
  creationUnix?: InputMaybe<Scalars['Int']['input']>;
  isInitialized?: InputMaybe<Scalars['Boolean']['input']>;
  jetton0?: InputMaybe<Scalars['String']['input']>;
  jetton1?: InputMaybe<Scalars['String']['input']>;
  lastUpdateTime?: InputMaybe<Scalars['Date']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Position = {
  __typename?: 'Position';
  collectedFeesJetton0: Scalars['String']['output'];
  collectedFeesJetton1: Scalars['String']['output'];
  collectedJetton0: Scalars['String']['output'];
  collectedJetton1: Scalars['String']['output'];
  depositedJetton0: Scalars['String']['output'];
  depositedJetton1: Scalars['String']['output'];
  feeGrowthInside0LastX128: Scalars['String']['output'];
  feeGrowthInside1LastX128: Scalars['String']['output'];
  id: Scalars['String']['output'];
  jetton0: Jetton;
  jetton1: Jetton;
  liquidity: Scalars['String']['output'];
  nftAddress: Scalars['String']['output'];
  nftImage: Scalars['String']['output'];
  owner: Scalars['String']['output'];
  pool: Scalars['String']['output'];
  tickLower: Scalars['Int']['output'];
  tickUpper: Scalars['Int']['output'];
  withdrawnJetton0: Scalars['String']['output'];
  withdrawnJetton1: Scalars['String']['output'];
};

export type PositionData = {
  __typename?: 'PositionData';
  collectedFeesJetton0: Scalars['String']['output'];
  collectedFeesJetton1: Scalars['String']['output'];
  collectedJetton0: Scalars['String']['output'];
  collectedJetton1: Scalars['String']['output'];
  depositedJetton0: Scalars['String']['output'];
  depositedJetton1: Scalars['String']['output'];
  feeGrowthInside0LastX128: Scalars['String']['output'];
  feeGrowthInside1LastX128: Scalars['String']['output'];
  liquidity: Scalars['String']['output'];
  positionInfo: Scalars['Int']['output'];
  tickLower: Scalars['Int']['output'];
  tickUpper: Scalars['Int']['output'];
  time: Scalars['Date']['output'];
  totalValueLockedJetton0: Scalars['Float']['output'];
  totalValueLockedJetton1: Scalars['Float']['output'];
  withdrawnJetton0: Scalars['String']['output'];
  withdrawnJetton1: Scalars['String']['output'];
};

export type PositionDataWhere = {
  collectedFeesJetton0?: InputMaybe<Scalars['Float']['input']>;
  collectedFeesJetton1?: InputMaybe<Scalars['Float']['input']>;
  collectedJetton0?: InputMaybe<Scalars['Float']['input']>;
  collectedJetton1?: InputMaybe<Scalars['Float']['input']>;
  depositedJetton0?: InputMaybe<Scalars['Float']['input']>;
  depositedJetton1?: InputMaybe<Scalars['Float']['input']>;
  feeGrowthInside0LastX128?: InputMaybe<Scalars['String']['input']>;
  feeGrowthInside1LastX128?: InputMaybe<Scalars['String']['input']>;
  liquidity?: InputMaybe<Scalars['String']['input']>;
  positionInfo?: InputMaybe<Scalars['Int']['input']>;
  tickLower?: InputMaybe<Scalars['Int']['input']>;
  tickUpper?: InputMaybe<Scalars['Int']['input']>;
  time?: InputMaybe<Scalars['Date']['input']>;
  totalValueLockedJetton0?: InputMaybe<Scalars['Float']['input']>;
  totalValueLockedJetton1?: InputMaybe<Scalars['Float']['input']>;
  withdrawnJetton0?: InputMaybe<Scalars['Float']['input']>;
  withdrawnJetton1?: InputMaybe<Scalars['Float']['input']>;
};

export type PositionWhere = {
  feeGrowthInside0LastX128?: InputMaybe<Scalars['String']['input']>;
  feeGrowthInside1LastX128?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  jetton0?: InputMaybe<Scalars['String']['input']>;
  jetton1?: InputMaybe<Scalars['String']['input']>;
  nftAddress?: InputMaybe<Scalars['String']['input']>;
  nftImage?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  pool?: InputMaybe<Scalars['String']['input']>;
  tickLower?: InputMaybe<Scalars['Int']['input']>;
  tickUpper?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  burns?: Maybe<Array<Maybe<Burn>>>;
  collects?: Maybe<Array<Maybe<Collect>>>;
  dexData?: Maybe<Array<Maybe<DexData>>>;
  distributorClaims?: Maybe<Array<Maybe<DistributorClaim>>>;
  jettonData?: Maybe<Array<Maybe<JettonData>>>;
  jettons?: Maybe<Array<Maybe<Jetton>>>;
  meta?: Maybe<Array<Maybe<Meta>>>;
  mints?: Maybe<Array<Maybe<Mint>>>;
  poolData?: Maybe<Array<Maybe<PoolData>>>;
  pools?: Maybe<Array<Maybe<Pool>>>;
  positionData?: Maybe<Array<Maybe<PositionData>>>;
  positions?: Maybe<Array<Maybe<Position>>>;
  swaps?: Maybe<Array<Maybe<Swap>>>;
  uninitializedPools?: Maybe<Array<Maybe<UninitializedPool>>>;
};

export type QueryBurnsArgs = {
  filter?: InputMaybe<Filter>;
  where?: InputMaybe<BurnWhere>;
};

export type QueryCollectsArgs = {
  filter?: InputMaybe<Filter>;
  where?: InputMaybe<CollectWhere>;
};

export type QueryDexDataArgs = {
  from: Scalars['Date']['input'];
  groupBy: GroupBy;
  to: Scalars['Date']['input'];
};

export type QueryDistributorClaimsArgs = {
  filter?: InputMaybe<Filter>;
  where?: InputMaybe<DistributorClaimWhere>;
};

export type QueryJettonDataArgs = {
  from: Scalars['Date']['input'];
  groupBy: GroupBy;
  id: Scalars['String']['input'];
  to: Scalars['Date']['input'];
};

export type QueryJettonsArgs = {
  filter?: InputMaybe<Filter>;
  where?: InputMaybe<JettonWhere>;
};

export type QueryMintsArgs = {
  filter?: InputMaybe<Filter>;
  where?: InputMaybe<MintWhere>;
};

export type QueryPoolDataArgs = {
  from: Scalars['Date']['input'];
  groupBy: GroupBy;
  id: Scalars['String']['input'];
  to: Scalars['Date']['input'];
};

export type QueryPoolsArgs = {
  filter?: InputMaybe<Filter>;
  where?: InputMaybe<PoolWhere>;
};

export type QueryPositionDataArgs = {
  from: Scalars['Date']['input'];
  groupBy: GroupBy;
  id: Scalars['Int']['input'];
  to: Scalars['Date']['input'];
};

export type QueryPositionsArgs = {
  filter?: InputMaybe<Filter>;
  where?: InputMaybe<PositionWhere>;
};

export type QuerySwapsArgs = {
  filter?: InputMaybe<Filter>;
  where?: InputMaybe<SwapWhere>;
};

export type QueryUninitializedPoolsArgs = {
  filter?: InputMaybe<Filter>;
  where?: InputMaybe<UninitializedPoolWhere>;
};

export type Swap = {
  __typename?: 'Swap';
  amount: Scalars['Float']['output'];
  from: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  jetton0: Jetton;
  jetton1: Jetton;
  pool: Pool;
  sqrtPriceLimitX96: Scalars['String']['output'];
  time: Scalars['Date']['output'];
  to: Scalars['String']['output'];
  toRefund0: Scalars['String']['output'];
  toRefund1: Scalars['String']['output'];
};

export type SwapWhere = {
  amount?: InputMaybe<Scalars['Int']['input']>;
  from?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  jetton0?: InputMaybe<Scalars['String']['input']>;
  jetton1?: InputMaybe<Scalars['String']['input']>;
  pool?: InputMaybe<Scalars['String']['input']>;
  sqrtPriceLimitX96?: InputMaybe<Scalars['String']['input']>;
  time?: InputMaybe<Scalars['Date']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
  toRefund0?: InputMaybe<Scalars['String']['input']>;
  toRefund1?: InputMaybe<Scalars['String']['input']>;
};

export type UninitializedPool = {
  __typename?: 'UninitializedPool';
  address: Scalars['String']['output'];
  adminAddress: Scalars['String']['output'];
  cretationUnix: Scalars['Int']['output'];
  jettonWallet0: Scalars['String']['output'];
  jettonWallet1: Scalars['String']['output'];
  lastCheckTime: Scalars['Date']['output'];
};

export type UninitializedPoolWhere = {
  address?: InputMaybe<Scalars['String']['input']>;
  adminAddress?: InputMaybe<Scalars['String']['input']>;
  cretationUnix?: InputMaybe<Scalars['Int']['input']>;
  jettonWallet0?: InputMaybe<Scalars['String']['input']>;
  jettonWallet1?: InputMaybe<Scalars['String']['input']>;
  lastCheckTime?: InputMaybe<Scalars['Date']['input']>;
};

export type DexDataFieldsFragment = {
  __typename?: 'DexData';
  time: any;
  poolCount: number;
  txCount: number;
  tonPriceUsd: number;
  totalFeesTon: number;
  totalFeesUsd: number;
  totalValueLockedTon: number;
  totalValueLockedUsd: number;
  totalVolumeTon: number;
  totalVolumeUsd: number;
};

export type DexDataQueryVariables = Exact<{
  from: Scalars['Date']['input'];
  to: Scalars['Date']['input'];
  groupBy: GroupBy;
}>;

export type DexDataQuery = {
  __typename?: 'Query';
  dexData?: Array<{
    __typename?: 'DexData';
    time: any;
    poolCount: number;
    txCount: number;
    tonPriceUsd: number;
    totalFeesTon: number;
    totalFeesUsd: number;
    totalValueLockedTon: number;
    totalValueLockedUsd: number;
    totalVolumeTon: number;
    totalVolumeUsd: number;
  } | null> | null;
};

export type JettonFieldsFragment = {
  __typename?: 'Jetton';
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  image: string;
  description: string;
  derivedTon: number;
  feesUsd: number;
  totalSupply: number;
  totalValueLocked: number;
  totalValueLockedUsd: number;
  txCount: number;
  volume: number;
  volumeUsd: number;
};

export type JettonDataFieldsFragment = {
  __typename?: 'JettonData';
  derivedTon: number;
  feesUsd: number;
  jettonInfo: string;
  time: any;
  totalSupply: number;
  totalValueLocked: number;
  totalValueLockedUsd: number;
  txCount: number;
  volume: number;
  volumeUsd: number;
};

export type JettonsQueryVariables = Exact<{
  where?: InputMaybe<JettonWhere>;
}>;

export type JettonsQuery = {
  __typename?: 'Query';
  jettons?: Array<{
    __typename?: 'Jetton';
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    image: string;
    description: string;
    derivedTon: number;
    feesUsd: number;
    totalSupply: number;
    totalValueLocked: number;
    totalValueLockedUsd: number;
    txCount: number;
    volume: number;
    volumeUsd: number;
  } | null> | null;
};

export type AllJettonsQueryVariables = Exact<{ [key: string]: never }>;

export type AllJettonsQuery = {
  __typename?: 'Query';
  jettons?: Array<{
    __typename?: 'Jetton';
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    image: string;
    description: string;
    derivedTon: number;
    feesUsd: number;
    totalSupply: number;
    totalValueLocked: number;
    totalValueLockedUsd: number;
    txCount: number;
    volume: number;
    volumeUsd: number;
  } | null> | null;
};

export type GetJettonDataQueryVariables = Exact<{
  jettonDataId: Scalars['String']['input'];
  from: Scalars['Date']['input'];
  to: Scalars['Date']['input'];
  groupBy: GroupBy;
}>;

export type GetJettonDataQuery = {
  __typename?: 'Query';
  jettonData?: Array<{
    __typename?: 'JettonData';
    derivedTon: number;
    feesUsd: number;
    jettonInfo: string;
    time: any;
    totalSupply: number;
    totalValueLocked: number;
    totalValueLockedUsd: number;
    txCount: number;
    volume: number;
    volumeUsd: number;
  } | null> | null;
};

export type PoolFieldsFragment = {
  __typename?: 'Pool';
  address: string;
  name: string;
  positionsCount: number;
  creationUnix: number;
  adminAddress: string;
  lastUpdateTime: any;
  isInitialized: boolean;
  poolInfo: string;
  fee: number;
  liquidity: string;
  tick: number;
  tickSpacing: number;
  priceSqrt: string;
  feeGrowthGlobal0X128: string;
  feeGrowthGlobal1X128: string;
  jetton0Price: number;
  jetton1Price: number;
  volumeJetton0: number;
  volumeJetton1: number;
  volumeUsd: number;
  feesUsd: number;
  txCount: number;
  collectedFeesJetton0: number;
  collectedFeesJetton1: number;
  collectedFeesUsd: number;
  totalValueLockedJetton0: number;
  totalValueLockedJetton1: number;
  totalValueLockedUsd: number;
  totalValueLockedTon: number;
  jetton0: {
    __typename?: 'Jetton';
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    image: string;
    description: string;
  };
  jetton1: {
    __typename?: 'Jetton';
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    image: string;
    description: string;
  };
};

export type PoolDataFieldsFragment = {
  __typename?: 'PoolData';
  unix: any;
  poolInfo: string;
  fee: number;
  liquidity: string;
  tick: number;
  tickSpacing: number;
  priceSqrt: string;
  feeGrowthGlobal0X128: string;
  feeGrowthGlobal1X128: string;
  jetton0Price: number;
  jetton1Price: number;
  volumeJetton0: number;
  volumeJetton1: number;
  volumeUsd: number;
  feesUsd: number;
  txCount: number;
  collectedFeesJetton0: number;
  collectedFeesJetton1: number;
  collectedFeesUsd: number;
  totalValueLockedJetton0: number;
  totalValueLockedJetton1: number;
  totalValueLockedUsd: number;
  totalValueLockedTon: number;
};

export type PoolQueryVariables = Exact<{
  poolAddress: Scalars['String']['input'];
}>;

export type PoolQuery = {
  __typename?: 'Query';
  pools?: Array<{
    __typename?: 'Pool';
    address: string;
    name: string;
    positionsCount: number;
    creationUnix: number;
    adminAddress: string;
    lastUpdateTime: any;
    isInitialized: boolean;
    poolInfo: string;
    fee: number;
    liquidity: string;
    tick: number;
    tickSpacing: number;
    priceSqrt: string;
    feeGrowthGlobal0X128: string;
    feeGrowthGlobal1X128: string;
    jetton0Price: number;
    jetton1Price: number;
    volumeJetton0: number;
    volumeJetton1: number;
    volumeUsd: number;
    feesUsd: number;
    txCount: number;
    collectedFeesJetton0: number;
    collectedFeesJetton1: number;
    collectedFeesUsd: number;
    totalValueLockedJetton0: number;
    totalValueLockedJetton1: number;
    totalValueLockedUsd: number;
    totalValueLockedTon: number;
    jetton0: {
      __typename?: 'Jetton';
      address: string;
      symbol: string;
      name: string;
      decimals: number;
      image: string;
      description: string;
    };
    jetton1: {
      __typename?: 'Jetton';
      address: string;
      symbol: string;
      name: string;
      decimals: number;
      image: string;
      description: string;
    };
  } | null> | null;
};

export type PoolsByJettonQueryVariables = Exact<{
  jettonAddress: Scalars['String']['input'];
}>;

export type PoolsByJettonQuery = {
  __typename?: 'Query';
  pools?: Array<{
    __typename?: 'Pool';
    address: string;
    name: string;
    positionsCount: number;
    creationUnix: number;
    adminAddress: string;
    lastUpdateTime: any;
    isInitialized: boolean;
    poolInfo: string;
    fee: number;
    liquidity: string;
    tick: number;
    tickSpacing: number;
    priceSqrt: string;
    feeGrowthGlobal0X128: string;
    feeGrowthGlobal1X128: string;
    jetton0Price: number;
    jetton1Price: number;
    volumeJetton0: number;
    volumeJetton1: number;
    volumeUsd: number;
    feesUsd: number;
    txCount: number;
    collectedFeesJetton0: number;
    collectedFeesJetton1: number;
    collectedFeesUsd: number;
    totalValueLockedJetton0: number;
    totalValueLockedJetton1: number;
    totalValueLockedUsd: number;
    totalValueLockedTon: number;
    jetton0: {
      __typename?: 'Jetton';
      address: string;
      symbol: string;
      name: string;
      decimals: number;
      image: string;
      description: string;
    };
    jetton1: {
      __typename?: 'Jetton';
      address: string;
      symbol: string;
      name: string;
      decimals: number;
      image: string;
      description: string;
    };
  } | null> | null;
};

export type AllPoolsQueryVariables = Exact<{ [key: string]: never }>;

export type AllPoolsQuery = {
  __typename?: 'Query';
  pools?: Array<{
    __typename?: 'Pool';
    address: string;
    name: string;
    positionsCount: number;
    creationUnix: number;
    adminAddress: string;
    lastUpdateTime: any;
    isInitialized: boolean;
    poolInfo: string;
    fee: number;
    liquidity: string;
    tick: number;
    tickSpacing: number;
    priceSqrt: string;
    feeGrowthGlobal0X128: string;
    feeGrowthGlobal1X128: string;
    jetton0Price: number;
    jetton1Price: number;
    volumeJetton0: number;
    volumeJetton1: number;
    volumeUsd: number;
    feesUsd: number;
    txCount: number;
    collectedFeesJetton0: number;
    collectedFeesJetton1: number;
    collectedFeesUsd: number;
    totalValueLockedJetton0: number;
    totalValueLockedJetton1: number;
    totalValueLockedUsd: number;
    totalValueLockedTon: number;
    jetton0: {
      __typename?: 'Jetton';
      address: string;
      symbol: string;
      name: string;
      decimals: number;
      image: string;
      description: string;
    };
    jetton1: {
      __typename?: 'Jetton';
      address: string;
      symbol: string;
      name: string;
      decimals: number;
      image: string;
      description: string;
    };
  } | null> | null;
};

export type GetPoolDataQueryVariables = Exact<{
  poolDataId: Scalars['String']['input'];
  from: Scalars['Date']['input'];
  to: Scalars['Date']['input'];
  groupBy: GroupBy;
}>;

export type GetPoolDataQuery = {
  __typename?: 'Query';
  poolData?: Array<{
    __typename?: 'PoolData';
    unix: any;
    poolInfo: string;
    fee: number;
    liquidity: string;
    tick: number;
    tickSpacing: number;
    priceSqrt: string;
    feeGrowthGlobal0X128: string;
    feeGrowthGlobal1X128: string;
    jetton0Price: number;
    jetton1Price: number;
    volumeJetton0: number;
    volumeJetton1: number;
    volumeUsd: number;
    feesUsd: number;
    txCount: number;
    collectedFeesJetton0: number;
    collectedFeesJetton1: number;
    collectedFeesUsd: number;
    totalValueLockedJetton0: number;
    totalValueLockedJetton1: number;
    totalValueLockedUsd: number;
    totalValueLockedTon: number;
  } | null> | null;
};

export type PositionFieldsFragment = {
  __typename?: 'Position';
  id: string;
  owner: string;
  pool: string;
  tickLower: number;
  tickUpper: number;
  liquidity: string;
  nftAddress: string;
  nftImage: string;
  feeGrowthInside0LastX128: string;
  feeGrowthInside1LastX128: string;
  jetton0: {
    __typename?: 'Jetton';
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    image: string;
    description: string;
    derivedTon: number;
    feesUsd: number;
    totalSupply: number;
    totalValueLocked: number;
    totalValueLockedUsd: number;
    txCount: number;
    volume: number;
    volumeUsd: number;
  };
  jetton1: {
    __typename?: 'Jetton';
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    image: string;
    description: string;
    derivedTon: number;
    feesUsd: number;
    totalSupply: number;
    totalValueLocked: number;
    totalValueLockedUsd: number;
    txCount: number;
    volume: number;
    volumeUsd: number;
  };
};

export type AllPositionsQueryVariables = Exact<{
  owner: Scalars['String']['input'];
  pool: Scalars['String']['input'];
}>;

export type AllPositionsQuery = {
  __typename?: 'Query';
  positions?: Array<{
    __typename?: 'Position';
    id: string;
    owner: string;
    pool: string;
    tickLower: number;
    tickUpper: number;
    liquidity: string;
    nftAddress: string;
    nftImage: string;
    feeGrowthInside0LastX128: string;
    feeGrowthInside1LastX128: string;
    jetton0: {
      __typename?: 'Jetton';
      address: string;
      symbol: string;
      name: string;
      decimals: number;
      image: string;
      description: string;
      derivedTon: number;
      feesUsd: number;
      totalSupply: number;
      totalValueLocked: number;
      totalValueLockedUsd: number;
      txCount: number;
      volume: number;
      volumeUsd: number;
    };
    jetton1: {
      __typename?: 'Jetton';
      address: string;
      symbol: string;
      name: string;
      decimals: number;
      image: string;
      description: string;
      derivedTon: number;
      feesUsd: number;
      totalSupply: number;
      totalValueLocked: number;
      totalValueLockedUsd: number;
      txCount: number;
      volume: number;
      volumeUsd: number;
    };
  } | null> | null;
};

export type GetMintsQueryVariables = Exact<{
  where?: InputMaybe<MintWhere>;
}>;

export type GetMintsQuery = {
  __typename?: 'Query';
  mints?: Array<{
    __typename?: 'Mint';
    hash: string;
    time: any;
    feeGrowthInside0X128: string;
    feeGrowthInside1X128: string;
    amount0: string;
    amount1: string;
    liquidity: string;
    tickLower: number;
    tickUpper: number;
    wallet: string;
    pool: {
      __typename?: 'Pool';
      address: string;
      jetton0: {
        __typename?: 'Jetton';
        address: string;
        symbol: string;
        decimals: number;
      };
      jetton1: {
        __typename?: 'Jetton';
        address: string;
        symbol: string;
        decimals: number;
      };
    };
  } | null> | null;
};

export type GetSwapsQueryVariables = Exact<{
  where?: InputMaybe<SwapWhere>;
}>;

export type GetSwapsQuery = {
  __typename?: 'Query';
  swaps?: Array<{
    __typename?: 'Swap';
    toRefund1: string;
    toRefund0: string;
    to: string;
    time: any;
    sqrtPriceLimitX96: string;
    hash: string;
    amount: number;
    wallet: string;
    pool: {
      __typename?: 'Pool';
      address: string;
      jetton0: {
        __typename?: 'Jetton';
        address: string;
        symbol: string;
        decimals: number;
      };
      jetton1: {
        __typename?: 'Jetton';
        address: string;
        symbol: string;
        decimals: number;
      };
    };
  } | null> | null;
};

export type GetBurnsQueryVariables = Exact<{
  where?: InputMaybe<BurnWhere>;
}>;

export type GetBurnsQuery = {
  __typename?: 'Query';
  burns?: Array<{
    __typename?: 'Burn';
    time: any;
    tickUpper: number;
    tickLower: number;
    positionId: number;
    liquidity2Burn: string;
    liquidity: string;
    hash: string;
    feeGrowthInside1LastX128: string;
    feeGrowthInside0LastX128: string;
    amount1: string;
    amount0: string;
    wallet: string;
    pool: {
      __typename?: 'Pool';
      address: string;
      jetton0: {
        __typename?: 'Jetton';
        address: string;
        symbol: string;
        decimals: number;
      };
      jetton1: {
        __typename?: 'Jetton';
        address: string;
        symbol: string;
        decimals: number;
      };
    };
  } | null> | null;
};

export type GetCollectsQueryVariables = Exact<{
  where?: InputMaybe<CollectWhere>;
}>;

export type GetCollectsQuery = {
  __typename?: 'Query';
  collects?: Array<{
    __typename?: 'Collect';
    time: any;
    positionId: number;
    hash: string;
    feeGrowthInside1LastX128: string;
    feeGrowthInside0LastX128: string;
    amount1: string;
    amount0: string;
    wallet: string;
    pool: {
      __typename?: 'Pool';
      address: string;
      jetton0: {
        __typename?: 'Jetton';
        address: string;
        symbol: string;
        decimals: number;
      };
      jetton1: {
        __typename?: 'Jetton';
        address: string;
        symbol: string;
        decimals: number;
      };
    };
  } | null> | null;
};

export const DexDataFieldsFragmentDoc = gql`
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
export const JettonDataFieldsFragmentDoc = gql`
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
export const PoolFieldsFragmentDoc = gql`
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
export const PoolDataFieldsFragmentDoc = gql`
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
export const JettonFieldsFragmentDoc = gql`
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
export const PositionFieldsFragmentDoc = gql`
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
  ${JettonFieldsFragmentDoc}
`;
export const DexDataDocument = gql`
  query DexData($from: Date!, $to: Date!, $groupBy: GroupBy!) {
    dexData(from: $from, to: $to, groupBy: $groupBy) {
      ...DexDataFields
    }
  }
  ${DexDataFieldsFragmentDoc}
`;

/**
 * __useDexDataQuery__
 *
 * To run a query within a React component, call `useDexDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useDexDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDexDataQuery({
 *   variables: {
 *      from: // value for 'from'
 *      to: // value for 'to'
 *      groupBy: // value for 'groupBy'
 *   },
 * });
 */
export function useDexDataQuery(
  baseOptions: Apollo.QueryHookOptions<DexDataQuery, DexDataQueryVariables> &
    ({ variables: DexDataQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DexDataQuery, DexDataQueryVariables>(
    DexDataDocument,
    options,
  );
}
export function useDexDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DexDataQuery,
    DexDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DexDataQuery, DexDataQueryVariables>(
    DexDataDocument,
    options,
  );
}
export function useDexDataSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<DexDataQuery, DexDataQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<DexDataQuery, DexDataQueryVariables>(
    DexDataDocument,
    options,
  );
}
export type DexDataQueryHookResult = ReturnType<typeof useDexDataQuery>;
export type DexDataLazyQueryHookResult = ReturnType<typeof useDexDataLazyQuery>;
export type DexDataSuspenseQueryHookResult = ReturnType<
  typeof useDexDataSuspenseQuery
>;
export type DexDataQueryResult = Apollo.QueryResult<
  DexDataQuery,
  DexDataQueryVariables
>;
export const JettonsDocument = gql`
  query Jettons($where: JettonWhere) {
    jettons(where: $where) {
      ...JettonFields
    }
  }
  ${JettonFieldsFragmentDoc}
`;

/**
 * __useJettonsQuery__
 *
 * To run a query within a React component, call `useJettonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useJettonsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useJettonsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useJettonsQuery(
  baseOptions?: Apollo.QueryHookOptions<JettonsQuery, JettonsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<JettonsQuery, JettonsQueryVariables>(
    JettonsDocument,
    options,
  );
}
export function useJettonsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    JettonsQuery,
    JettonsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<JettonsQuery, JettonsQueryVariables>(
    JettonsDocument,
    options,
  );
}
export function useJettonsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<JettonsQuery, JettonsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<JettonsQuery, JettonsQueryVariables>(
    JettonsDocument,
    options,
  );
}
export type JettonsQueryHookResult = ReturnType<typeof useJettonsQuery>;
export type JettonsLazyQueryHookResult = ReturnType<typeof useJettonsLazyQuery>;
export type JettonsSuspenseQueryHookResult = ReturnType<
  typeof useJettonsSuspenseQuery
>;
export type JettonsQueryResult = Apollo.QueryResult<
  JettonsQuery,
  JettonsQueryVariables
>;
export const AllJettonsDocument = gql`
  query AllJettons {
    jettons {
      ...JettonFields
    }
  }
  ${JettonFieldsFragmentDoc}
`;

/**
 * __useAllJettonsQuery__
 *
 * To run a query within a React component, call `useAllJettonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllJettonsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllJettonsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllJettonsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AllJettonsQuery,
    AllJettonsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AllJettonsQuery, AllJettonsQueryVariables>(
    AllJettonsDocument,
    options,
  );
}
export function useAllJettonsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AllJettonsQuery,
    AllJettonsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AllJettonsQuery, AllJettonsQueryVariables>(
    AllJettonsDocument,
    options,
  );
}
export function useAllJettonsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AllJettonsQuery,
        AllJettonsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<AllJettonsQuery, AllJettonsQueryVariables>(
    AllJettonsDocument,
    options,
  );
}
export type AllJettonsQueryHookResult = ReturnType<typeof useAllJettonsQuery>;
export type AllJettonsLazyQueryHookResult = ReturnType<
  typeof useAllJettonsLazyQuery
>;
export type AllJettonsSuspenseQueryHookResult = ReturnType<
  typeof useAllJettonsSuspenseQuery
>;
export type AllJettonsQueryResult = Apollo.QueryResult<
  AllJettonsQuery,
  AllJettonsQueryVariables
>;
export const GetJettonDataDocument = gql`
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
  ${JettonDataFieldsFragmentDoc}
`;

/**
 * __useGetJettonDataQuery__
 *
 * To run a query within a React component, call `useGetJettonDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetJettonDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetJettonDataQuery({
 *   variables: {
 *      jettonDataId: // value for 'jettonDataId'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *      groupBy: // value for 'groupBy'
 *   },
 * });
 */
export function useGetJettonDataQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetJettonDataQuery,
    GetJettonDataQueryVariables
  > &
    (
      | { variables: GetJettonDataQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetJettonDataQuery, GetJettonDataQueryVariables>(
    GetJettonDataDocument,
    options,
  );
}
export function useGetJettonDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetJettonDataQuery,
    GetJettonDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetJettonDataQuery, GetJettonDataQueryVariables>(
    GetJettonDataDocument,
    options,
  );
}
export function useGetJettonDataSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetJettonDataQuery,
        GetJettonDataQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetJettonDataQuery,
    GetJettonDataQueryVariables
  >(GetJettonDataDocument, options);
}
export type GetJettonDataQueryHookResult = ReturnType<
  typeof useGetJettonDataQuery
>;
export type GetJettonDataLazyQueryHookResult = ReturnType<
  typeof useGetJettonDataLazyQuery
>;
export type GetJettonDataSuspenseQueryHookResult = ReturnType<
  typeof useGetJettonDataSuspenseQuery
>;
export type GetJettonDataQueryResult = Apollo.QueryResult<
  GetJettonDataQuery,
  GetJettonDataQueryVariables
>;
export const PoolDocument = gql`
  query Pool($poolAddress: String!) {
    pools(where: { address: $poolAddress }) {
      ...PoolFields
    }
  }
  ${PoolFieldsFragmentDoc}
`;

/**
 * __usePoolQuery__
 *
 * To run a query within a React component, call `usePoolQuery` and pass it any options that fit your needs.
 * When your component renders, `usePoolQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePoolQuery({
 *   variables: {
 *      poolAddress: // value for 'poolAddress'
 *   },
 * });
 */
export function usePoolQuery(
  baseOptions: Apollo.QueryHookOptions<PoolQuery, PoolQueryVariables> &
    ({ variables: PoolQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PoolQuery, PoolQueryVariables>(PoolDocument, options);
}
export function usePoolLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PoolQuery, PoolQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PoolQuery, PoolQueryVariables>(
    PoolDocument,
    options,
  );
}
export function usePoolSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<PoolQuery, PoolQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<PoolQuery, PoolQueryVariables>(
    PoolDocument,
    options,
  );
}
export type PoolQueryHookResult = ReturnType<typeof usePoolQuery>;
export type PoolLazyQueryHookResult = ReturnType<typeof usePoolLazyQuery>;
export type PoolSuspenseQueryHookResult = ReturnType<
  typeof usePoolSuspenseQuery
>;
export type PoolQueryResult = Apollo.QueryResult<PoolQuery, PoolQueryVariables>;
export const PoolsByJettonDocument = gql`
  query PoolsByJetton($jettonAddress: String!) {
    pools(where: { jetton0: $jettonAddress }) {
      ...PoolFields
    }
  }
  ${PoolFieldsFragmentDoc}
`;

/**
 * __usePoolsByJettonQuery__
 *
 * To run a query within a React component, call `usePoolsByJettonQuery` and pass it any options that fit your needs.
 * When your component renders, `usePoolsByJettonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePoolsByJettonQuery({
 *   variables: {
 *      jettonAddress: // value for 'jettonAddress'
 *   },
 * });
 */
export function usePoolsByJettonQuery(
  baseOptions: Apollo.QueryHookOptions<
    PoolsByJettonQuery,
    PoolsByJettonQueryVariables
  > &
    (
      | { variables: PoolsByJettonQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PoolsByJettonQuery, PoolsByJettonQueryVariables>(
    PoolsByJettonDocument,
    options,
  );
}
export function usePoolsByJettonLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PoolsByJettonQuery,
    PoolsByJettonQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PoolsByJettonQuery, PoolsByJettonQueryVariables>(
    PoolsByJettonDocument,
    options,
  );
}
export function usePoolsByJettonSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        PoolsByJettonQuery,
        PoolsByJettonQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    PoolsByJettonQuery,
    PoolsByJettonQueryVariables
  >(PoolsByJettonDocument, options);
}
export type PoolsByJettonQueryHookResult = ReturnType<
  typeof usePoolsByJettonQuery
>;
export type PoolsByJettonLazyQueryHookResult = ReturnType<
  typeof usePoolsByJettonLazyQuery
>;
export type PoolsByJettonSuspenseQueryHookResult = ReturnType<
  typeof usePoolsByJettonSuspenseQuery
>;
export type PoolsByJettonQueryResult = Apollo.QueryResult<
  PoolsByJettonQuery,
  PoolsByJettonQueryVariables
>;
export const AllPoolsDocument = gql`
  query AllPools {
    pools {
      ...PoolFields
    }
  }
  ${PoolFieldsFragmentDoc}
`;

/**
 * __useAllPoolsQuery__
 *
 * To run a query within a React component, call `useAllPoolsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllPoolsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllPoolsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllPoolsQuery(
  baseOptions?: Apollo.QueryHookOptions<AllPoolsQuery, AllPoolsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AllPoolsQuery, AllPoolsQueryVariables>(
    AllPoolsDocument,
    options,
  );
}
export function useAllPoolsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AllPoolsQuery,
    AllPoolsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AllPoolsQuery, AllPoolsQueryVariables>(
    AllPoolsDocument,
    options,
  );
}
export function useAllPoolsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AllPoolsQuery, AllPoolsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<AllPoolsQuery, AllPoolsQueryVariables>(
    AllPoolsDocument,
    options,
  );
}
export type AllPoolsQueryHookResult = ReturnType<typeof useAllPoolsQuery>;
export type AllPoolsLazyQueryHookResult = ReturnType<
  typeof useAllPoolsLazyQuery
>;
export type AllPoolsSuspenseQueryHookResult = ReturnType<
  typeof useAllPoolsSuspenseQuery
>;
export type AllPoolsQueryResult = Apollo.QueryResult<
  AllPoolsQuery,
  AllPoolsQueryVariables
>;
export const GetPoolDataDocument = gql`
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
  ${PoolDataFieldsFragmentDoc}
`;

/**
 * __useGetPoolDataQuery__
 *
 * To run a query within a React component, call `useGetPoolDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPoolDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPoolDataQuery({
 *   variables: {
 *      poolDataId: // value for 'poolDataId'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *      groupBy: // value for 'groupBy'
 *   },
 * });
 */
export function useGetPoolDataQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetPoolDataQuery,
    GetPoolDataQueryVariables
  > &
    (
      | { variables: GetPoolDataQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPoolDataQuery, GetPoolDataQueryVariables>(
    GetPoolDataDocument,
    options,
  );
}
export function useGetPoolDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPoolDataQuery,
    GetPoolDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetPoolDataQuery, GetPoolDataQueryVariables>(
    GetPoolDataDocument,
    options,
  );
}
export function useGetPoolDataSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetPoolDataQuery,
        GetPoolDataQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetPoolDataQuery, GetPoolDataQueryVariables>(
    GetPoolDataDocument,
    options,
  );
}
export type GetPoolDataQueryHookResult = ReturnType<typeof useGetPoolDataQuery>;
export type GetPoolDataLazyQueryHookResult = ReturnType<
  typeof useGetPoolDataLazyQuery
>;
export type GetPoolDataSuspenseQueryHookResult = ReturnType<
  typeof useGetPoolDataSuspenseQuery
>;
export type GetPoolDataQueryResult = Apollo.QueryResult<
  GetPoolDataQuery,
  GetPoolDataQueryVariables
>;
export const AllPositionsDocument = gql`
  query AllPositions($owner: String!, $pool: String!) {
    positions(where: { owner: $owner, pool: $pool }) {
      ...PositionFields
    }
  }
  ${PositionFieldsFragmentDoc}
`;

/**
 * __useAllPositionsQuery__
 *
 * To run a query within a React component, call `useAllPositionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllPositionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllPositionsQuery({
 *   variables: {
 *      owner: // value for 'owner'
 *      pool: // value for 'pool'
 *   },
 * });
 */
export function useAllPositionsQuery(
  baseOptions: Apollo.QueryHookOptions<
    AllPositionsQuery,
    AllPositionsQueryVariables
  > &
    (
      | { variables: AllPositionsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AllPositionsQuery, AllPositionsQueryVariables>(
    AllPositionsDocument,
    options,
  );
}
export function useAllPositionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AllPositionsQuery,
    AllPositionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AllPositionsQuery, AllPositionsQueryVariables>(
    AllPositionsDocument,
    options,
  );
}
export function useAllPositionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AllPositionsQuery,
        AllPositionsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<AllPositionsQuery, AllPositionsQueryVariables>(
    AllPositionsDocument,
    options,
  );
}
export type AllPositionsQueryHookResult = ReturnType<
  typeof useAllPositionsQuery
>;
export type AllPositionsLazyQueryHookResult = ReturnType<
  typeof useAllPositionsLazyQuery
>;
export type AllPositionsSuspenseQueryHookResult = ReturnType<
  typeof useAllPositionsSuspenseQuery
>;
export type AllPositionsQueryResult = Apollo.QueryResult<
  AllPositionsQuery,
  AllPositionsQueryVariables
>;
export const GetMintsDocument = gql`
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

/**
 * __useGetMintsQuery__
 *
 * To run a query within a React component, call `useGetMintsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMintsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMintsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetMintsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetMintsQuery, GetMintsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetMintsQuery, GetMintsQueryVariables>(
    GetMintsDocument,
    options,
  );
}
export function useGetMintsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMintsQuery,
    GetMintsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetMintsQuery, GetMintsQueryVariables>(
    GetMintsDocument,
    options,
  );
}
export function useGetMintsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetMintsQuery, GetMintsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetMintsQuery, GetMintsQueryVariables>(
    GetMintsDocument,
    options,
  );
}
export type GetMintsQueryHookResult = ReturnType<typeof useGetMintsQuery>;
export type GetMintsLazyQueryHookResult = ReturnType<
  typeof useGetMintsLazyQuery
>;
export type GetMintsSuspenseQueryHookResult = ReturnType<
  typeof useGetMintsSuspenseQuery
>;
export type GetMintsQueryResult = Apollo.QueryResult<
  GetMintsQuery,
  GetMintsQueryVariables
>;
export const GetSwapsDocument = gql`
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

/**
 * __useGetSwapsQuery__
 *
 * To run a query within a React component, call `useGetSwapsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSwapsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSwapsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetSwapsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetSwapsQuery, GetSwapsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSwapsQuery, GetSwapsQueryVariables>(
    GetSwapsDocument,
    options,
  );
}
export function useGetSwapsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSwapsQuery,
    GetSwapsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSwapsQuery, GetSwapsQueryVariables>(
    GetSwapsDocument,
    options,
  );
}
export function useGetSwapsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetSwapsQuery, GetSwapsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetSwapsQuery, GetSwapsQueryVariables>(
    GetSwapsDocument,
    options,
  );
}
export type GetSwapsQueryHookResult = ReturnType<typeof useGetSwapsQuery>;
export type GetSwapsLazyQueryHookResult = ReturnType<
  typeof useGetSwapsLazyQuery
>;
export type GetSwapsSuspenseQueryHookResult = ReturnType<
  typeof useGetSwapsSuspenseQuery
>;
export type GetSwapsQueryResult = Apollo.QueryResult<
  GetSwapsQuery,
  GetSwapsQueryVariables
>;
export const GetBurnsDocument = gql`
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

/**
 * __useGetBurnsQuery__
 *
 * To run a query within a React component, call `useGetBurnsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBurnsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBurnsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetBurnsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetBurnsQuery, GetBurnsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetBurnsQuery, GetBurnsQueryVariables>(
    GetBurnsDocument,
    options,
  );
}
export function useGetBurnsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBurnsQuery,
    GetBurnsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetBurnsQuery, GetBurnsQueryVariables>(
    GetBurnsDocument,
    options,
  );
}
export function useGetBurnsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetBurnsQuery, GetBurnsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetBurnsQuery, GetBurnsQueryVariables>(
    GetBurnsDocument,
    options,
  );
}
export type GetBurnsQueryHookResult = ReturnType<typeof useGetBurnsQuery>;
export type GetBurnsLazyQueryHookResult = ReturnType<
  typeof useGetBurnsLazyQuery
>;
export type GetBurnsSuspenseQueryHookResult = ReturnType<
  typeof useGetBurnsSuspenseQuery
>;
export type GetBurnsQueryResult = Apollo.QueryResult<
  GetBurnsQuery,
  GetBurnsQueryVariables
>;
export const GetCollectsDocument = gql`
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

/**
 * __useGetCollectsQuery__
 *
 * To run a query within a React component, call `useGetCollectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCollectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCollectsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetCollectsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetCollectsQuery,
    GetCollectsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCollectsQuery, GetCollectsQueryVariables>(
    GetCollectsDocument,
    options,
  );
}
export function useGetCollectsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCollectsQuery,
    GetCollectsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCollectsQuery, GetCollectsQueryVariables>(
    GetCollectsDocument,
    options,
  );
}
export function useGetCollectsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetCollectsQuery,
        GetCollectsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetCollectsQuery, GetCollectsQueryVariables>(
    GetCollectsDocument,
    options,
  );
}
export type GetCollectsQueryHookResult = ReturnType<typeof useGetCollectsQuery>;
export type GetCollectsLazyQueryHookResult = ReturnType<
  typeof useGetCollectsLazyQuery
>;
export type GetCollectsSuspenseQueryHookResult = ReturnType<
  typeof useGetCollectsSuspenseQuery
>;
export type GetCollectsQueryResult = Apollo.QueryResult<
  GetCollectsQuery,
  GetCollectsQueryVariables
>;
