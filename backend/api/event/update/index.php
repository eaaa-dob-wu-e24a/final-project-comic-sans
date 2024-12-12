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


    if ($input['FinalDate'] == 0) {
        $newDate = NULL;
    } else {
        $newDatePreprocess = isset($input['FinalDate']) ? DateTime::createFromFormat('Y-m-d H:i:s', $input['FinalDate']) : DateTime::createFromFormat('Y-m-d H:i:s', $event['FinalDate']);
        $newDate = $newDatePreprocess->format('Y-m-d H:i:s');
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
            http_response_code(200);
            echo json_encode(["message" => "Event updated successfully."]);
        } else {
            http_response_code(500);
            showError("Failed to update event.");
            exit;
        }
    }
} else {
    showError("EventID $eventID is invalid");
}