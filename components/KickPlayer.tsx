interface KickPlayerProps {
  username?: string
  autoplay?: boolean
  muted?: boolean
}

export default function KickPlayer({
  username = 'wmb81321',
  autoplay = false,
  muted = false,
}: KickPlayerProps) {
  const params = new URLSearchParams()
  if (autoplay) params.set('autoplay', 'true')
  if (muted) params.set('muted', 'true')
  const query = params.toString() ? `?${params.toString()}` : ''

  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 */ }}>
      <iframe
        src={`https://player.kick.com/${username}${query}`}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        title={`${username} en vivo en Kick`}
      />
    </div>
  )
}
