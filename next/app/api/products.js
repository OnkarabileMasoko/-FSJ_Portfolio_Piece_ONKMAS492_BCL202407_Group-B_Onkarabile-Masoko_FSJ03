import { collection, getDocs, query, limit, startAfter, where, orderBy } from "firebase/firestore";
import { db } from "../_app";

export default async function handler(req, res) {
  const { page = 1, pageSize = 10, search, category, sort } = req.query;

  try {
    let q = collection(db, "products");

    if (search) {
      q = query(q, where("title", ">=", search), where("title", "<=", search + "\uf8ff"));
    }

    if (category) {
      q = query(q, where("category", "==", category));
    }

    if (sort) {
      const [field, direction] = sort.split(":");
      q = query(q, orderBy(field, direction));
    }

    q = query(q, limit(pageSize), startAfter((page - 1) * pageSize));

    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
}
