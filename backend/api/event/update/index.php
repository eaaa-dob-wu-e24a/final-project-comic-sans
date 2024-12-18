<?php
$allowedOrigins = ["https://final-project-comic-sans-fork.vercel.app", "http://localhost:3001", "http://localhost:3000"];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . "/../../../database/dbconn.php";


// Handle OPTIONS requests for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Respond OK to preflight
    exit();
}

session_start(['cookie_secure' => true, 'cookie_samesite' => 'None']);;
$user = $_SESSION['user'];
// $user['id'] = 9; //debug for auth testing

function showError($msgString)
{
    $msg = ["Error" => $msgString];
    header('Content-Type: application/json');
    echo json_encode($msg, JSON_PRETTY_PRINT);
}

// handle preflight. Idk why but this is needed :(
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: https://final-project-comic-sans-fork.vercel.app");
    header("Access-Control-Allow-Methods: PATCH, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200);
}

// check request method
else if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    http_response_code(405);
    showError("Invalid request method.");
    exit;
}

// get the request body
$request = file_get_contents('php://input');
$input = json_decode($request, TRUE); //convert JSON into array
$eventID = $input['ID'];

if (!isset($input)) {
    http_response_code(400);
    showError("No or invalid user input");
    exit;
}

//echo json_encode($eventID);

if (isset($eventID) && is_numeric($eventID)) {
    // get the event info
    $sql = "SELECT * FROM Eventually_Event WHERE PK_ID = $eventID;";
    $result = $mysqli->query($sql);
    $event = $result->fetch_assoc();

    if (empty($event)) {
        showError("Event with ID $eventID does not exist");
        exit;
    }

    // if no title/desc/location is provided, set them to be the old one
    $newTitle = isset($input['Title']) ? $input['Title'] : $event['Title'];
    $newDesc = isset($input['Description']) ? $input['Description'] : $event['Description'];
    $newLoc = isset($input['Location']) ? $input['Location'] : $event['Location'];


    // only update finaldate it if it's explicitly provided
    if (isset($input['FinalDate'])) {
        if ($input['FinalDate'] == 0 || empty($input['FinalDate'])) {
            $newDate = NULL;
        } else {
            $newDatePreprocess = DateTime::createFromFormat('Y-m-d H:i:s', $input['FinalDate']);
            $newDate = $newDatePreprocess ? $newDatePreprocess->format('Y-m-d H:i:s') : NULL;
        }
    } else {
        // If FinalDate is not in the input, keep the existing value
        $newDate = $event['FinalDate'];
    }

    // check if the owner matches the user
    if ($event['FK_Owner_UserID'] != $user['id']) {
        http_response_code(401);
        showError("Authentication failed for user");
        exit;
    } else {
        // prepare the update query with placeholders
        $sql = "UPDATE Eventually_Event SET Title = ?, Description = ?, Location = ?, FinalDate = ? WHERE PK_ID = ?";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("ssssi", $newTitle, $newDesc, $newLoc, $newDate, $eventID);

        if ($stmt->execute()) {
            // Handle ProposedDates
            if (isset($input['ProposedDates']) && is_array($input['ProposedDates'])) {
                // get existing ProposedDates for the event
                $existingDatesQuery = "SELECT PK_ID, DateTimeStart, DateTimeEnd FROM Eventually_Event_Dates WHERE FK_Event = ?";
                $stmtFetch = $mysqli->prepare($existingDatesQuery);
                $stmtFetch->bind_param("i", $eventID);
                $stmtFetch->execute();
                $result = $stmtFetch->get_result();
                $existingDates = $result->fetch_all(MYSQLI_ASSOC);
            
                // array of new ProposedDates for comparison
                $newDates = [];
                foreach ($input['ProposedDates'] as $date) {
                    if (!isset($date['start']) || !isset($date['end'])) {
                        showError("Invalid ProposedDates format: Missing 'start' or 'end'.");
                        exit;
                    }
            
                    $newDates[] = [
                        'start' => date('Y-m-d H:i:s', strtotime($date['start'])),
                        'end' => date('Y-m-d H:i:s', strtotime($date['end']))
                    ];
                }
            
                // delete old ProposedDates and reset FinalDate if needed
                $finalDateReset = false;

                foreach ($existingDates as $existing) {
                    $existsInNew = false;
                    foreach ($newDates as $new) {
                        if ($existing['DateTimeStart'] === $new['start'] && $existing['DateTimeEnd'] === $new['end']) {
                            $existsInNew = true;
                            break;
                        }
                    }

                    // Check if the FinalDate matches the time being deleted
                    if (!$existsInNew) {
                        if ($event['FinalDate'] === $existing['DateTimeStart']) {
                            $finalDateReset = true;
                        }

                        $deleteQuery = "DELETE FROM Eventually_Event_Dates WHERE PK_ID = ?";
                        $stmtDelete = $mysqli->prepare($deleteQuery);
                        $stmtDelete->bind_param("i", $existing['PK_ID']);
                        $stmtDelete->execute();
                    }
                }

                // If FinalDate was reset, update the event table to set FinalDate to NULL
                if ($finalDateReset) {
                    $resetFinalDateSQL = "UPDATE Eventually_Event SET FinalDate = NULL WHERE PK_ID = ?";
                    $stmtReset = $mysqli->prepare($resetFinalDateSQL);
                    $stmtReset->bind_param("i", $eventID);
                    $stmtReset->execute();
                }

            
                // insert only new ProposedDates that don't already exist
                $insertDateSQL = "INSERT INTO Eventually_Event_Dates (FK_Event, DateTimeStart, DateTimeEnd) VALUES (?, ?, ?)";
                $stmtInsert = $mysqli->prepare($insertDateSQL);
            
                foreach ($newDates as $new) {
                    $found = false;
                    foreach ($existingDates as $existing) {
                        if ($existing['DateTimeStart'] === $new['start'] && $existing['DateTimeEnd'] === $new['end']) {
                            $found = true;
                            break;
                        }
                    }
                    if (!$found) {
                        $stmtInsert->bind_param("iss", $eventID, $new['start'], $new['end']);
                        $stmtInsert->execute();
                    }
                }
            }            
            http_response_code(200);
            echo json_encode(["message" => "Event and ProposedDates updated successfully."]);
        } else {
            http_response_code(500);
            showError("Failed to update event.");
            exit;
        }
    }
} else {
    showError("EventID $eventID is invalid");
}