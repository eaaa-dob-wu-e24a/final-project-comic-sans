<?php
session_start(); // Start the session for login functionality

require_once __DIR__ . "/../../../database/dbconn.php";

$allowedOrigins = ["https://final-project-comic-sans-fork.vercel.app", "http://localhost:3001", "http://localhost:3000"];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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
    // Get the newly created user's ID
    $userId = $stmt->insert_id;

    // Automatically log the user in
    $_SESSION['user'] = [
        'name' => $name,
        'id' => $userId,
        'email' => $email,
        'imagePath' => null // Default or empty value for imagePath
    ];

    echo json_encode([
        "status" => "success",
        "message" => "User registered and logged in successfully.",
        "user" => $_SESSION['user'], // Return user data for frontend use
        "redirect" => "/dashboard" // Redirect to dashboard after successful registration
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Registration failed. Please try again."]);
}

// Close connection
$stmt->close();
$mysqli->close();
