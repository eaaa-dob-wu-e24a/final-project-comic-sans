<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Headers: Content-Type");

session_start();
session_unset();
session_destroy();

echo json_encode(["status" => "success", "message" => "Logged out successfully."]);
