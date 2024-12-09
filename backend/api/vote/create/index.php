<?php
// Include necessary headers for CORS
$allowedOrigins = ["http://final-project-comic-sans-fork.vercel.app", "http://localhost:3001", "http://localhost:3000"];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require_once __DIR__ . "/../../../database/dbconn.php";

session_start();

// // Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Access user data correctly from session
    $userId = $_SESSION['user']['id'] ?? null;
    $username = $_SESSION['user']['name'] ?? null;

    // Decode incoming JSON data
    $postData = json_decode(file_get_contents('php://input'), true);

    // Validate incoming data
    if (!$userId || !$username || !isset($postData['dateId']) || !isset($postData['eventId'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid input."], JSON_PRETTY_PRINT);
        exit();
    }

    $dateId = $postData['dateId'];

    // Insert vote into the database
    $stmt = $mysqli->prepare("INSERT INTO Eventually_Event_User_Voting (FK_User, FK_Event_Dates, UserName) VALUES (?, ?, ?)");
    $stmt->bind_param("iis", $userId, $dateId, $username);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Vote successfully recorded."], JSON_PRETTY_PRINT);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to record vote."], JSON_PRETTY_PRINT);
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Invalid request method."], JSON_PRETTY_PRINT);
}
