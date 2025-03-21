<?php
// Include necessary headers for CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require_once __DIR__ . "/../../../database/dbconn.php";

function showError($msgString)
{
    $msg = ["Error" => $msgString];
    header('Content-Type: application/json');
    echo json_encode($msg, JSON_PRETTY_PRINT);
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get the 'id' parameter from the query string
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;

    if ($id) {
        $eventQuery = "SELECT * FROM Eventually_Event WHERE PK_ID = $id";
        $eventResult = $mysqli->query($eventQuery);

        // Make sure there is a response with data, otherwise show error
        if ($eventResult && $eventResult->num_rows > 0) {
            $event = $eventResult->fetch_assoc();

            // Fetch the associated dates and votes for the event
            $dateVotesQuery = "
                SELECT 
                    d.PK_ID AS DateID,
                    d.DateTimeStart,
                    d.DateTimeEnd,
                    v.PK_ID AS VoteID,
                    v.FK_User,
                    v.Status,
                    v.UserName,
                    u.ImagePath AS UserImagePath
                FROM 
                    Eventually_Event_Dates d
                LEFT JOIN 
                    Eventually_Event_User_Voting v
                ON 
                    d.PK_ID = v.FK_Event_Dates
                LEFT JOIN 
                    Eventually_User u
                ON 
                    v.FK_User = u.PK_ID
                WHERE 
                    d.FK_Event = $id
            ";

            $dateVotesResult = $mysqli->query($dateVotesQuery);

            $datesArray = [];
            while ($row = $dateVotesResult->fetch_assoc()) {
                $dateID = $row['DateID'];

                // Group votes under their corresponding date
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
                        "UserName" => $row['UserName'],
                        "UserImagePath" => $row['UserImagePath']
                    ];
                }
            }

            // Re-index the dates array
            $event['EventDates'] = array_values($datesArray);

            header('Content-Type: application/json');
            echo json_encode($event, JSON_PRETTY_PRINT);
        } else {
            showError("No events found with ID $id");
        }
    }
} else {
    http_response_code(405);
    showError("Invalid request method.");
}
