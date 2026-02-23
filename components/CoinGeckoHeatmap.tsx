'use client'

import { useEffect, useRef } from 'react'

export default function CoinGeckoHeatmap() {
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    const script = document.createElement('script')
    script.src = 'https://widgets.coingecko.com/gecko-coin-heatmap-widget.js'
    script.async = true
    document.head.appendChild(script)
  }, [])

  return (
    <div className="w-full min-h-[500px]">
      {/*
        CoinGecko Heatmap Widget
        Docs: https://www.coingecko.com/en/widgets
        If the widget name changes, update the element name below.
      */}
      <gecko-coin-heatmap-widget
        locale="en"
        outlined="true"
        dark-mode="true"
        top="100"
        width="100%"
        height="500"
      />
    </div>
  )
}
