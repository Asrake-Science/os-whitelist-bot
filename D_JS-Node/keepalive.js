const express = require("express")
const app = express()
const port = process.env.PORT || 3001
app.get("/", (req, res) => {
    res.send("Octavio health 100%")
})
const keepalive = () => {
    app.listen(port, "0.0.0.0", function () {
    // console.log(`Server listening on port ${port}\n`);
    })
}
module.exports.keepalive = keepalive
