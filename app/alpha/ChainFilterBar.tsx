"use client";

import React from "react";
import { CHAIN_LOGOS } from './chainLogos';

interface ChainFilterBarProps {
  activeType: string;
  activeChain: string;
  activeSort: string;
  assets: { chain_id: string | null }[];
}

const coingeckoLogos: Record<string, string> = {
  ethereum: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  base: 'https://pbs.twimg.com/profile_images/1945608199500910592/rnk6ixxH_400x400.jpg',
  solana: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  xrpl: 'https://pbs.twimg.com/profile_images/1864533793945640960/7aJUzLpc_400x400.jpg',
  bitcoin: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
};

export default function ChainFilterBar({ activeType, activeChain, activeSort, assets }: ChainFilterBarProps) {
  const chains = Array.from(new Set((assets ?? []).map(a => a.chain_id).filter(Boolean)));
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <a
        href={`/alpha?type=${activeType}&sort=${activeSort}`}
        className={`px-3 py-1 rounded-lg font-chakra text-xs tracking-wide transition-colors flex-shrink-0 border ${
          activeChain === 'all'
            ? 'bg-cyber-green/10 text-cyber-green border-cyber-green/30'
            : 'bg-panel/40 text-gray-400 border-border-dark hover:text-white'
        }`}
      >
        Todas las Chains
      </a>
      {chains.map(chainId => (
        <a
          key={chainId}
          href={`/alpha?type=${activeType}&chain=${chainId}&sort=${activeSort}`}
          className={`px-3 py-1 rounded-lg font-chakra text-xs tracking-wide transition-colors flex-shrink-0 border ${
            activeChain === chainId
              ? 'bg-cyber-green/10 text-cyber-green border-cyber-green/30'
              : 'bg-panel/40 text-gray-400 border-border-dark hover:text-white'
          }`}
          title={chainId as string}
        >
          {CHAIN_LOGOS[chainId as string] && (
            <img
              src={CHAIN_LOGOS[chainId as string]}
              alt={chainId as string}
              className="w-5 h-5 inline-block rounded-full align-middle"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
        </a>
      ))}
    </div>
  );
}
