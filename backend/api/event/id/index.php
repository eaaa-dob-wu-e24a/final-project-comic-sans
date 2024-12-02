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
    $msg = ["Error" => $msgString];
    header('Content-Type: application/json');
    echo json_encode($msg, JSON_PRETTY_PRINT);
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    //Fetches the URL of the current page
    $url = $_SERVER['REQUEST_URI'];
    //Splits the URL into an array of components
    $urlComponents = explode('/', $url);
    //Gets the last component of the URL array e.g., /user/id/1 => 1
    $id = end($urlComponents);

    if ($id) {
        $eventQuery = "SELECT * FROM Eventually_Event WHERE PK_ID = $id";
        $eventResult = $mysqli->query($eventQuery);

        //make sure there is a response with data, otherwise show error
        if ($eventResult && $eventResult->num_rows > 0) {
            $event = $eventResult->fetch_assoc();

            // fetch the associated dates for the event
            $dateQuery = "SELECT * FROM Eventually_Event_Dates WHERE FK_Event = $id";
            $dateResult = $mysqli->query($dateQuery);

            //add all fetched dates to a new array
            $datesArray = array();
            while ($row = $dateResult->fetch_assoc()) {
                array_push($datesArray, $row);
            }

            //assign the dates to a new key in the event array
            $event['EventDates'] = $datesArray;

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
