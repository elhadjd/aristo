import Image, { type ImageProps } from "next/image";
import { resolveMediaSrc } from "@/lib/media-url";

type Props = Omit<ImageProps, "src"> & {
  src: string;
};

/**
 * Site media helper: turns `/uploads/...` into `/api/uploads/...` (and absolute when possible)
 * so admin uploads render on hosts that do not serve runtime public/ files.
 */
export function MediaImage({ src, alt, ...props }: Props) {
  const resolved = resolveMediaSrc(src);
  return <Image src={resolved || src} alt={alt} {...props} />;
}
