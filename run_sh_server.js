const http = require("http");
const { spawn } = require("child_process");
const path = require('path');
const url = require('url');
const fs = require('fs');


const defaultScriptName = 'default.sh';
const scriptFolderPath = path.join(__dirname, 'scripts');
const appPort = 3000;

const requestListener = function (req, res) {
    console.log(`Got a request from ${req.connection.remoteAddress}`);
    res.setHeader("Content-Type", " text/plain");
    res.writeHead(200);
    res.write(":: Starting script execution... ::\n\n");

    const parsedUrl = url.parse(req.url, true);
    const urlPathItems = parsedUrl.pathname.split('/');
    const scriptName = urlPathItems[urlPathItems.length - 1] || defaultScriptName;
    const scriptPath = path.join(scriptFolderPath, scriptName);

    if (!fs.existsSync(scriptPath)) {
        res.write("Error: Script not found at path: " + scriptPath);
        return res.end()
    }

    console.log("Running the script: " + scriptPath);
    const process = spawn(scriptPath);

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
        res.write(":: Error occurred: " + error.message );
    });

    process.on("close", code => {
        console.log(`Script exited with code ${code}`);
        res.end('\n:: Script execution finished ::');
    });
};

http.createServer(requestListener)
.listen(appPort, '0.0.0.0', () => {
    console.log(`⚡️ Service is started.`);
    console.log(`To run the default script go to: http://localhost:${appPort}`);
    console.log(`Do not forget to give execution access, e.g: chmod +x ./scripts/*.sh`);

    const scripts = fs.readdirSync(scriptFolderPath, {withFileTypes: true}).filter(item => !item.isDirectory());
    if (scripts.length) {
        console.log(`\nFounded ${scripts.length} scripts at: ${scriptFolderPath}`);
        scripts.map(file => `http://localhost:${appPort}/${file.name}`).forEach(url => console.log(url))
    } else {
        console.error("No scripts found at: " + scriptFolderPath);
    }
});