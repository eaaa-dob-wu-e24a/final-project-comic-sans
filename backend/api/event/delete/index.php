<?php
$allowedOrigins = ["https://final-project-comic-sans-fork.vercel.app", "http://localhost:3001", "http://localhost:3000"];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../../../database/dbconn.php";
// Handle OPTIONS requests for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Respond OK to preflight
    exit();
}

session_start();
$user = $_SESSION['user'] ?? null;

function showError($msgString)
{
    $msg = ["Error" => $msgString];
    header('Content-Type: application/json');
    echo json_encode($msg, JSON_PRETTY_PRINT);
}

// Ensure the request method is DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    showError("Invalid request method.");
    exit();
}

// Get the request body
$request = file_get_contents('php://input');
$input = json_decode($request, true);

// Check if event ID is provided
if (!isset($input['ID'])) {
    http_response_code(400);
    showError("Event ID is missing.");
    exit();
}

$eventID = intval($input['ID']);

// Retrieve the event from the database
$sql = "SELECT FK_Owner_UserID FROM Eventually_Event WHERE PK_ID = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $eventID);
$stmt->execute();
$result = $stmt->get_result();
$event = $result->fetch_assoc();

if (!$event) {
    http_response_code(404);
    showError("Event not found.");
    exit();
}

// Verify that the logged-in user is the owner of the event
if ($event['FK_Owner_UserID'] != $user['id']) {
    http_response_code(401);
    showError("Authentication failed.");
    exit();
}

// Delete the event from Eventually_Event table
$sql = "DELETE FROM Eventually_Event WHERE PK_ID = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $eventID);

if ($stmt->execute()) {
    // Delete associated dates from Eventually_Event_Dates table
    $sql = "DELETE FROM Eventually_Event_Dates WHERE FK_Event = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("i", $eventID);
    if ($stmt->execute()) {
        header('Content-Type: application/json');
        echo json_encode(["message" => "Event deleted successfully."], JSON_PRETTY_PRINT);
    } else {
        http_response_code(500);
        showError("Failed to delete associated event dates.");
    }
} else {
    http_response_code(500);
    showError("Failed to delete event.");
}
