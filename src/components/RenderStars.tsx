import { Star } from "lucide-react";

export const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={`star-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <Star key="half-star" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
    );
  }

  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star key={`empty-star-${i}`} className="w-4 h-4 text-gray-300" />
    );
  }

  return <div className="flex gap-1">{stars}</div>;
}; 