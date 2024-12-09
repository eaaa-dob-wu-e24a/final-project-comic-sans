<?php
$allowedOrigins = ["http://final-project-comic-sans-fork.vercel.app", "http://localhost:3001", "http://localhost:3000"];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Headers: Content-Type");

session_start();
session_unset();
session_destroy();

echo json_encode(["status" => "success", "message" => "Logged out successfully."]);
