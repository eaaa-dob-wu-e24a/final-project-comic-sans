<?php
// Include necessary headers for CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require_once __DIR__ . "/../../../database/dbconn.php";

session_start();
$userId = $_SESSION['user']['id'] ?? null;

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
    // Fetches the URL of the current page
    $url = $_SERVER['REQUEST_URI'];
    // Splits the URL into an array of components
    $urlComponents = explode('/', $url);
    // Gets the last component of the URL array e.g., /vote/read/1 => 1
    $id = end($urlComponents);

    if ($id) {
        $dateQuery = "SELECT * FROM Eventually_Event_Dates WHERE PK_ID = $id";
        $dateResult = $mysqli->query($dateQuery);

        // Make sure there is a response with data, otherwise show error
        if ($dateResult && $dateResult->num_rows > 0) {
            $date = $dateResult->fetch_assoc();

            // Fetch the associated votes for the date
            $voteQuery = "SELECT * FROM Eventually_Event_User_Voting WHERE FK_Event_Dates = '$id';";
            //AND FK_User != '$userId';


            $voteResult = $mysqli->query($voteQuery);

            // Add all fetched votes to a new array
            $votesArray = array();
            while ($row = $voteResult->fetch_assoc()) {
                array_push($votesArray, $row);
            }

            // Assign the votes to a new key in the date array
            $date['UserVotes'] = $votesArray;

            header('Content-Type: application/json');
            echo json_encode($date, JSON_PRETTY_PRINT);
        } else {
            showError("No dates found with ID $id");
        }
    }
} else {
    http_response_code(405);
    showError("Invalid request method.");
}
