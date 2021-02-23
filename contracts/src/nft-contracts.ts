import { $log } from '@tsed/logger';

import { compileAndLoadContract, originateContract, defaultEnv } from './ligo';
import { Contract, address, nat } from './type-aliases';
import { TezosToolkit } from '@taquito/taquito';
import { TokenMetadata } from './fa2-interface';
import { BigNumber } from 'bignumber.js';

export interface MintNftParam {
    token_metadata: TokenMetadata;
    owner: address;
}

export interface MintFtParam {
    owner: address;
    token_id: nat;
    amount: nat;
}

export interface MintFtPaarm {
    token_medata: TokenMetadata;
    owner: address;
}

export interface SaleTokenParamTez {
    token_for_sale_address: address;
    token_for_sale_token_id: nat;
}

export interface SaleParamTez {
    sale_price: BigNumber;
    sale_token: SaleTokenParamTez;
}

interface AdminStorage {
    admin: string;
    pending_admin?: string;
    paused: boolean;
}

function toHexString(input: string): string {
  const unit8Array: Uint8Array = new TextEncoder().encode(input);
  return Array.from(unit8Array, (byte: number) => {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}


export async function originateNft(
    tz: TezosToolkit,
    admin: address
): Promise<Contract> {
    const code = await compileAndLoadContract(
        defaultEnv,
        'fa2_multi_nft_asset.mligo',
        'nft_asset_main',
        'fa2_multi_nft_asset.tz'
    );
    const meta_uri = toHexString('tezos-storage:content');
    const meta = {
        name: 'example_name',
        description: 'sample_token',
        interfaces: ['TZIP-012','TZIP-016']
    };

    const meta_content = toHexString(JSON.stringify(meta,null,2));

    const storage = `(Pair (Pair (Pair (Pair "tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU" True) None)
            (Pair (Pair {} 0) (Pair {} {})))
      { Elt "" 0x${meta_uri} ; Elt "contents" 0x${meta_content} })`;
    return originateContract(tz, code, storage, 'nft');
}

export async function originateNftFactory(tz: TezosToolkit): Promise<Contract> {
    const code = await compileAndLoadContract(
        defaultEnv,
        'fa2_nft_factory.mligo',
        'factory_main',
        'fa2_nft_factory.tz'
    );
    return originateContract(tz, code, '{}', 'nftFactory');
}

export async function originateNftFaucet(
    tz: TezosToolkit,
    admin: address
): Promise<Contract> {
    const code = await compileAndLoadContract(
        defaultEnv,
        'fa2_multi_nft_faucet.mligo',
        'nft_faucet_main',
        'fa2_multi_nft_faucet.tz'
    );

    const meta_uri = toHexString('tezos-storage:content');
    const meta = {
        name: 'example_name',
        description: 'sample_token',
        interfaces: ['TZIP-012','TZIP-016']
    };

    const meta_content = toHexString(JSON.stringify(meta,null,2));

    const storage = `(Pair (Pair (Pair {} 0) (Pair {} {}))
      { Elt "" 0x${meta_uri} ; Elt "contents" 0x${meta_content} })`;
    return originateContract(tz, code, storage, 'nftFaucet');
}

export async function originateFtFaucet(
    tz: TezosToolkit,
    admin: address
): Promise<Contract> {
    const code = await compileAndLoadContract(
        defaultEnv,
        'fa2_multi_ft_faucet.mligo',
        'ft_faucet_main',
        'fa2_multi_ft_faucet.tz'
    );

    const meta_uri = toHexString('tezos-storage:content');
    const meta = {
        name: 'example_name',
        description: 'sample_token',
        interfaces: ['TZIP-012','TZIP-106']
    };

    const meta_content = toHexString(JSON.stringify(meta,null,2));

    const storage = `(Pair (Pair (Pair {} {}) (Pair {} {}))
        { Elt "" 0x${meta_uri} ; Elt "contents" 0x${meta_content} })`;

    return originateContract(tz,code,storage,'ftFaucet');
}

export async function originateFixedPriceSale(
    tz: TezosToolkit,
    adminAddress: address
): Promise<Contract> {
    const code = await compileAndLoadContract(
        defaultEnv,
        'fixed_price_sale_market.mligo',
        'fixed_price_sale_main',
        'fixed_price_sale_market.tz',
    );
    const storage = `(Pair (Pair (Pair \"${adminAddress}\" False) None) {})`;
    return originateContract(tz, code, storage, 'fixed-price-sale-market');
}

export async function originateFixedPriceTezSale(
    tz: TezosToolkit,
    adminAddress: address
): Promise<Contract> {
    const code = await compileAndLoadContract(
        defaultEnv,
        'fixed_price_sale_market_tez.mligo',
        'fixed_price_sale_tez_main',
        'fixed_price_sale_market_tez.tz',
    );
    const storage = `(Pair (Pair (Pair \"${adminAddress}\" False) None) {})`;
    return originateContract(tz, code, storage, 'fixed-price-sale-market-tez');
}
