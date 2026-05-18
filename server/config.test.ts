import { describe, expect, it } from "vitest";
import { getServerConfig } from "./config";

describe("getServerConfig", () => {
  it("defaults to port 43211 and host 0.0.0.0", () => {
    const config = getServerConfig({});

    expect(config.port).toBe(43211);
    expect(config.host).toBe("0.0.0.0");
  });
});
