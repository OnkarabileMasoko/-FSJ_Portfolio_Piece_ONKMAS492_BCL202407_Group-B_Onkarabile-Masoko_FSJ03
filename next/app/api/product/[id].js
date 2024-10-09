import { doc, getDoc } from "firebase/firestore";
import { db } from "../../_app";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      res.status(200).json({ id: docSnap.id, ...docSnap.data() });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching product" });
  }
}