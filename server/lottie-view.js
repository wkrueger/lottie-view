const express = require("express")
const app = express()
const path = require("path")
const fs = require("fs")
const cors = require("cors")

app.use(cors())
app.options("*", cors())

app.get("/api/initial-folder", (_req, res) => {
  try {
    const folder = path.resolve(__dirname, "..", "animations")
    res.send({ folder })
  } catch (err) {
    next(err)
  }
})

app.get("/api/list-folder", async (req, res, next) => {
  try {
    const whichFolder = req.query.path
    if (!whichFolder) throw Error("Nenhuma pasta selecionada.")
    const results = fs.readdirSync(whichFolder)
    res.send({ files: results.map(x => path.resolve(whichFolder, x)) })
  } catch (err) {
    next(err)
  }
})

app.get("/api/serve", async (req, res, next) => {
  try {
    const whichFile = req.query.path
    res.sendFile(whichFile)
  } catch (err) {
    next(err)
  }
})

app.use(
  "/",
  express.static(path.resolve(__dirname, "..", "dist", "lottie-view"))
)

app.listen(8090, () => console.log("up on 8090"))
