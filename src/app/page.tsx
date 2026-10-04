import Link from "next/link";
import styles from "@/styles/home.module.css";

export default function Home() {
  return (
    <main className={`${styles.page} ${styles.warm}`}>
      <div className={styles.masthead}>
        <span>COFFEE SHOP</span>
        <span>A little pause. A good cup.</span>
      </div>
      <section className={styles.hero} aria-labelledby="home-heading">
        <div>
          <p className={styles.eyebrow}>MAKE YOURSELF AT HOME</p>
          <h1 id="home-heading">
            Your day,
            <br />a little warmer.
          </h1>
          <p className={styles.description}>
            Freshly brewed favorites and a welcoming place to pause. Find your usual, or make room for something new.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/menu">
              Explore the menu <span aria-hidden="true">↗</span>
            </Link>
            <Link className={styles.textLink} href="/specials">
              See our specials
            </Link>
          </div>
        </div>
        <div className={styles.cupScene} role="img" aria-label="Illustration of a coffee cup on a saucer">
          <span className={styles.sceneCaption}>A MOMENT FOR YOU</span>
          <div className={styles.saucer} />
          <div className={styles.cup}>
            <div className={styles.coffee} />
          </div>
          <div className={styles.handle} />
          <span className={styles.sceneBottom}>GOOD COFFEE. SIMPLE PLEASURES.</span>
        </div>
      </section>
      <section className={styles.footer} aria-label="Explore the shop">
        <div>
          <span className={styles.eyebrow}>FIND YOUR FAVORITE</span>
          <h2>Coffee, tea &amp; smoothies.</h2>
          <p>A familiar favorite or a fresh start.</p>
        </div>
        <div>
          <span className={styles.eyebrow}>GET TO KNOW US</span>
          <h2>A place to take a breath.</h2>
          <Link className={styles.textLink} href="/about">
            Read our story <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
