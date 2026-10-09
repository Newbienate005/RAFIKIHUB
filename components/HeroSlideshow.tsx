import Image from "next/image";
import { images } from "@/lib/images";
import manifest from "@/lib/image-manifest.json";

const available = new Set<string>(manifest as string[]);

/**
 * The old rafikihub.com home page's background slideshow: full-bleed photos that slowly fade into
 * each other (6 seconds each), behind the hero. Pure CSS, so nothing runs in the browser; with
 * reduced motion only the first photo shows. Decorative, so hidden from screen readers.
 */
export function HeroSlideshow() {
  const slides = images.heroSlides.filter((s) => available.has(s));
  if (!slides.length) return null;
  return (
    <div className="hero__slides" aria-hidden="true" style={{ "--slides": slides.length } as React.CSSProperties}>
      {slides.map((src, i) => (
        <div key={src} className="hero__slide" style={{ "--i": i } as React.CSSProperties}>
          <Image src={src} alt="" fill sizes="100vw" priority={i === 0} />
        </div>
      ))}
    </div>
  );
}
