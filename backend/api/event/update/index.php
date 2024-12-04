<?php
require_once __DIR__ . "/../../../database/dbconn.php";
header("Access-Control-Allow-Origin: http://localhost:3000"); // Only allow specific origin
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

session_start();
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
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Methods: PATCH, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200);
}

// check request method
else if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    http_response_code(405);
    showError("Invalid request method.");
    exit;
} else {
    // get the request body
    $request = file_get_contents('php://input');
    $input = json_decode($request, TRUE); //convert JSON into array
    $eventID = $input['ID'];

    // get the event info
    $sql = "SELECT * FROM Eventually_Event WHERE PK_ID = $eventID;";
    $result = $mysqli->query($sql);
    $event = $result->fetch_assoc();

    // if no title/desc/location is provided, set them to be the old one
    $newTitle = isset($input['Title']) ? $input['Title'] : $event['Title'];
    $newDesc = isset($input['Description']) ? $input['Description'] : $event['Description'];
    $newLoc = isset($input['Location']) ? $input['Location'] : $event['Location'];

    // check if the owner matches the user
    if ($event['FK_Owner_UserID'] != $user['id']) {
        http_response_code(401);
        showError("Authentication failed for user");
        exit;
    } else {
        // prepare the update query with placeholders
        $sql = "UPDATE Eventually_Event SET Title = ?, Description = ?, Location = ? WHERE PK_ID = ?";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("sssi", $newTitle, $newDesc, $newLoc, $eventID);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["message" => "Event updated successfully."]);
        } else {
            http_response_code(500);
            showError("Failed to update event.");
            exit;
        }
    }
}
