// const http = require("http");

// const server = http.createServer((req, res) => {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("Hello from Custom Build Container!\n");
// });

// server.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });


const http = require("http");
const mysql = require("mysql2");

// Récupérer les variables d'environnement
const host = process.env.MYSQL_HOST;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;


console.log("host", host);
console.log("user", user);
console.log("password", password);



// Créer une connexion MySQL
const connection = mysql.createConnection({
  host: host,
  user: user,
  password: password,
});

// Démarrer le serveur HTTP
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

  // Se connecter et récupérer les bases de données
  connection.connect((err) => {
    if (err) {
      res.end("<h1>Erreur de connexion à la base de données :</h1>" + err.message);
      return;
    }

    connection.query("SHOW DATABASES", (err, results) => {
      if (err) {
        res.end("<h1>Erreur lors de la récupération des bases :</h1>" + err.message);
        return;
      }

      let responseHtml = "<h1>Liste des bases de données :</h1><ul>";
      results.forEach((row) => {
        responseHtml += `<li>${row.Database}</li>`;
      });
      responseHtml += "</ul>";

      res.end(responseHtml);
    });
  });
});

// Écouter sur le port 3000
server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
