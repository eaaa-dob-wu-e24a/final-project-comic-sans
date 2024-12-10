<?php
// Include necessary headers for CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
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
    // Decode incoming JSON data
    $postData = json_decode(file_get_contents('php://input'), true);

    // Extract data
    $userId = $_SESSION['user']['id'] ?? null; // Logged-in user
    $username = $postData['username'] ?? null; // Provided username
    $dateId = $postData['dateId'] ?? null;
    $eventId = $postData['eventId'] ?? null;

    // Validate input
    if ((!$userId && !$username) || !$dateId || !$eventId) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid input."], JSON_PRETTY_PRINT);
        exit();
    }

    // Prepare to insert vote
    $stmt = $mysqli->prepare("INSERT INTO Eventually_Event_User_Voting (FK_User, FK_Event_Dates, UserName) VALUES (?, ?, ?)");
    $userIdValue = $userId ?: null; // Set FK_User to null for guests
    $stmt->bind_param("iis", $userIdValue, $dateId, $username);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Vote successfully recorded."], JSON_PRETTY_PRINT);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to record vote."], JSON_PRETTY_PRINT);
    }

    $stmt->close();
}
