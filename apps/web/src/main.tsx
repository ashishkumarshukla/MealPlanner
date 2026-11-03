import { createRoot } from "react-dom/client";

const root = document.getElementById("root");
if (!root) throw new Error("Missing app root");

createRoot(root).render(<main><h1>Meals Planned</h1></main>);
