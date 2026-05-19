// Reuse the OG image function for Twitter cards so social previews are
// consistent everywhere. Next.js requires these metadata constants to be
// declared directly in the file (re-exports aren't statically analyzable).
export { default } from "./opengraph-image";

export const runtime = "edge";
export const alt = "Proponiq — Smart proposals, bigger wins.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
