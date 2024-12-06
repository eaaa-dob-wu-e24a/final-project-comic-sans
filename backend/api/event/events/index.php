<?php
// Include necessary headers for CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require_once __DIR__ . "/../../../database/dbconn.php";

function showError($msgString)
{
    $msg = ["status" => "error", "message" => $msgString];
    echo json_encode($msg, JSON_PRETTY_PRINT);
}

session_start();

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // Check if the user is authenticated
    if (!isset($_SESSION['user']) || !isset($_SESSION['user']['id'])) {
        http_response_code(401);
        showError("User not authenticated.");
        exit();
    }

    // Get the authenticated user's ID from the session
    $user_id = intval($_SESSION['user']['id']);

    // Prepare the SQL query to fetch events not owned by the user
    $stmt = $mysqli->prepare("SELECT * FROM Eventually_Event WHERE FK_Owner_UserID != ? OR FK_Owner_UserID IS NULL");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $eventsResult = $stmt->get_result();


    // Fetch events not owned by the user
    if ($eventsResult) {
        $eventsArray = array();
        while ($event = $eventsResult->fetch_assoc()) {
            // Fetch associated dates for each event
            $event_id = $event['PK_ID'];
            //? is the placeholder for the event_id
            $dateStmt = $mysqli->prepare("SELECT * FROM Eventually_Event_Dates WHERE FK_Event = ?");
            $dateStmt->bind_param("i", $event_id);
            $dateStmt->execute();
            $dateResult = $dateStmt->get_result();

            $datesArray = array();

            // datesArray will contain all the dates for the event
            while ($date = $dateResult->fetch_assoc()) {
                $datesArray[] = $date;
            }

            // Add dates to the event array
            $event['EventDates'] = $datesArray;

            $eventsArray[] = $event;

            // Close the date statement
            $dateStmt->close();
        }

        http_response_code(200);
        echo json_encode(["status" => "success", "events" => $eventsArray], JSON_PRETTY_PRINT);
    } else {
        showError("Error fetching events not owned by user ID $user_id");
    }

    // Close statements and connection
    $stmt->close();
    $mysqli->close();
} else {
    http_response_code(405);
    showError("Invalid request method.");
}
