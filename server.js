const env = require("./src/config/env"); 
const connectDB = require("./src/config/db");
const app = require("./src/app");

connectDB();

app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`));

