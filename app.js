const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
const BRANCH = process.env.APP_BRANCH || "unknown";

app.get("/", (req, res) => {
     res.send(`Jenkins deployment successful - ${BRANCH}`);

});

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        branch: BRANCH
    });
});

app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
});
