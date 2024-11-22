<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Only allow specific origin
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

session_start();

if (isset($_SESSION['user'])) {
    echo json_encode(["status" => "success", "user" => $_SESSION['user']]);
} else {
    echo json_encode(["status" => "error", "message" => "Not logged in."]);
}
