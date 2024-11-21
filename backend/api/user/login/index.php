<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
require_once __DIR__ . "/../../../database/dbconn.php";

session_start();

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);
$username = isset($data['username']) ? $data['username'] : null;
$password = isset($data['password']) ? $data['password'] : null;


if (empty($username) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Username and password are required."]);
    exit;
}

if ($mysqli->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $mysqli->connect_error]);
    exit;
}

$sql = "SELECT * FROM Eventually_User WHERE Name = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
    exit;
}

$user = $result->fetch_assoc();

// Check if 'password' is set in $user and verify the password
//the $user Password is the hashed COLUMN NAME password from the database
if (!isset($user['Password']) || !password_verify($password, $user['Password'])) {
    echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
    exit;
}

$_SESSION['user'] = $user['Name']; // Store the actual username or another unique identifier

http_response_code(200);
echo json_encode(["status" => "success", "user" => $_SESSION["user"]]);

$stmt->close();
$mysqli->close();
