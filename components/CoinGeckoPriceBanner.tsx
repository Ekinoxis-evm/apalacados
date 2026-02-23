'use client'

import { useEffect, useRef } from 'react'

export default function CoinGeckoPriceBanner() {
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    const script = document.createElement('script')
    script.src = 'https://widgets.coingecko.com/gecko-coin-price-static-headline-widget.js'
    script.async = true
    document.head.appendChild(script)
  }, [])

  return (
    <gecko-coin-price-static-headline-widget
      locale="en"
      dark-mode="true"
      outlined="true"
      coin-ids="sui,ripple,solana,ethereum,bitcoin"
      initial-currency="usd"
    />
  )
}
