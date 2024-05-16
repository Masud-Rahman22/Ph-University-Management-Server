const mongoose = require('mongoose');

async function main() {
    await mongoose.connect(process.env.DATABASE_URL);
}

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})