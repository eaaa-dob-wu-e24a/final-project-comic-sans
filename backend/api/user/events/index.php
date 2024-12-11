
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

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function showError($msgString)
{
    $msg = ["status" => "error", "message" => $msgString];
    echo json_encode($msg, JSON_PRETTY_PRINT);
}

session_start(['cookie_secure' => true, 'cookie_samesite' => 'None']);;



if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // Check if the user is authenticated
    if (!isset($_SESSION['user']) || !isset($_SESSION['user']['id'])) {
        http_response_code(401);
        showError("User not authenticated.");
        exit();
    }

    // Get the authenticated user's ID from the session
    $user_id = intval($_SESSION['user']['id']);

    // Prepare the SQL query to prevent SQL injection
    $stmt = $mysqli->prepare("SELECT * FROM Eventually_Event WHERE FK_Owner_UserID = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $eventsResult = $stmt->get_result();

    if ($eventsResult) {
        $eventsArray = array();
        while ($event = $eventsResult->fetch_assoc()) {
            // Fetch associated dates for each event
            $event_id = $event['PK_ID'];
            $dateStmt = $mysqli->prepare("SELECT * FROM Eventually_Event_Dates WHERE FK_Event = ?");
            $dateStmt->bind_param("i", $event_id);
            $dateStmt->execute();
            $dateResult = $dateStmt->get_result();

            $datesArray = array();
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
        showError("Error fetching events for user ID $user_id");
    }

    // Close statements and connection
    $stmt->close();
    $mysqli->close();
} else {
    http_response_code(405);
    showError("Invalid request method.");
}
?>
