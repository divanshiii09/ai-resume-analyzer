// Local development entry point. On Vercel the app is served by api/index.js
// instead, which imports ./app directly and never binds a port.
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
