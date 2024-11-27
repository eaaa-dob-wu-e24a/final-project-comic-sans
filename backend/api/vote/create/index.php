<?php
// Include necessary headers for CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require_once __DIR__ . "/../../../database/dbconn.php";


echo "Hello from vote create";
// function showError($msgString)
// {
//     $msg = ["status" => "error", "message" => $msgString];
//     echo json_encode($msg, JSON_PRETTY_PRINT);
// }

// session_start();

// // Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// if ($_SERVER['REQUEST_METHOD'] === 'POST') {

//     if (isset($_SESSION['user_id']) && isset($_POST['event_id']) && isset($_POST['status']) && isset($_POST['username'])) {
//         $userId = $_SESSION['user_id'];
//         $eventId = $_POST['event_id'];
//         $status = $_POST['status'];
//         $username = $_POST['username'];

//         $stmt = $conn->prepare("INSERT INTO Eventually_User_Voting (FK_User, FK_Event_Dates, Status, UserName) VALUES (?, ?, ?, ?)");
//         $stmt->bind_param("iiss", $userId, $eventId, $status, $username);

//         if ($stmt->execute()) {
//             http_response_code(200);
//             echo json_encode(["status" => "success", "message" => "Vote successfully recorded."], JSON_PRETTY_PRINT);
//         } else {
//             http_response_code(500);
//             showError("Failed to record vote.");
//         }

//         $stmt->close();
//     } else {
//         http_response_code(400);
//         showError("Invalid input.");
//     }
// } else {
//     http_response_code(405);
//     showError("Invalid request method.");
// }

// $conn->close();
