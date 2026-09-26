import manifest from "@/lib/image-manifest.json";
import { images } from "@/lib/images";

/** All-caps RAFIKIHUB wordmark. Uses an image instead only if images.logo is set and the file exists. */
export function Logo() {
  if (images.logo && (manifest as string[]).includes(images.logo)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={images.logo} alt="RafikiHub" height={36} style={{ height: 36, width: "auto" }} />;
  }
  return (
    <span className="wordmark" aria-label="RafikiHub">
      RAFIKI<span>HUB</span>
    </span>
  );
}
