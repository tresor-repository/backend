import express from 'express';

const app = express();

app.get('/', (req, res) => res.send("Helloo"));
app.listen(3000, () => console.log("Listengin to port 3000"));
