"use client";

import { useId } from "react";
import styles from "@/styles/special-offering-control.module.css";

type SpecialOfferingControlProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
};

export default function SpecialOfferingControl({ checked, onChange }: SpecialOfferingControlProps) {
  const id = useId();
  return (
    <label className={styles.control} htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.currentTarget.checked)} />
      <span>Special offering</span>
    </label>
  );
}
