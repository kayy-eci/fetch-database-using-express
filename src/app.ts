import express, { type Express, type Request, type Response } from 'express';
import cors from "cors";
import pool from './db/index..ts';
import type { ResultSetHeader } from "mysql2/promise";
import { dataUsers, dataMovies } from './db/dataschema.ts';
import { number } from 'zod';

const app: Express = express();
const port = 8000;

app.use(cors());
app.use(express.json());

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
  });
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
    const validasiData  = dataUsers.parse(req.body);

    const { username, email, password} = validasiData;

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
    const validasiData = dataMovies.parse(req.body)

    const { title, year, rating, duration, genres} = validasiData;

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


app.put("/api/movies", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const validasiData = dataMovies.parse(req.body);

    const {title, year, rating, duration, genres} = validasiData;

    const [movies] = await pool.query<ResultSetHeader>(
      "UPDATE movies SET title = ?, year = ?, rating = ?, duration = ?, genres = ? WHERE id = ?",
      [id, title, year, rating, duration, genres]
    );

    const updateMovies = movies as any;

    if (updateMovies.affectedRows == 0) {
      res.status(404).json({
        message : "error"
      });
      return;
    }

    res.status(200).json({
      message: "Data movies berhasil diupdate"
  });
  } catch (error){
    res.status(400).json({
      message: "Data movies tidak valid"
    });
  };
});

app.put("/api/users",  async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const validasiData = dataUsers.parse(req.body);

    const {username, email, password} = validasiData;

    const [users]= await pool.query("UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?", [id, username, email, password]);

    const updateUsers = users as any;

    if (updateUsers.affectedRows == 0){
      res.status(404).json({
        message: "error"
      });

      return
    }
    res.status(200).json({
      message: "data user berhasil di update"
    })
  } catch (error) {
    res.status(400).json({
      message: "data user tidak valid"
    })
  }
})

app.delete("/api/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [users] = await pool.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    );

    const deleteUsers = users as any;

    if (deleteUsers.affectedRows === 0) {
      res.status(404).json({
        message: "user tidak ditemukan",
      });

      return;
    }

    res.status(200).json({
      message: "user berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus user",
    });
  }
});

app.delete("/api/movies/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [movies] = await pool.query(
      "DELETE FROM movies WHERE id = ?",
      [id]
    );

    const deleteMovies = movies as any;

    if (deleteMovies.affectedRows === 0) {
      res.status(404).json({
        message: "movie tidak ditemukan",
      });

      return;
    }

    res.status(200).json({
      message: "movie berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "movie menghapus user",
    });
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