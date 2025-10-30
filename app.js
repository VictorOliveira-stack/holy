require("dotenv").config();

const express = require("express")
const app = express()
const port = 3000
const path = require("path")


app.use(express.json())
app.use(express.urlencoded({extended: true}))

//conecção neon

/*
const http = require("http");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

const requestHandler = async (req, res) => {
  const result = await sql`SELECT version()`;
  const { version } = result[0];
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(version);
};

http.createServer(requestHandler).listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});*/
//conecção neons

/*app.get("/",(req, res)=>{
    res.sendFile(path.join(__dirname, "views/index.html"))
})

app.get("/posts",(req,res)=>{
    res.sendFile(path.join(__dirname, "views/posts.html"))
})*/

//middlewheres
const router = require("./router/router.js")//router entre paginas
    app.use("/", router)

const posts = require("./router/post.js")
    app.use("/", posts)

app.get("/",(req, res)=>{
        res.sendFile(path.join(__dirname, "views/index.html"))
    })

app.listen(port||80, ()=>{
    console.log(`olá rodando ${port}`)
})
