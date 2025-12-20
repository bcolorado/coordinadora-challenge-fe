import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

test("demo", () => {
  expect(true).toBe(true);
});

test("Renders main page title", () => {
  render(<div>Hello World</div>);
  const linkElement = screen.getByText(/Hello World/i);
  expect(linkElement).toBeInTheDocument();
});
