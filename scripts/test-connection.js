// Test MongoDB Connection
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || "mongodb+srv://<db_username>:ridoy007@cluster0.0b7ezwy.mongodb.net/aievent?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    console.log('🔄 Connecting to MongoDB...');
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database connection
    const db = client.db("aievent");
    const collections = await db.listCollections().toArray();
    console.log('📊 Database: aievent');
    console.log(`📁 Collections: ${collections.length > 0 ? collections.map(c => c.name).join(', ') : 'None (database will be created on first use)'}`);
    
    // Test collections
    const usersCount = await db.collection('users').countDocuments();
    const eventsCount = await db.collection('events').countDocuments();
    console.log(`👥 Users: ${usersCount}`);
    console.log(`📅 Events: ${eventsCount}`);
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    if (error.message.includes('authentication')) {
      console.error('\n💡 Make sure to replace <db_username> in .env.local with your actual MongoDB username');
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log('🔌 Connection closed');
  }
}

run().catch(console.dir);

