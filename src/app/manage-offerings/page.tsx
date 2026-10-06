"use client";

import { useCallback, useEffect, useState } from "react";
import OfferingForm, { type OfferingFormValues } from "@/components/OfferingForm";
import {
  fetchOfferings,
  isOfferingCategory,
  OfferingApiError,
  parseOfferingPrice,
  sortOfferings,
  submitOffering,
  validateOfferingInput,
} from "@/lib/offerings";
import { DEFAULT_SPECIAL_OFFER, type CreateOfferingInput, type Offering } from "@/types/offering";
import styles from "@/styles/manage-offerings.module.css";

const initialFormState: OfferingFormValues = {
  name: "",
  description: "",
  price: "",
  category: "Coffee",
  specialOffer: DEFAULT_SPECIAL_OFFER,
};

export default function ManageOfferingsPage() {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [formValues, setFormValues] = useState<OfferingFormValues>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "info" | "success" | "error";
    text: string;
  } | null>(null);

  const loadOfferings = useCallback(async () => {
    setIsLoading(true);
    try {
      const nextOfferings = await fetchOfferings();
      setOfferings(sortOfferings(nextOfferings));
      setLoadError("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "The offering list could not be loaded.";
      setLoadError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOfferings().catch(() => undefined);
  }, [loadOfferings]);

  const updateField = <K extends keyof OfferingFormValues>(field: K, value: OfferingFormValues[K]) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const submission: Partial<CreateOfferingInput> = {
      name: formValues.name,
      description: formValues.description,
      category: formValues.category,
      price: parseOfferingPrice(formValues.price),
      specialOffer: formValues.specialOffer,
    };

    const nextErrors = validateOfferingInput(submission);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFeedback({
        tone: "error",
        text: "Please fix the highlighted fields before saving.",
      });
      return;
    }

    const savedAttempt = { ...formValues };
    setIsSubmitting(true);
    setFeedback({ tone: "info", text: "Saving offering..." });
    setErrors({});

    try {
      const createdOffering = await submitOffering(submission);
      setOfferings((current) => sortOfferings([...current, createdOffering]));
      setFormValues(initialFormState);
      setFeedback({ tone: "success", text: "Offering saved successfully." });

      try {
        await loadOfferings();
      } catch {
        setFeedback({
          tone: "success",
          text: "Offering saved, but the list could not refresh. Please reload the page to confirm the update.",
        });
      }
    } catch (error) {
      setFormValues(savedAttempt);
      if (error instanceof OfferingApiError) {
        setErrors(error.fields);
      }
      setFeedback({
        tone: "error",
        text: error instanceof Error ? error.message : "The offering could not be saved.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Manage offerings</h1>
        <p>Review current offerings, add new items, and confirm the latest list state.</p>
      </header>

      {feedback ? (
        <div
          aria-live="polite"
          className={`${styles.feedback} ${
            feedback.tone === "success"
              ? styles.feedbackSuccess
              : feedback.tone === "error"
                ? styles.feedbackError
                : styles.feedbackInfo
          }`}
        >
          {feedback.text}
        </div>
      ) : null}

      <div className={styles.layout}>
        <section className={styles.panel} aria-label="Offerings list">
          <h2>Current offerings</h2>

          {isLoading ? (
            <p className={styles.helperText}>Loading current offerings…</p>
          ) : loadError ? (
            <p className={styles.inlineError}>{loadError}</p>
          ) : offerings.length === 0 ? (
            <div className={styles.empty}>No offerings are available right now.</div>
          ) : (
            <div className={styles.list}>
              {offerings.map((offering) => (
                <article key={offering.ID} className={styles.offerItem}>
                  <h3>{offering.name}</h3>
                  <div className={styles.offerMeta}>
                    <span>{offering.category}</span>
                    <span>{`$${offering.price.toFixed(2)}`}</span>
                    {offering.specialOffer ? <span className={styles.badge}>Special offer</span> : null}
                  </div>
                  <p>{offering.description}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className={styles.panel} aria-label="Create offering form">
          <h2>Add offering</h2>

          <div className={styles.booleanRow}>
            <input
              id="special-offer"
              type="checkbox"
              checked={formValues.specialOffer}
              onChange={(event) => updateField("specialOffer", event.target.checked)}
            />
            <label htmlFor="special-offer">Special offer</label>
          </div>

          <OfferingForm
            formValues={formValues}
            errors={errors}
            isSubmitting={isSubmitting}
            onFieldChange={updateField}
            onSubmit={handleSubmit}
            specialOffer={formValues.specialOffer}
          />
        </section>
      </div>
    </main>
  );
}
