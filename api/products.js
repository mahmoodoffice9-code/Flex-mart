const { MongoClient } = require('mongodb');

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('ecommerce_store');
  cachedDb = db;
  return db;
}

module.exports = async (req, res) => {
  // CORS headers enable karne ke liye
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection('products');

    if (req.method === 'GET') {
      const products = await collection.find({}).toArray();
      return res.status(200).json(products);
    } 
    
    if (req.method === 'POST') {
      const newProduct = req.body;
      const result = await collection.insertOne(newProduct);
      return res.status(201).json({ message: 'Product added!', id: result.insertedId });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
