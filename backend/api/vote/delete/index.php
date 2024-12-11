<?php
// Include necessary headers for CORS
$allowedOrigins = ["https://final-project-comic-sans-fork.vercel.app", "http://localhost:3001", "http://localhost:3000"];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require_once __DIR__ . "/../../../database/dbconn.php";

session_start(['cookie_secure' => true, 'cookie_samesite' => 'None']);;

// // Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Access user data correctly from session
    $userId = $_SESSION['user']['id'] ?? null;

    // Decode incoming JSON data
    $postData = json_decode(file_get_contents('php://input'), true);

    // Validate incoming data
    if (!$userId || !isset($postData['dateId']) || !isset($postData['eventId'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid input."], JSON_PRETTY_PRINT);
        exit();
    }

    $dateId = $postData['dateId'];

    // Delete vote from the database
    $stmt = $mysqli->prepare("DELETE FROM Eventually_Event_User_Voting WHERE FK_User = ? AND FK_Event_Dates = ?");
    $stmt->bind_param("ii", $userId, $dateId);

    if ($stmt->execute() && $stmt->affected_rows > 0) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Vote successfully removed."], JSON_PRETTY_PRINT);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to remove vote or vote not found."], JSON_PRETTY_PRINT);
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Invalid request method."], JSON_PRETTY_PRINT);
}
