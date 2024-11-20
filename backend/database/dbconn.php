<?php
require_once __DIR__ . "/../loadenv.php"; // load the env function from file

$dotenv = loadenv(__DIR__ . '/../.env');

$host = $dotenv['DB_HOST'];
$username = $dotenv['DB_USER'];
$password = $dotenv['DB_PASSWORD'];
$database = $dotenv['DB_NAME'];

$mysqli = new mysqli($host, $username, $password, $database);


if ($mysqli->connect_error) {
    die('Connect Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error);
}

//Example of how to query the database

$sql = "SELECT * FROM Eventually_User"; // Replace `Eventually_User` with your table name
$result = $mysqli->query($sql);

if ($result && $result->num_rows > 0) {
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row; // Add each row to the users array
    }

    // Output as JSON (e.g., for use in an API)
    header('Content-Type: application/json');
    echo json_encode($users, JSON_PRETTY_PRINT);
} else {
    echo "No records found.";
}
