const mongoose = require("mongoose");

// A warm serverless instance reuses module scope, but the platform may also
// re-evaluate modules. globalThis survives more of that than a module-level let.
const cache =
  globalThis.__mongoose__ ||
  (globalThis.__mongoose__ = { conn: null, promise: null });

async function connectDB() {
  // readyState 1 === connected
  if (cache.conn && cache.conn.connection.readyState === 1) {
    return cache.conn;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set");
  }

  // Concurrent requests on the same instance share one in-flight connect
  // instead of each opening its own pool.
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(process.env.MONGO_URI, {
        // Every concurrent function instance opens its own pool, and Atlas
        // shared tiers cap total connections aggressively. Keep it small.
        maxPoolSize: 5,
        minPoolSize: 0,
        // Fail fast rather than hanging until the platform kills the function.
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 20000,
      })
      .then((m) => {
        cache.conn = m;
        console.log("MongoDB connected");
        return m;
      })
      .catch((err) => {
        // Clear the promise so the next invocation retries instead of
        // permanently serving a rejected promise out of the cache.
        cache.promise = null;
        throw err;
      });
  }

  return cache.promise;
}

module.exports = connectDB;
