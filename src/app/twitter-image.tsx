import OpengraphImage from "./opengraph-image";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "PGP·Vault — PGP without the headache.";

export default function TwitterImage() {
  return OpengraphImage();
}
