import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../_app";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { productId, rating, comment } = req.body;

  try {
    const reviewData = {
      productId,
      rating,
      comment,
      date: new Date(),
      reviewerEmail: session.user.email,
      reviewerName: session.user.name || 'Anonymous'
    };

    const docRef = await addDoc(collection(db, "reviews"), reviewData);

    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      reviewCount: increment(1),
      averageRating: increment(rating / (reviewCount + 1))
    });

    res.status(201).json({ id: docRef.id, ...reviewData });
  } catch (error) {
    res.status(500).json({ error: "Error adding review" });
  }
}