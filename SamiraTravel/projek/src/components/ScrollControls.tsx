// src/components/ScrollControls.tsx
import React, { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const tolerance = 4;

const ScrollControls: React.FC = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [hasScrollableArea, setHasScrollableArea] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const maxScroll = scrollHeight - clientHeight;
      setIsAtTop(scrollTop <= tolerance);
      setIsAtBottom(scrollTop >= maxScroll - tolerance && maxScroll > 0);
      setHasScrollableArea(maxScroll > tolerance);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  if (!hasScrollableArea) {
    return null;
  }

  const showScrollTopButton = !isAtTop;
  const handleClick = showScrollTopButton ? scrollToTop : scrollToBottom;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-opacity duration-300 ${
        isAtTop && isAtBottom ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={showScrollTopButton ? "Kembali ke atas" : "Pergi ke bagian bawah"}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-transform duration-200 hover:scale-110 hover:bg-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
      >
        {showScrollTopButton ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default ScrollControls;
