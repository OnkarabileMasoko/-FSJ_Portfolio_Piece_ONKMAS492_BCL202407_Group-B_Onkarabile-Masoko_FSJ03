import { useState } from 'react';

export default function ReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/reviews/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, rating, comment }),
    });

    if (res.ok) {
      setRating(5);
      setComment('');
      onReviewAdded();
    } else {
      alert('Error submitting review');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a Review</h3>
      <div>
        <label>
          Rating:
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num} stars</option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Comment:
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
        </label>
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
}

// File: components/ReviewList.js
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  async function fetchReviews() {
    const res = await fetch(`/api/reviews/${productId}`);
    const data = await res.json();
    setReviews(data);
  }

  async function handleDelete(reviewId) {
    const res = await fetch(`/api/reviews/delete/${reviewId}`, { method: 'DELETE' });
    if (res.ok) {
      fetchReviews();
    } else {
      alert('Error deleting review');
    }
  }

  return (
    <div>
      {reviews.map((review) => (
        <div key={review.id}>
          <p>Rating: {review.rating} stars</p>
          <p>{review.comment}</p>
          <p>By: {review.reviewerName} on {new Date(review.date).toLocaleDateString()}</p>
          {session && session.user.email === review.reviewerEmail && (
            <button onClick={() => handleDelete(review.id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
}