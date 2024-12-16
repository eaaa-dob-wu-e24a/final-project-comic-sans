<?php
$allowedOrigins = ["https://final-project-comic-sans-fork.vercel.app", "http://localhost:3001", "http://localhost:3000"];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require_once __DIR__ . "/../../../database/dbconn.php";

session_start(['cookie_secure' => true, 'cookie_samesite' => 'None']);


function showError($msgString)
{
    $msg = ["Error" => $msgString];
    header('Content-Type: application/json');
    echo json_encode($msg, JSON_PRETTY_PRINT);
}

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

    $user_id = intval($_SESSION['user']['id']); // Get the authenticated user's ID

    // Query to fetch events the user has voted on
    $query = "
        SELECT 
            e.PK_ID AS EventID,
            e.JoinCode,
            e.Title,
            e.Description,
            e.FK_Owner_UserID,
            e.FinalDate,
            e.Location,
            d.PK_ID AS DateID,
            d.DateTimeStart,
            d.DateTimeEnd,
            v.PK_ID AS VoteID,
            v.FK_User,
            v.Status,
            v.UserName,
            u.ImagePath AS UserImagePath
        FROM 
            Eventually_Event_User_Voting v
        INNER JOIN 
            Eventually_Event_Dates d ON v.FK_Event_Dates = d.PK_ID
        INNER JOIN 
            Eventually_Event e ON d.FK_Event = e.PK_ID
        LEFT JOIN 
            Eventually_User u ON v.FK_User = u.PK_ID
        WHERE 
            v.FK_User = ?
    ";

    if ($stmt = $mysqli->prepare($query)) {
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $events = [];
        while ($row = $result->fetch_assoc()) {
            $eventID = $row['EventID'];
            $dateID = $row['DateID'];

            // Group by event
            if (!isset($events[$eventID])) {
                $events[$eventID] = [
                    "EventID" => $row['EventID'],
                    "Title" => $row['Title'],
                    "Description" => $row['Description'],
                    "FK_Owner_UserID" => $row['FK_Owner_UserID'],
                    "FinalDate" => $row['FinalDate'],
                    "JoinCode" => $row['JoinCode'],
                    "Location" => $row['Location'],
                    "EventDates" => []
                ];
            }

            // Group dates and votes under the event
            if (!isset($events[$eventID]['EventDates'][$dateID])) {
                $events[$eventID]['EventDates'][$dateID] = [
                    "DateID" => $row['DateID'],
                    "DateTimeStart" => $row['DateTimeStart'],
                    "DateTimeEnd" => $row['DateTimeEnd'],
                    "UserVotes" => []
                ];
            }

            if ($row['VoteID']) {
                $events[$eventID]['EventDates'][$dateID]['UserVotes'][] = [
                    "VoteID" => $row['VoteID'],
                    "FK_User" => $row['FK_User'],
                    "Status" => $row['Status'],
                    "UserName" => $row['UserName'],
                    "UserImagePath" => $row['UserImagePath']
                ];
            }
        }

        // Re-index the arrays and format the response
        foreach ($events as $eventID => $eventData) {
            $events[$eventID]['EventDates'] = array_values($eventData['EventDates']);
        }

        $response = array_values($events); // Re-index events
        header('Content-Type: application/json');
        echo json_encode(['events' => $response], JSON_PRETTY_PRINT);
    } else {
        showError("Failed to prepare the SQL statement.");
    }
} else {
    http_response_code(405);
    showError("Invalid request method.");
}
