import { pTON_MINTER, Jetton } from '@toncodex/sdk';

export type Jettons = {
  [symbol: string]: Jetton;
};

export const jettons = {
  TON: new Jetton(
    pTON_MINTER,
    9,
    'TON',
    'TON',
    'https://cache.tonapi.io/imgproxy/X7T-fLahBBVIxXacXAqrsCHIgFgTQE3Jt2HAdnc5_Mc/rs:fill:200:200:1/g:no/aHR0cHM6Ly9zdGF0aWMuc3Rvbi5maS9sb2dvL3Rvbl9zeW1ib2wucG5n.webp',
  ),
  USD: new Jetton(
    'EQDeH8DU3t3-EmNvJQl2YnOvLMLTfODvhbTNsawu4UuZmG0n',
    9,
    'USD',
    'USD Coin for TONCO',
    'https://cache.tonapi.io/imgproxy/xodX9yZ8j4kmEZS1eiVYCjO6PdcRj42McMNUHyksYEY/rs:fill:200:200:1/g:no/aHR0cHM6Ly9waW1lbm92YWxleGFuZGVyLmdpdGh1Yi5pby9yZXNvdXJjZXMvaWNvbnMvY29pbkQucG5n.webp',
  ),
  ALG_USD: new Jetton(
    'EQD8Hzc0JD808OAnCsnCea2_Fq4cNAiAhGo5KaXM-zt8HV5Q',
    9,
    'ALG_USD',
    'Algebra USD',
    'https://cache.tonapi.io/imgproxy/bkEXt0iMIllDAwZ49yeipCc43WGmLgTwqvnAluEkyuE/rs:fill:200:200:1/g:no/aHR0cHM6Ly9waW1lbm92YWxleGFuZGVyLmdpdGh1Yi5pby9yZXNvdXJjZXMvaWNvbnMvQUxHX1VTRC5wbmc.webp',
  ),
  ALG_ETH: new Jetton(
    'EQACEhh_dJzp3PPyEwwTfTy7Ub_f6Dt5FAKZq_t1Fqe2vaL2',
    9,
    'ALG_ETH',
    'Algebra ETH',
    'https://cache.tonapi.io/imgproxy/dOGRKCpepjByFEhB222wY5f8Ccne2AUmbTyz1jn5tz4/rs:fill:200:200:1/g:no/aHR0cHM6Ly9waW1lbm92YWxleGFuZGVyLmdpdGh1Yi5pby9yZXNvdXJjZXMvaWNvbnMvQUxHX0VUSC5wbmc.webp',
  ),
  A_COIN: new Jetton(
    'kQD9FPFbmlCMMyjKGDPQWvllCLUdjjxIFvu9UvL3H_WECnVi',
    9,
    'A Coin',
    'A Coin for TONCO',
    'https://cache.tonapi.io/imgproxy/EUYYN21y3dkpKz9D--DSKTVKKnaDNMgSBk3roAdQBc4/rs:fill:200:200:1/g:no/aHR0cHM6Ly9waW1lbm92YWxleGFuZGVyLmdpdGh1Yi5pby9yZXNvdXJjZXMvaWNvbnMvY29pbkEucG5n.webp',
  ),
  BTC: new Jetton(
    'EQCDldcdLpTdm2BTcQS1DtU0Mf-GMywWkcuI2M6M3NBhwj8U',
    9,
    'BTC',
    'BTC Coin for TONCO',
    'https://cache.tonapi.io/imgproxy/riT2ddvw8d07YY4fVrfCWevKl9RPgnoCSshiYlF0y4k/rs:fill:200:200:1/g:no/aHR0cHM6Ly9waW1lbm92YWxleGFuZGVyLmdpdGh1Yi5pby9yZXNvdXJjZXMvaWNvbnMvY29pbkIucG5n.webp',
  ),
  ETH: new Jetton(
    'EQD-M4OwggbSkuzKGwVH0nYkVIibPGOOuIJUDvb9Po51u_bZ',
    9,
    'ETH',
    'ETH Coin for TONCO',
    'https://cache.tonapi.io/imgproxy/F8ihFkjQVPGz6eq8qwKWTu0XBZJ559AL7BcaUxuHyLI/rs:fill:200:200:1/g:no/aHR0cHM6Ly9waW1lbm92YWxleGFuZGVyLmdpdGh1Yi5pby9yZXNvdXJjZXMvaWNvbnMvY29pbkUucG5n.webp',
  ),
  USDC: new Jetton(
    'EQAVtn9uSMPZ4TXdhVNtlKpIJwNY56iD6ngn5bpMoUJDDcWO',
    9,
    'USDC',
    'USD Coin',
    'https://cache.tonapi.io/imgproxy/wE4DpHaaVuzBXIjfTqAZ0lviqkVel7v6SI9v3nqKlTI/rs:fill:200:200:1/g:no/aHR0cHM6Ly9waW1lbm92YWxleGFuZGVyLmdpdGh1Yi5pby9yZXNvdXJjZXMvaWNvbnMvY29pbkMucG5n.webp',
  ),
  F6: new Jetton(
    'EQD00XKMrx_6OaGfgOeMUl0pe0rvTQyuxi85pPbTAueQ70mB',
    6,
    'F6',
    'F6 Coin for TONCO',
    'https://cache.tonapi.io/imgproxy/3UmyMuT9QoXw_BCBZwsXQlaTFbf4To74ma20-SFZc0I/rs:fill:200:200:1/g:no/aHR0cHM6Ly9waW1lbm92YWxleGFuZGVyLmdpdGh1Yi5pby9yZXNvdXJjZXMvaWNvbnMvY29pbkY2LnBuZw.webp',
  ),
  F3: new Jetton(
    'EQDDr_Jzy1Kj5tR3MdXkaeB6xKvldfSci8pswvzjEHoEMsYY',
    3,
    'F3',
    'F3 Coin for TONCO',
    'https://cache.tonapi.io/imgproxy/MEdFNvurey37ZfSRipis4U53CnN9aiJ9EOVz1PWqFGU/rs:fill:200:200:1/g:no/aHR0cHM6Ly9waW1lbm92YWxleGFuZGVyLmdpdGh1Yi5pby9yZXNvdXJjZXMvaWNvbnMvY29pbkYzLnBuZw.webp',
  ),
};
