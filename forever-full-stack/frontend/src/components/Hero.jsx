import { useEffect, useRef } from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  const heroRef = useRef(null)

  useEffect(() => {
    const container = heroRef.current
    if (!container) return

    const shapes = Array.from(container.querySelectorAll('.background-shape'))
    let width = container.clientWidth
    let height = container.clientHeight
    const columns = Math.ceil(Math.sqrt(shapes.length * width / height))
    const rows = Math.ceil(shapes.length / columns)
    const particles = shapes.map((element, index) => {
      const column = index % columns
      const row = Math.floor(index / columns)
      const angle = Math.random() * Math.PI * 2
      const speed = 20 + Math.random() * 30
      const particle = {
        element,
        radius: 7,
        x: ((column + 0.5) / columns) * width,
        y: ((row + 0.5) / rows) * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      }

      element.style.left = `${particle.x}px`
      element.style.top = `${particle.y}px`
      return particle
    })

    const resizeObserver = new ResizeObserver(() => {
      width = container.clientWidth
      height = container.clientHeight
      particles.forEach((particle) => {
        particle.x = Math.min(particle.x, width - particle.radius)
        particle.y = Math.min(particle.y, height - particle.radius)
      })
    })
    resizeObserver.observe(container)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return () => resizeObserver.disconnect()
    }

    let frameId
    let previousTime
    const animate = (time) => {
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0
      previousTime = time

      particles.forEach((particle) => {
        particle.x += particle.vx * delta
        particle.y += particle.vy * delta

        if (particle.x < particle.radius || particle.x > width - particle.radius) {
          particle.x = Math.max(particle.radius, Math.min(particle.x, width - particle.radius))
          particle.vx *= -1
        }
        if (particle.y < particle.radius || particle.y > height - particle.radius) {
          particle.y = Math.max(particle.radius, Math.min(particle.y, height - particle.radius))
          particle.vy *= -1
        }
      })

      for (let first = 0; first < particles.length; first += 1) {
        for (let second = first + 1; second < particles.length; second += 1) {
          const a = particles[first]
          const b = particles[second]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const distance = Math.hypot(dx, dy)
          const minDistance = a.radius + b.radius

          if (distance >= minDistance) continue

          const nx = distance === 0 ? 1 : dx / distance
          const ny = distance === 0 ? 0 : dy / distance
          const overlap = minDistance - distance
          a.x -= nx * overlap / 2
          a.y -= ny * overlap / 2
          b.x += nx * overlap / 2
          b.y += ny * overlap / 2

          const relativeVelocity = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
          if (relativeVelocity < 0) {
            a.vx += relativeVelocity * nx
            a.vy += relativeVelocity * ny
            b.vx -= relativeVelocity * nx
            b.vy -= relativeVelocity * ny
          }
        }
      }

      particles.forEach((particle) => {
        particle.x = Math.max(particle.radius, Math.min(particle.x, width - particle.radius))
        particle.y = Math.max(particle.radius, Math.min(particle.y, height - particle.radius))
        particle.element.style.left = `${particle.x}px`
        particle.element.style.top = `${particle.y}px`
      })
      frameId = window.requestAnimationFrame(animate)
    }

    frameId = window.requestAnimationFrame(animate)
    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div ref={heroRef} className='relative isolate overflow-hidden flex flex-col sm:flex-row border border-gray-400'>
      <div className='background-animation' aria-hidden='true'>
        {Array.from({ length: 36 }, (_, index) => (
          <span className='background-shape' key={index} />
        ))}
      </div>
      {/* Hero Left Side */}
      <div className='relative z-10 w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
            <div className='text-[#414141]'>
                <div className='flex items-center gap-2'>
                    <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                    <p className=' font-medium text-sm md:text-base'>OUR BESTSELLERS</p>
                </div>
                <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Arrivals</h1>
                <div className='flex items-center gap-2'>
                    <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
                    <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
                </div>
            </div>
      </div>
      {/* Hero Right Side */}
      <img className='relative z-10 w-full sm:w-1/2' src={assets.hero_img} alt="" />
    </div>
  )
}

export default Hero
