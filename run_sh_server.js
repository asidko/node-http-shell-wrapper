const http = require("http");
const { spawn } = require("child_process");
const path = require('path');


const scriptName = 'run.sh';
const appPort = 3000;

const requestListener = function (req, res) {
    console.log(`Got a request from ${req.connection.remoteAddress}`);

    res.setHeader("Content-Type", " text/plain");
    res.writeHead(200);

    res.write(":: Starting script execution... ::\n");

    const runShPath = path.join(__dirname, scriptName);
    console.log("Running the script: " + runShPath);

    const process = spawn(runShPath);

    process.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
        res.write(data);
    });

    process.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
        res.write(data);
    });

    process.on('error', (error) => {
        console.log(`error: ${error.message}`);
        res.write(" :: Error occurred: " + error.message);
    });

    process.on("close", code => {
        console.log(`Script exited with code ${code}`);
        res.end(':: Script execution finished ::');
    });
};

http.createServer(requestListener)
.listen(appPort, '0.0.0.0', () => {
    console.log(`⚡️ Service is started on: http://localhost:${appPort}`);
    console.log(`Do not forget to give execution access: chmod +x ${scriptName}`);
});