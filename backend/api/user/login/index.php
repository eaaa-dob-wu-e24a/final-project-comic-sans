<?php
header("Access-Control-Allow-Origin: http://final-project-comic-sans-fork.vercel.app");
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
require_once __DIR__ . "/../../../database/dbconn.php";

session_start();

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);
$email = isset($data['email']) ? $data['email'] : null;
$password = isset($data['password']) ? $data['password'] : null;


if (empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Email and password are required."]);
    exit;
}

if ($mysqli->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $mysqli->connect_error]);
    exit;
}

$sql = "SELECT * FROM Eventually_User WHERE Email = ?";
$stmt = $mysqli->prepare($sql);
//binds the parameter to the SQL query ? placeholder in $sql
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Invalid email or password."]);
    exit;
}

$user = $result->fetch_assoc();

// Check if 'password' is set in $user and verify the password
//the $user Password is the hashed COLUMN NAME password from the database
if (!isset($user['Password']) || !password_verify($password, $user['Password'])) {
    echo json_encode(["status" => "error", "message" => "Invalid email or password."]);
    exit;
}

$_SESSION['user'] = [
    'name' => $user['Name'],
    'id' => $user['PK_ID'],
    'email' => $user['Email'],
    'imagePath' => $user['ImagePath']
]; // Store the actual username, primary key ID, email, and image path

http_response_code(200);
echo json_encode(["status" => "success", "user" => $_SESSION['user']]);

$stmt->close();
$mysqli->close();
