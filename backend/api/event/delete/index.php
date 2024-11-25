<?php
require_once __DIR__ . "/../../../database/dbconn.php";

function showError($msgString)
{
    $msg = ["Error" => $msgString];
    header('Content-Type: application/json');
    echo json_encode($msg, JSON_PRETTY_PRINT);
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
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

    // Assuming you have a way to get the current user's ID
    if (isset($_SESSION['user']['id'])) {
        $currentUserId = $_SESSION['user']['id'];
    } else {
        showError("User not authenticated.");
        exit;
    }

    // Check if the current user is the creator of the event
    $ownershipQuery = "SELECT FK_User FROM Eventually_Event WHERE PK_ID = $id";
    $ownershipResult = $mysqli->query($ownershipQuery);

    if ($ownershipResult && $ownershipResult->num_rows > 0) {
        $row = $ownershipResult->fetch_assoc();
        if ($row['FK_User'] != $currentUserId) {
            showError("You do not have permission to delete this event.");
            exit;
        }
    } else {
        showError("Event not found.");
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
