<?php
/**
 * a minimal example of an upload.php file
 * uploaded file is in $_FILES['file']
 */

$file = $_FILES['file'];
$fileName = $file['name'];
$fileTmpName = $file['tmp_name'];

move_uploaded_file($fileTmpName, __DIR__ . '/../images/' . $fileName);


header('Content-Type: application/json');
echo json_encode([
    // the "image_url" key is used by the editor to display the image
    'image_url' => '/images/' . $fileName,
]);