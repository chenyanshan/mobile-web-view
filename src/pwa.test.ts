import { describe, expect, it } from "vitest";
import manifest from "../public/manifest.webmanifest?raw";

describe("pwa manifest", () => {
  it("declares standalone display mode", () => {
    const parsed = JSON.parse(manifest);
    expect(parsed.display).toBe("standalone");
  });
});
