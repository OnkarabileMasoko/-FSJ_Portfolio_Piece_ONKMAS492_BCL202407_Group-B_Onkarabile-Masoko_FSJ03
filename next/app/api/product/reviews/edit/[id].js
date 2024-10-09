import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../_app";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  const { rating, comment } = req.body;

  try {
    const reviewRef = doc(db, "reviews", id);
    const reviewSnap = await getDoc(reviewRef);

    if (!reviewSnap.exists()) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (reviewSnap.data().reviewerEmail !== session.user.email) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await updateDoc(reviewRef, {
      rating,
      comment,
      date: new Date()
    });

    res.status(200).json({ message: "Review updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating review" });
  }
}
