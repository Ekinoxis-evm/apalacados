// Type declarations for CoinGecko custom elements (web components)
declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      'gecko-coin-heatmap-widget': React.HTMLAttributes<HTMLElement> & {
        locale?: string
        outlined?: string
        'dark-mode'?: string
        top?: string
        width?: string
        height?: string
      }
      'gecko-coin-price-static-headline-widget': React.HTMLAttributes<HTMLElement> & {
        locale?: string
        'dark-mode'?: string
        outlined?: string
        'coin-ids'?: string
        'initial-currency'?: string
      }
    }
  }
}
