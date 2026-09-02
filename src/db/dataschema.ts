import { title } from "node:process";
import { z } from "zod";


export const dataUsers = z.object({
    username    : z.string().min(8, "Nama wajib diisi!"),
    email       : z.string().max(50, "Email tidak length terlalu panjang"),
    password    : z.string().max(50, "password terlalu panjang")
});


export const dataMovies = z.object({
	// title varchar(100),
    // year YEAR ,
    // rating int,
    // duration int,    
    // genres varchar(100)
    title   : z.string().min(1, "Title wajib diisi!"),
    year    : z.int().min(4, "Year wajib diisi!"),
    rating  : z.string().min(1, "Rating Wajib diisi!"),
    duration    : z.string().min(1, "Duration wajib diisi!"),
    genres      : z.string().min(1," Genres wajib diisi!")
 });