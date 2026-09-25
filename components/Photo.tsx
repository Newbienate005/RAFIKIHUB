import Image from "next/image";
import manifest from "@/lib/image-manifest.json";

const available = new Set<string>(manifest as string[]);

type Props = {
  src?: string;
  alt: string;
  /** Shown as initials on the placeholder when the image hasn't been added yet */
  label?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/** Fills its parent (give the parent a size or aspect-ratio). Falls back to an initials placeholder. */
export function Photo({ src, alt, label, sizes = "(max-width: 768px) 100vw, 50vw", priority, className }: Props) {
  if (src && available.has(src)) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`photo ${className ?? ""}`} />;
  }
  const initials = (label ?? alt)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <div className={`photo photo--empty ${className ?? ""}`} role="img" aria-label={alt}>
      <span aria-hidden="true">{initials}</span>
    </div>
  );
}
