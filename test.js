const fs = require("fs");

console.log("Running Jenkins test...");

if (fs.existsSync("app.js")) {
    console.log("app.js exists");
    console.log("TEST PASSED");
    process.exit(0);
} else {
    console.log("app.js not found");
    console.log("TEST FAILED");
    process.exit(1);
}
