// Question: which of three homepage structures best introduces the shop and helps
// visitors reach Menu and Specials? Shareable on /?variant=A, B, or C.
import Link from "next/link";
import PrototypeSwitcher from "@/components/PrototypeSwitcher";
import styles from "@/styles/homepage-prototype.module.css";

export function VariantA() {
  return (
    <main className={`${styles.page} ${styles.warm}`}>
      <div className={styles.masthead}>
        <span>COFFEE SHOP</span>
        <span>A little pause. A good cup.</span>
      </div>
      <section className={styles.warmHero}>
        <div>
          <p className={styles.eyebrow}>MAKE YOURSELF AT HOME</p>
          <h1>
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
      <section className={styles.warmFooter} aria-label="Explore the shop">
        <div>
          <span className={styles.eyebrow}>FIND YOUR FAVORITE</span>
          <h2>Coffee, tea & smoothies.</h2>
          <p>A familiar favorite or a fresh start.</p>
        </div>
        <div>
          <span className={styles.eyebrow}>GET TO KNOW US</span>
          <h2>A place to take a breath.</h2>
          <Link className={styles.textLink} href="/about">
            Read our story ↗
          </Link>
        </div>
      </section>
    </main>
  );
}

export function VariantB() {
  return (
    <main className={`${styles.page} ${styles.editorial}`}>
      <div className={styles.masthead}>
        <span>COFFEE SHOP / THE DAILY PAUSE</span>
        <span>Come as you are.</span>
      </div>
      <section className={styles.editorialHero}>
        <p className={styles.eyebrow}>FOR YOUR EVERYDAY RITUAL</p>
        <h1>
          Good coffee.
          <br />
          <em>Better company.</em>
        </h1>
        <div className={styles.editorialBottom}>
          <p>Some days call for a familiar cup. Others call for something different. There’s a little of both here.</p>
          <Link href="/menu" className={styles.roundLink}>
            Find your
            <br />
            next cup <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <section className={styles.editorialRows} aria-label="Explore the shop">
        <Link href="/specials">
          <span>01 / SOMETHING DIFFERENT</span>
          <h2>Meet the specials.</h2>
          <span aria-hidden="true">↗</span>
        </Link>
        <Link href="/about">
          <span>02 / A LITTLE ABOUT US</span>
          <h2>More than a coffee break.</h2>
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}

export function VariantC() {
  return (
    <main className={`${styles.page} ${styles.menuFirst}`}>
      <aside className={styles.menuIntro}>
        <p className={styles.eyebrow}>COFFEE SHOP</p>
        <h1>
          What sounds
          <br />
          good today?
        </h1>
        <p>Start with a favorite. Explore something new. Make a little time for yourself.</p>
        <Link href="/about" className={styles.textLink}>
          Get to know the shop ↗
        </Link>
        <span className={styles.introNote}>YOUR NEXT COFFEE BREAK STARTS HERE.</span>
      </aside>
      <section className={styles.directory} aria-label="Choose where to explore">
        <p className={styles.eyebrow}>TAKE A LOOK AROUND</p>
        <Link href="/menu" className={styles.menuCard}>
          <div>
            <span className={styles.number}>01</span>
            <h2>The menu</h2>
            <p>
              Coffee, tea and smoothies.
              <br />
              All your options in one place.
            </p>
          </div>
          <span className={styles.cardArrow} aria-hidden="true">
            ↗
          </span>
        </Link>
        <Link href="/specials" className={styles.specialCard}>
          <div>
            <span className={styles.number}>02</span>
            <h2>Our specials</h2>
            <p>Discover what we’re featuring.</p>
          </div>
          <span className={styles.cardArrow} aria-hidden="true">
            ↗
          </span>
        </Link>
        <Link href="/contact" className={styles.contactRow}>
          <span>Have something on your mind?</span>
          <strong>Get in touch ↗</strong>
        </Link>
      </section>
    </main>
  );
}

export default function HomepagePrototype({ variant }: { variant?: string }) {
  const selected = variant === "B" || variant === "C" ? variant : "A";
  return (
    <>
      <div className={styles.prototypeNote}>Homepage design prototype · Illustrative copy · No live menu data</div>
      {selected === "B" ? <VariantB /> : selected === "C" ? <VariantC /> : <VariantA />}
      <PrototypeSwitcher current={selected} />
    </>
  );
}
