import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { App } from "../App";

describe("home page", () => {
  it("renders the path input and only markdown and html directory links", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/input path/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "MarkDown" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "html" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "PPT" })).not.toBeInTheDocument();
  });
});
