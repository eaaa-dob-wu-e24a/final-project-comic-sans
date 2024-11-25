<?php
require_once __DIR__ . "/../../../database/dbconn.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $_POST = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON"]);
        exit;
    }

    // Extract data from the decoded JSON
    $title = $_POST['title'] ?? null;
    $description = $_POST['description'] ?? null;
    $location = $_POST['location'] ?? null;
    $ownerUserId = $_POST['ownerUserId'] ?? null;
    $joinCode = $_POST['joinCode'] ?? null;
    $userName = $_POST['userName'] ?? null;
    $finalDate = $_POST['finalDate'] ?? null;

    // Validate required fields
    if (!$title || !$description || !$location || !$ownerUserId || !$joinCode || !$userName || !$finalDate) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }

    try {
        // Prepare the SQL statement
        $stmt = $pdo->prepare("INSERT INTO Event (
            `Title`, 
            `Description`, 
            `Location`, 
            `FK Owner UserID`, 
            `Join Code`, 
            `UserName`, 
            `Final Date`
        ) VALUES (
            :title, 
            :description, 
            :location, 
            :ownerUserId, 
            :joinCode, 
            :userName, 
            :finalDate
        )");

        // Bind parameters
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':location', $location);
        $stmt->bindParam(':ownerUserId', $ownerUserId);
        $stmt->bindParam(':joinCode', $joinCode);
        $stmt->bindParam(':userName', $userName);
        $stmt->bindParam(':finalDate', $finalDate);

        // Execute the statement
        $stmt->execute();

        // Respond with success
        http_response_code(201);
        echo json_encode(["message" => "Event created successfully"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    // Handle other request methods or return an error
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>