<?php
session_start();

require_once __DIR__ . "/../../../database/dbconn.php";

$allowedOrigins = ["https://final-project-comic-sans-fork.vercel.app", "http://localhost:3001", "http://localhost:3000"];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// Check if user is logged in
if (!isset($_SESSION['user']['id'])) {
    http_response_code(401);
    echo json_encode(["error" => "User not authenticated"]);
    exit;
}

$userID = $_SESSION['user']['id'];

// Delete user from database
$stmt = $mysqli->prepare("DELETE FROM Eventually_User WHERE PK_ID = ?");
$stmt->bind_param("i", $userID);

if ($stmt->execute()) {
    // Clear session
    session_destroy();
    http_response_code(200);
    echo json_encode(["message" => "Account deleted successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to delete account"]);
}

$stmt->close();
$mysqli->close();
