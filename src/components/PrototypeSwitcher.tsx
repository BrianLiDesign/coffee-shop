"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/homepage-prototype.module.css";

const variants = ["A", "B", "C"];
const names = ["Warm café", "Editorial", "Menu first"];

export default function PrototypeSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const index = variants.indexOf(current);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    function onKey(event: KeyboardEvent) {
      const target = event.target;
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable]"))
      )
        return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const url = new URL(window.location.href);
      url.searchParams.set("variant", variants[(index + (event.key === "ArrowRight" ? 1 : 2)) % 3]);
      router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, router]);
  if (process.env.NODE_ENV === "production") return null;
  function cycle(direction: number) {
    const url = new URL(window.location.href);
    url.searchParams.set("variant", variants[(index + direction + 3) % 3]);
    router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false });
  }
  return (
    <nav className={styles.switcher} aria-label="Homepage prototype variants">
      <button onClick={() => cycle(-1)} aria-label="Previous homepage variant">
        ←
      </button>
      <div aria-live="polite">
        <small>DESIGN EXPLORATION</small>
        <strong>
          {current} / {names[index]}
        </strong>
      </div>
      <button onClick={() => cycle(1)} aria-label="Next homepage variant">
        →
      </button>
    </nav>
  );
}
