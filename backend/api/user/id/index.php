<?php
require_once __DIR__ . "/../../../database/dbconn.php";

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetches the ID from the GET parameters
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
    } else {
        http_response_code(400);
        showError("ID parameter is missing");
        exit;
    }

    function showError($msgString)
    {
        $msg = ["Error" => $msgString];
        header('Content-Type: application/json');
        echo json_encode($msg, JSON_PRETTY_PRINT);
    }

    if (is_numeric($id)) {
        //Query the database for the user with the given ID
        $sql = "SELECT * FROM Eventually_User WHERE PK_ID = $id";
        $result = $mysqli->query($sql);


        //If the query returns a result and the number of rows is greater than 0
        if ($result && $result->num_rows > 0) {
            //Turns the result into an array and encodes it as JSON 
            $user = $result->fetch_assoc();
            header('Content-Type: application/json');
            echo json_encode($user, JSON_PRETTY_PRINT);
        } else {
            showError("No users found with matching ID $id");
        }
    } else {
        http_response_code(400);
        showError("Invalid ID");
    }
} else {
    http_response_code(405);
    showError("Invalid request method.");
}
