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
    $msg = ["status" => "error", "message" => $msgString];
    echo json_encode($msg, JSON_PRETTY_PRINT);
}

function generateRandomString($length) {
    //list of valid characters. Made only uppercase letters valid for now, and start with empty string
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; 
    $result = '';

    //run code number of times equal to desired length of the generated Join Code
    for ($i = 0; $i < $length; $i++) { 
        // append a random character to the string
        $result .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $result;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    showError("Invalid request method.");

} else {
    // get all the existing join codes from database, and put them in an array
    $sql = "SELECT JoinCode FROM Eventually_Event";
    $result = $mysqli->query($sql);
    $oldCodes = array();
    while ($row = $result->fetch_assoc()) {
        // add only the codes themselves, not each key/value pair
        array_push($oldCodes, $row['JoinCode']);
    }

    //start with a code already in database for testing. Replace with $code = generateRandomString(8); for production
    $code = "0";
    $checking = true;

    //if the generated code is already in the database, generate a new one to ensure it is unique
    while ($checking == true){
        if (in_array($code, $oldCodes)) {
            $code = generateRandomString(8);
        } else {
            //once a new unique code is found, send it back to the client
            $checking = false;
            header('Content-Type: application/json');
            echo json_encode(["code"=>$code]);
            break;
        }
    }


}   