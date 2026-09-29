"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/menu.module.css";

interface Offering {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
}

export default function MenuPage() {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOfferings() {
      try {
        const response = await fetch("/api/offerings");

        if (!response.ok) {
          throw new Error("Unable to load the menu.");
        }

        const data: Offering[] = await response.json();
        setOfferings(data);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to load the menu.");
      } finally {
        setIsLoading(false);
      }
    }

    loadOfferings();
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Our offerings</p>
        <h1>Menu</h1>
        <p>Find your next favorite cup, made fresh for you.</p>
      </header>

      {isLoading && <p>Loading the menu...</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !error && offerings.length === 0 && <p>No menu items are available right now.</p>}
      {!isLoading && !error && offerings.length > 0 && (
        <ul className={styles.list}>
          {offerings.map((offering) => (
            <li className={styles.item} key={offering.id ?? offering._id ?? offering.name}>
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
