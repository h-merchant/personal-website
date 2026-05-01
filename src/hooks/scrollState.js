// Shared mutable scroll state — updated by Lenis, read by R3F useFrame.
// Using a plain object avoids React re-render cycles entirely.
export const scrollState = {
  progress: 0,   // 0–1 across entire page
  y: 0,          // raw scroll Y in px
}
