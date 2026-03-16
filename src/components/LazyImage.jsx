import { useRef, useEffect, useState } from 'react'

export default function LazyImage({ src, alt, className, style }) {
  const imgRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={imgRef} className={className} style={style}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      {(!isInView || !isLoaded) && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        />
      )}
    </div>
  )
}
