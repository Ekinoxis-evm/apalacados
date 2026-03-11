"use client"

import React from "react";

interface AlphaSortBarProps {
  activeType: string;
  sort: string;
  itemsCount: number;
}

const TYPE_FILTERS = [
  { value: 'all', label: 'Todos' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'stock', label: 'Stocks' },
  { value: 'etf', label: 'ETFs' },
  { value: 'rwa', label: 'RWA' },
];

export default function AlphaSortBar({ activeType, sort, itemsCount }: AlphaSortBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {TYPE_FILTERS.map((f) => (
        <a
          key={f.value}
          href={f.value === 'all' ? `/alpha?sort=${sort}` : `/alpha?type=${f.value}&sort=${sort}`}
          className={`px-4 py-2 rounded-lg font-chakra text-xs tracking-wide transition-colors flex-shrink-0 border ${
            activeType === f.value
              ? 'bg-cyber-green/10 text-cyber-green border-cyber-green/30'
              : 'bg-panel/40 text-gray-400 border-border-dark hover:text-white'
          }`}
        >
          {f.label}
        </a>
      ))}
      <form method="get" className="ml-4">
        {activeType !== 'all' && <input type="hidden" name="type" value={activeType} />}
        <select
          name="sort"
          defaultValue={sort}
          className="bg-panel/40 border border-border-dark text-xs text-gray-400 rounded px-2 py-1 ml-2"
          onChange={e => e.currentTarget.form?.submit()}
        >
          <option value="default">Ordenar: Default</option>
          <option value="marketCap">Ordenar: Market Cap</option>
          <option value="volume24h">Ordenar: Volumen 24h</option>
        </select>
      </form>
      <span className="ml-auto text-[10px] text-gray-600 font-mono tracking-widest flex-shrink-0">
        {itemsCount} ACTIVOS
      </span>
    </div>
  );
}
