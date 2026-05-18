import { describe, expect, it } from "vitest";

describe("workspace scaffold", () => {
  it("loads the app entry", async () => {
    const appModule = await import("./App");
    expect(appModule.App).toBeTypeOf("function");
  });
});
