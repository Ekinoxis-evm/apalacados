import { NextRequest, NextResponse } from 'next/server'

type DexPair = {
  priceUsd?: string | null
  priceChange?: { h24?: number }
  volume?: { h24?: number }
  liquidity?: { usd?: number; base?: number; quote?: number }
  fdv?: number | null
  marketCap?: number | null
  url?: string
  pairCreatedAt?: number | null
  info?: {
    imageUrl?: string | null
    websites?: { url: string }[] | null
    socials?: { platform: string; handle: string }[] | null
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ chainId: string; contract: string }> }
) {
  const { chainId, contract } = await params

  try {
    const response = await fetch(
      `https://api.dexscreener.com/token-pairs/v1/${chainId}/${contract}`,
      {
        headers: { Accept: '*/*' },
        next: { revalidate: 60 },
      }
    )

    if (!response.ok) {
      return NextResponse.json(null, { status: 200 })
    }

    const pairs: DexPair[] = await response.json()
    if (!pairs || pairs.length === 0) {
      return NextResponse.json(null, { status: 200 })
    }

    const pair = pairs[0]

    const xSocial = pair.info?.socials?.find(
      (s) => s.platform === 'twitter' || s.platform === 'x'
    )
    const website = pair.info?.websites?.[0]?.url ?? null

    return NextResponse.json({
      priceUsd: pair.priceUsd ?? null,
      priceChange24h: pair.priceChange?.h24 ?? null,
      volume24h: pair.volume?.h24 ?? null,
      liquidity: pair.liquidity?.usd ?? null,
      fdv: pair.fdv ?? null,
      marketCap: pair.marketCap ?? null,
      dexUrl: pair.url ?? null,
      pairCreatedAt: pair.pairCreatedAt ?? null,
      imageUrl: pair.info?.imageUrl ?? null,
      website,
      xHandle: xSocial?.handle ?? null,
    })
  } catch {
    return NextResponse.json(null, { status: 200 })
  }
}
