const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const { exec } = require("child_process");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = 3003;

const limiter = rateLimit({
    windowMs: 1000,
    max: 2,
    message: { valid: false, error: "Trop de requêtes. Attendez un peu avant de réessayer." }
});

app.use(cors());
app.use(bodyParser.json({ limit: "10kb" }));
app.use(limiter);

app.post("/validate", (req, res) => {
    const yamlContent = req.body.yaml;
    console.log(yamlContent);

    if (!yamlContent) {
        return res.status(400).json({ valid: false, error: "Aucun YAML fourni" });
    }

    const tempFile = `/tmp/docker-compose-validation-${Date.now()}.yml`;
    fs.writeFileSync(tempFile, yamlContent);

    exec(`docker compose -f ${tempFile} config`, (error, stdout, stderr) => {
        fs.unlink(tempFile, (err) => {
            if (err) console.error("\x1b[31mErreur suppression fichier :\x1b[0m", err);
        });

        console.log("\x1b[34m%s\x1b[0m", stdout);
        console.error("\x1b[31m%s\x1b[0m", stderr);

        if (stderr) {
          let error = stderr;
          error = error.replace(/.*?\.yml/, '');
          return res.status(200).json({ valid: false, error: error });
        }
        return res.json({ valid: true, output: stdout });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur Docker Validator en ligne sur http://localhost:${PORT}`);
});
