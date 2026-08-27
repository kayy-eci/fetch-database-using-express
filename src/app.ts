import express, { type Express, type Request, type Response } from 'express';
import cors from "cors";
import pool from './db/index..ts';
import type { ResultSetHeader } from "mysql2/promise";


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


app.post("/api/users", async (req: Request, res: Response) => {
  try {
    const { username, email, password} = req.body;

    const [users] = await pool.query<ResultSetHeader>(`INSERT INTO users (username, email, password) VALUES(?, ?, ?)`, [username, email, password]);

    res.status(201).json({
      message: "Users created succesfully",
      data: {
        usersId: users.insertId,
        username,
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create users"
    })
  }
});

app.post("/api/movies", async (req: Request, res: Response) => {
  try {
    const { title, year, rating, duration, genres} = req.body;

    const [movies] = await pool.query<ResultSetHeader>(`INSERT INTO movies (title, year, rating, duration, genres) VALUES(?, ?, ?, ?, ?)`, 
      [title, year, rating, duration, genres]
    )

    res.status(201).json({
      message: "Movie was added to the list!",
      data: {
        moviesId: movies.insertId,
        title,
        year,
        rating,
        duration,
        genres
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add movie"
    })
  }
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


	// title varchar(100),
  //   year YEAR ,
  //   rating int,
  //   duration int, 
  //   genres varchar(100)