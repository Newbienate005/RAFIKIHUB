import manifest from "@/lib/image-manifest.json";
import { images } from "@/lib/images";

/** Uses the old site's logo once imported; otherwise a type-set wordmark. */
export function Logo() {
  if ((manifest as string[]).includes(images.logo)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={images.logo} alt="RafikiHub" height={36} style={{ height: 36, width: "auto" }} />;
  }
  return (
    <span className="wordmark">
      rafiki<span>hub</span>
    </span>
  );
}
