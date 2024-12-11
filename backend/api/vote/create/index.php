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

    // Check for duplicate usernames for the same event date
    $checkStmt = $mysqli->prepare("
    SELECT COUNT(*) 
    FROM Eventually_Event_User_Voting 
    WHERE FK_Event_Dates = ? AND UserName = ?
");
    $checkStmt->bind_param("is", $dateId, $username);
    $checkStmt->execute();
    $checkStmt->bind_result($count);
    $checkStmt->fetch();
    $checkStmt->close();

    if ($count > 0) {
        http_response_code(409); // Conflict status code
        echo json_encode(["status" => "error", "message" => "Username already exists for this event date."], JSON_PRETTY_PRINT);
        exit();
    }

    // Proceed to insert vote
    $stmt = $mysqli->prepare("
    INSERT INTO Eventually_Event_User_Voting (FK_User, FK_Event_Dates, UserName) 
    VALUES (?, ?, ?)
");
    $userIdValue = $userId ?: null;
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
