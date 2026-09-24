import Link from "next/link";
import styles from "@/styles/navbar.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/specials", label: "Specials" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <nav className={styles.nav} aria-label="Main">
      <ul className={styles.list}>
        {links.map((link) => (
          <li key={link.href}>
            <Link className={styles.link} href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
