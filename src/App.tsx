import { Route, Routes } from "react-router-dom";
import { DirectoryPage } from "./pages/DirectoryPage";
import { HomePage } from "./pages/HomePage";
import { HtmlViewPage } from "./pages/HtmlViewPage";
import { MarkdownViewPage } from "./pages/MarkdownViewPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/directory/:kind" element={<DirectoryPage />} />
      <Route path="/view/markdown" element={<MarkdownViewPage />} />
      <Route path="/view/html" element={<HtmlViewPage />} />
    </Routes>
  );
}
