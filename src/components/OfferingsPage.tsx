"use client";

import { useEffect, useState } from "react";
import type { Offering } from "@/database/offering";
import styles from "@/styles/offerings.module.css";

interface OfferingsPageProps {
  title: string;
  intro: string;
  emptyMessage: string;
  specialsOnly?: boolean;
}

export default function OfferingsPage({ title, intro, emptyMessage, specialsOnly = false }: OfferingsPageProps) {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOfferings() {
      try {
        const response = await fetch("/api/offerings");

        if (!response.ok) {
          throw new Error(`Unable to load ${title.toLowerCase()}.`);
        }

        const data: Offering[] = await response.json();
        setOfferings(data);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : `Unable to load ${title.toLowerCase()}.`);
      } finally {
        setIsLoading(false);
      }
    }

    loadOfferings();
  }, [title]);

  const visibleOfferings = specialsOnly ? offerings.filter((offering) => offering.specialOffer) : offerings;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Our offerings</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </header>

      {isLoading && <p>Loading {title.toLowerCase()}...</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !error && visibleOfferings.length === 0 && <p>{emptyMessage}</p>}
      {!isLoading && !error && visibleOfferings.length > 0 && (
        <ul className={styles.list}>
          {visibleOfferings.map((offering) => (
            <li className={styles.item} key={offering.ID}>
              <div>
                <h2>{offering.name}</h2>
                <p>{offering.description}</p>
              </div>
              <span className={styles.price}>${offering.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
