<?php
// Include the database connection
require_once __DIR__ . "/../../../database/dbconn.php";  // Ensure the correct path to your dbconn.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode incoming JSON request
    $_POST = json_decode(file_get_contents('php://input'), true);

    // Debug incoming POST data
    file_put_contents('debug_log.txt', "POST Data: " . print_r($_POST, true), FILE_APPEND);

    // Check if JSON decoding was successful
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON"]);
        exit;
    }

    // Extract the fields from the JSON
    $title = $_POST['title'] ?? null;
    $description = $_POST['description'] ?? null;
    $location = $_POST['location'] ?? null;
    $ownerUserId = $_POST['ownerUserId'] ?? null;
    $joinCode = $_POST['joinCode'] ?? null;
    $userName = $_POST['userName'] ?? null;
    $finalDate = $_POST['finalDate'] ?? null;

    // Validate required fields
    if (!$title || !$description || !$ownerUserId || !$joinCode) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }

    // Validate finalDate format if provided
    if ($finalDate && !strtotime($finalDate)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid date format"]);
        exit;
    }

    // Prepare the SQL query for inserting the event
    $stmt = $mysqli->prepare("INSERT INTO Eventually_Event (
        `Title`, 
        `Description`, 
        `Location`, 
        `FK_Owner_UserID`, 
        `JoinCode`, 
        `UserName`, 
        `FinalDate`
    ) VALUES (?, ?, ?, ?, ?, ?, ?)");

    // Check if the statement was prepared successfully
    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to prepare statement"]);
        exit;
    }

    // Bind the parameters to the SQL query
    $stmt->bind_param("sssiiss", $title, $description, $location, $ownerUserId, $joinCode, $userName, $finalDate);

    // Log the parameters for debugging
    file_put_contents('debug_sql.txt', "Parameters: " . print_r([
        $title, $description, $location, $ownerUserId, $joinCode, $userName, $finalDate
    ], true), FILE_APPEND);

    // Execute the SQL query
    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Event created successfully"]);
    } else {
        // Log the SQL error
        file_put_contents('debug_sql.txt', "SQL Error: " . $stmt->error . "\n", FILE_APPEND);
        http_response_code(500);
        echo json_encode(["error" => "Event not inserted"]);
    }

    // Close the statement
    $stmt->close();
} else {
    // Handle unsupported request methods
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
