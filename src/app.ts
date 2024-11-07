import express, { Express, Request, Response } from "express";
import marked, { Marked } from "marked";
import { gen } from "./calendar";
import fs from "fs";
import path from "path";
import { title } from "process";

const app = express();
const ARGS = process.argv;
let PORT: number = 7777;

if (ARGS.length > 2) {
  PORT = Number(ARGS[2]);
}

app.use(express.static(path.join(__dirname, "../static")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/views"));

/* loader? */
function load_md(file: string) {
  let data = fs.readFileSync(
    path.join(__dirname, "../src/pages/", file),
    "utf8"
  );
  return marked.parse(data);
}



/*WebGl Loader*/

let glRender: string = `<canvas id="gl" width="400" height="400"></canvas>`;

app.get("/", (req, res) => {
  console.log(`[${new Date}] ${req.ip}`);
  res.render("index", {
    titleName: "Home ",
    aboutus: load_md("index.md"),
    faq: load_md("faq.md"),
    prefix: "",
    Title: `Welcome to <span style="color: #daa520">MeteaCSC</span>`,
    suffix: glRender
  });
});
/* ---- */

app.get("/calendar", (req, res) => {
  res.render("calendar", {
    titleName: "Calendar ",
    data: gen(new Date()),
  });
});

app.get("/resources", (req, res) => {
  res.render("resources.ejs", {
    titleName: "Resources ",
    resources: load_md("resources.md"),
  });
});

app.get("/leaderboards", (req, res) => {
  res.render("placesholder.ejs", {
    titleName: "Leaderboards ",
  });
});

const welcomeString: Buffer = fs.readFileSync(path.join(__dirname, "../static/images/ascii.txt"));

let server = app.listen(PORT, () => {
  console.log(`${new Date}`)
  console.log(`${welcomeString}`)
  console.log("Started express server on", server.address());
});
