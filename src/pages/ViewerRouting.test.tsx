import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { App } from "../App";

describe("viewer routes", () => {
  it("renders markdown viewer on markdown route", () => {
    render(
      <MemoryRouter initialEntries={["/view/markdown?path=demo.md"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/markdown viewer/i)).toBeInTheDocument();
  });
});
