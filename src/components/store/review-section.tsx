"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { submitReview } from "@/lib/actions/reviews";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: Date;
  user: { name: string; image: string | null };
}

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  userReview: Review | null;
  userId: string | null;
}

export function ReviewSection({ productId, reviews, userReview, userId }: ReviewSectionProps) {
  const [rating, setRating] = useState(userReview?.rating ?? 5);
  const [title, setTitle] = useState(userReview?.title ?? "");
  const [body, setBody] = useState(userReview?.body ?? "");
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await submitReview({ productId, rating, title, body });
      setSubmitted(true);
    });
  }

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="mb-6 text-xl font-bold tracking-tight">
        Reseñas ({reviews.length})
      </h2>

      {userId && !userReview && !submitted && (
        <div className="mb-8 rounded border border-border p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
            Deja tu reseña
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Calificación</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-colors ${
                      star <= rating ? "text-primary" : "text-muted"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Resumen de tu experiencia"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Comentario</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                className="w-full rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Cuéntanos sobre el producto..."
              />
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Enviando..." : "Publicar reseña"}
            </Button>
          </form>
        </div>
      )}

      {submitted && (
        <p className="mb-6 rounded bg-primary/10 px-4 py-3 text-sm text-primary">
          ¡Gracias por tu reseña! Será visible en breve.
        </p>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no hay reseñas. ¡Sé el primero!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded border border-border p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-primary" : "text-muted"}>
                        ★
                      </span>
                    ))}
                  </div>
                  {review.title && (
                    <p className="mt-1 font-semibold">{review.title}</p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString("es-MX")}
                </span>
              </div>
              {review.body && (
                <p className="mt-2 text-sm text-muted-foreground">{review.body}</p>
              )}
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                — {review.user.name}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
