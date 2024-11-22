<?php
require_once __DIR__ . "/../../../database/dbconn.php";

function showError($msgString)
{
    $msg = ["Error" => $msgString,];
    echo json_encode($msg, JSON_PRETTY_PRINT);
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



        if ($eventResult && $eventResult->num_rows > 0) {
            $event = $eventResult->fetch_assoc();

            $dateQuery = "SELECT * FROM Eventually_Event_Dates WHERE FK_Event = $id";
            $dateResult = $mysqli->query($dateQuery);

            $datesArray = array();
            while ($row = $dateResult->fetch_assoc()) {
                array_push($datesArray, $row);
            }

            //array_push($event, $datesArray);
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
