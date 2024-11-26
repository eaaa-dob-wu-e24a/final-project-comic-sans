<?php
require_once __DIR__ . "/../../../database/dbconn.php";

// Start the session to check if the user is logged in
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000"); // Only allow specific origin
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Check if user is logged in (check if user data is in session)
if (isset($_SESSION['user'])) {
    // Get the logged-in user's ID (assuming user data is stored in session)
    $userID = $_SESSION['user']['id']; // Adjust this based on how you store the user ID in the session
} else {
    // If no user is logged in, set the userID to NULL (or leave it empty)
    $userID = NULL;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode incoming JSON request
    $_POST = json_decode(file_get_contents('php://input'), true);

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
    $joinCode = $_POST['joinCode'] ?? null;
    $userName = $_POST['userName'] ?? null;
    $finalDate = $_POST['finalDate'] ?? null;

    // Validate required fields
    if (!$title || !$description || !$joinCode) {
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

    try {
        // Prepare the SQL query for inserting the event
        $stmt = $mysqli->prepare("INSERT INTO Eventually_Event (
            `Title`, 
            `Description`, 
            `Location`, 
            `FK_Owner_UserID`, 
            `JoinCode`, 
            `UserName`, 
            `FinalDate`
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?
        )");

        // Bind the parameters to the SQL query
        $stmt->bind_param('sssssss', $title, $description, $location, $userID, $joinCode, $userName, $finalDate);

        // Execute the SQL query
        if ($stmt->execute()) {
            http_response_code(201); // Created successfully
            echo json_encode(["message" => "Event created successfully"]);
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(["error" => "Event creation failed"]);
        }

        // Close the statement
        $stmt->close();

    } catch (mysqli_sql_exception $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    // Handle unsupported request methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Method not allowed"]);
}
?>
