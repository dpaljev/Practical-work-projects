//Importing
import express, { query } from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

const saltRounds = 10;
const jwtKey = "my_secret_key"
const jwtExpirySeconds = 300
const app = express();

app.use(cors());
app.use(express.json());

const port = 3000;

//Create the connection to database
const db = await mysql.createConnection({
  host: "localhost",
  database: "praksa",
  user: "root",
  password: "KingICT3309",
});

//Making the base sql command, reused in most things
const sql = `select items.items_id, items.items_name, items.items_description, items.items_level, items.items_value, types.type_name, users.username as created_by
  from items
  inner join types on items.items_type = types.type_id
  inner join images on items.items_image = images.image_id
  inner join users on items.created_by = users.user_id`;

//Get all items, can sort by name, description and/or type
app.get("/items", async (req, res) => {
  const { name, description, type } = req.query;
  let sqlDuplicate = `${sql} WHERE items.items_type like ? `;
  if (name){
    sqlDuplicate = sqlDuplicate + ` and items.items_name like "%${name}%"`
  }
  if (description) {
    sqlDuplicate = sqlDuplicate + ` and items.items_description like "%${description}%"`
  }
  const [rows] = await db.query(sqlDuplicate, [type || "%"]);
  res.send(rows);
});

//Get item by specific id
app.get("/items/:id", async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query(`${sql} where items.items_id = ?`, [id]);
  res.send(rows);
});

//Get item by type
app.get("/items-by-type/:type", async (req, res) => {
  let { type } = req.params;
  const [rows] = await db.query(`${sql} where items.items_type = ?`, [type]);
  res.send(rows);
});

//Update item with a specific id
app.patch("/items-update/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const [rows] = await db.query("update items set items.items_name = ? where items.items_id like ?", [name, id]);
  res.send(rows);
});

//Delete item with a specific id
app.delete("/items/:id", async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("delete from items where items.items_id = ?", [id]);
  res.send(rows);
});

//Signin for users  -- TODO
app.post("/signin", (req, res) => {
	const { username, password } = req.body
	if (!username || !password) {


		return res.status(401).send();
	}
	const token = jwt.sign({ username }, jwtKey, {
		algorithm: "HS256",
		expiresIn: jwtExpirySeconds,
	})
	res.send()
})

//Register new users  -- TODO
app.post("/register", async (req, res) => {
  const {username, email, password} = req.body
  bcrypt.hash(password, saltRounds, function(err, hash) {
    const sqlUserReg = (`insert into users values (?, ?, ?)`, [username, email, hash]);
    const [rows] = await db.query(sqlUserReg)
    res.send(rows);
});
  
})

app.listen(port, () => {
  console.log(`Serving app on http://localhost:${port}`);
});