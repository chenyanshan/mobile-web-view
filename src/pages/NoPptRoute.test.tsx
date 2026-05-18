import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { App } from "../App";

describe("ppt routes", () => {
  it("falls through when a removed ppt route is requested", () => {
    render(
      <MemoryRouter initialEntries={["/view/ppt?path=demo-slides"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.queryByText(/ppt viewer/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/markdown viewer/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/html viewer/i)).not.toBeInTheDocument();
  });
});
