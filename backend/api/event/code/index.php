<?php
// Include necessary headers for CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true"); 
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Content-Type: application/json"); 

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . "/../../../database/dbconn.php";

// Function to handle errors
function showError($msgString, $statusCode = 400)
{
    http_response_code($statusCode);
    echo json_encode(["Error" => $msgString], JSON_PRETTY_PRINT);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['joincode']) || empty($_GET['joincode'])) {
        showError("Missing or invalid join code.", 400);
    }

    $joinCode = $_GET['joincode'];

    $stmt = $mysqli->prepare("SELECT * FROM Eventually_Event WHERE JoinCode = ?");
    $stmt->bind_param("s", $joinCode);
    $stmt->execute();
    $eventResult = $stmt->get_result();

    if ($eventResult && $eventResult->num_rows > 0) {
        $event = $eventResult->fetch_assoc();

        // Fetch dates and votes for the event
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

        // Attach the dates and votes to the event
        $event['EventDates'] = array_values($datesArray);

        http_response_code(200);
        echo json_encode($event, JSON_PRETTY_PRINT);
    } else {
        showError("No event found with join code '$joinCode'", 404);
    }

    $stmt->close();
} else {
    showError("Invalid request method.", 405);
}

