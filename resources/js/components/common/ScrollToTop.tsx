import { useEffect } from "react";

export function ScrollToTop() {
  useEffect(() => {
    const handleLocationChange = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    };

    // Listen for popstate to handle back/forward navigation
    window.addEventListener("popstate", handleLocationChange);

    // Also call once on mount
    handleLocationChange();

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  return null;
}
