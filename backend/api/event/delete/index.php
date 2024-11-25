<?php
require_once __DIR__ . "/../../../database/dbconn.php";


function showError($msgString)
{
    $msg = ["Error" => $msgString];
    header('Content-Type: application/json');
    echo json_encode($msg, JSON_PRETTY_PRINT);
}

if ($_SERVER['REQUEST_METHOD'] == ! 'DELETE') {
    http_response_code(405);
    showError("Invalid request method.");
    exit;
} else {

    $url = $_SERVER['REQUEST_URI'];
    //Splits the URL into an array of components
    $urlComponents = explode('/', $url);
    //Gets the last component of the URL array e.g., /user/id/1 => 1
    $id = end($urlComponents);

    if (empty($id)) {
        showError("Event ID is required.");
        exit;
    }

    $eventQuery = "DELETE FROM Eventually_Event WHERE PK_ID = $id";
    $eventResult = $mysqli->query($eventQuery);

    if ($eventResult) {
        $dateQuery = "DELETE FROM Eventually_Event_Dates WHERE FK_Event = $id";
        $dateResult = $mysqli->query($dateQuery);

        if ($dateResult) {
            header('Content-Type: application/json');
            echo json_encode(["Success" => "Event deleted successfully."], JSON_PRETTY_PRINT);
        } else {
            showError("Error deleting event dates.");
        }
    } else {
        showError("Error deleting event.");
    }
}
