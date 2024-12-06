<?php
// Include necessary headers for CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . "/../../../database/dbconn.php";

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Extract joincode from the URL path
$url = $_SERVER['REQUEST_URI']; // Full URL, e.g., /api/event/code/TGWQ3145
$urlComponents = explode('/', $url); // Split into parts
$joinCode = end($urlComponents); // Get the last part (the joincode)

// Validate joincode
if (empty($joinCode)) {
    http_response_code(400);
    echo json_encode(["Error" => "Missing or invalid join code"]);
    exit();
}

// Debug log for backend verification
error_log("Join code received: $joinCode");

// Query the database for the joincode
$stmt = $mysqli->prepare("SELECT * FROM Eventually_Event WHERE JoinCode = ?");
$stmt->bind_param("s", $joinCode);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $event = $result->fetch_assoc();

    // Fetch associated dates and votes for the event
    $dateVotesQuery = "
        SELECT 
            d.PK_ID AS DateID,
            d.DateTimeStart,
            d.DateTimeEnd,
            v.PK_ID AS VoteID,
            v.FK_User,
            v.Status,
            v.UserName
        FROM 
            Eventually_Event_Dates d
        LEFT JOIN 
            Eventually_Event_User_Voting v
        ON 
            d.PK_ID = v.FK_Event_Dates
        WHERE 
            d.FK_Event = ?
    ";

    $dateStmt = $mysqli->prepare($dateVotesQuery);
    $dateStmt->bind_param("i", $event['PK_ID']);
    $dateStmt->execute();
    $dateVotesResult = $dateStmt->get_result();

    $datesArray = [];
    while ($row = $dateVotesResult->fetch_assoc()) {
        $dateID = $row['DateID'];

        if (!isset($datesArray[$dateID])) {
            $datesArray[$dateID] = [
                "PK_ID" => $row['DateID'],
                "DateTimeStart" => $row['DateTimeStart'],
                "DateTimeEnd" => $row['DateTimeEnd'],
                "UserVotes" => []
            ];
        }

        if ($row['VoteID']) {
            $datesArray[$dateID]["UserVotes"][] = [
                "VoteID" => $row['VoteID'],
                "FK_User" => $row['FK_User'],
                "Status" => $row['Status'],
                "UserName" => $row['UserName']
            ];
        }
    }

    $event['EventDates'] = array_values($datesArray);

    // Return the event as JSON
    echo json_encode($event, JSON_PRETTY_PRINT);
} else {
    http_response_code(404);
    echo json_encode(["Error" => "No event found with join code '$joinCode'"]);
}
