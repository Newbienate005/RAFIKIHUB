import Image from "next/image";
import { images } from "@/lib/images";
import manifest from "@/lib/image-manifest.json";
import { DeferredSlide } from "./DeferredSlide";

const available = new Set<string>(manifest as string[]);
// On a phone the tall, narrow hero draws a landscape photo about twice the screen width to cover it.
// The file is capped at 150vw: the photo sits under a dark wash, so the slight softness is invisible and it saves about half the bytes.
const SIZES = "(max-width: 900px) 150vw, 100vw";

/**
 * The old rafikihub.com home page's background slideshow: full-bleed photos that fade into each other
 * (6 seconds each), behind the hero. The timing is CSS; only the first photo loads with the page and
 * the rest follow once it has finished loading. With reduced motion only the first photo shows.
 * Decorative, so hidden from screen readers.
 */
export function HeroSlideshow() {
  const slides = images.heroSlides.filter((s) => available.has(s));
  if (!slides.length) return null;
  return (
    <div className="hero__slides" aria-hidden="true" style={{ "--slides": slides.length } as React.CSSProperties}>
      {slides.map((src, i) => (
        <div key={src} className="hero__slide" style={{ "--i": i } as React.CSSProperties}>
          {/* The first photo is the largest thing on the page, so it's fetched first */}
          {i === 0 ? <Image src={src} alt="" fill sizes={SIZES} priority fetchPriority="high" /> : <DeferredSlide src={src} sizes={SIZES} />}
        </div>
      ))}
    </div>
  );
}
