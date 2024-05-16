const express = require('express')
const app = express()
const port = 3000

app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!')
})

console.log(process.cwd())