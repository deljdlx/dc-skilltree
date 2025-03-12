<?php
$host = getenv('MYSQL_HOST');
$user = getenv('MYSQL_USER');
$password = getenv('MYSQL_PASSWORD');

$conn = new mysqli($host, $user, $password);
if ($conn->connect_error) {
    die("Erreur de connexion : " . $conn->connect_error);
}

$result = $conn->query("SHOW DATABASES");

echo "<h1>Liste des bases de données :</h1>";
echo "<ul>";
while ($row = $result->fetch_assoc()) {
    echo "<li>" . $row['Database'] . "</li>";
}
echo "</ul>";

$conn->close();
?>
