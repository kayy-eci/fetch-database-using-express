import express, { type Express, type Request, type Response } from 'express';
import cors from "cors";
import pool from './db/index..ts';


const app: Express = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get("/api/users", async (req: Request, res: Response) => {
    const [users] = await pool.query("select * from users;")

    res.status(200).json({
        message: "Berhasil fetch users!",
        data : users
    })
})

app.post("/api/login", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Berhasil login"
  })
})

app.get("/api/movies", async (req: Request, res: Response) => {
  const [movies] = await pool.query("select * from movies;")

  res.status(200).json({
    message: "berhasil fetch data movies!",
    data : movies
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});