import app from "./app";

const PORT = Number(process.env.PORT) || 80;

app.listen(PORT, () => {
  console.log(`Service running on localhost:${PORT}`);
});
