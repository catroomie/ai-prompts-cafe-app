import { Review, Store } from "./types";
import { SEED_REVIEWS, SEED_STORE } from "./seedData";

const STORE_KEY = "google-review-helper:store";
const REVIEWS_KEY = "google-review-helper:reviews";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getStore(): Store {
  if (!isBrowser()) return SEED_STORE;
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) {
    localStorage.setItem(STORE_KEY, JSON.stringify(SEED_STORE));
    return SEED_STORE;
  }
  return JSON.parse(raw) as Store;
}

export function getReviews(): Review[] {
  if (!isBrowser()) return SEED_REVIEWS;
  const raw = localStorage.getItem(REVIEWS_KEY);
  if (!raw) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(SEED_REVIEWS));
    return SEED_REVIEWS;
  }
  return JSON.parse(raw) as Review[];
}

export function saveReview(review: Review): void {
  const reviews = getReviews();
  const index = reviews.findIndex((r) => r.id === review.id);
  if (index >= 0) {
    reviews[index] = review;
  } else {
    reviews.unshift(review);
  }
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}
