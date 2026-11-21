"use client";
import { FaStar } from "react-icons/fa";

type Props = {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
};

/** Read-only when `onChange` is not given. Clicking the current rating clears it. */
export default function StarRating({ value, onChange, size = 18 }: Props) {
  return (
    <div className="flex items-center gap-0.5" role={onChange ? "radiogroup" : "img"} aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = (
          <FaStar
            size={size}
            className={n <= value ? "text-amber-500" : "text-stone-300 dark:text-stone-600"}
          />
        );
        return onChange ? (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n === value ? 0 : n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            className="transition hover:scale-125"
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}
