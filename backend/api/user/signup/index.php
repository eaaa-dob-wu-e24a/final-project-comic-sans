<?php
header("Access-Control-Allow-Origin: http://final-project-comic-sans-fork.vercel.app");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../../../database/dbconn.php";

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Get POST data (decode JSON)
$data = json_decode(file_get_contents("php://input"), true);
$name = $data['username'] ?? null;  // Adjusting to "username" as per the frontend form field name
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

// Validate input
if (empty($name) || empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit();
}

// Check if email already exists
$sql = "SELECT Email FROM Eventually_User WHERE Email = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email already registered."]);
    $stmt->close();
    $mysqli->close();
    exit();
}

$stmt->close();

// Hash the password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert user into database
$sql = "INSERT INTO Eventually_User (Name, Email, Password) VALUES (?, ?, ?)";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("sss", $name, $email, $hashed_password);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "User registered successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Registration failed. Please try again."]);
}

// Close connection
$stmt->close();
$mysqli->close();
