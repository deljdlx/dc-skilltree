<?php
$post = file_get_contents('php://input');
$decoded = json_decode($post, true);

header('Content-Type: application/json');
echo json_encode($decoded);