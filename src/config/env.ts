import * as dotenv from "dotenv";

const env = String(process.env.NODE_ENV);

if (env === "production") {
  console.log("Loading production environment variables");
  dotenv.config();
} else if (env === "development") {
  console.log("Loading development environment variables");
  dotenv.config({ path: ".env.dev", debug: true });
} else {
  console.info("Node environment not set, resolving to default environment");
  dotenv.config({ path: `${env}.env`, debug: true });
}
