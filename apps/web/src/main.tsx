import GuestMeal from "./GuestMeal";
import { createRoot } from "react-dom/client";

const root = document.getElementById("root");
if (!root) throw new Error("Missing app root");

createRoot(root).render(<GuestMeal />);
