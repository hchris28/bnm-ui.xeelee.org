<?php

if (!isset($_FILES['file'])) {
    send_slack_message('An upload request was received but no file was posted.');
    exit_and_return_json([
        'status' => 'error',
        'messages' => ['No file found.']
    ]);
}

$extensions = array("xlsx");
$data_formats = ['field_scan', 'material_receiving'];

$errors = array();

$file = $_FILES['file'];
$file_name = $file['name'];
$file_size = $file['size'];
$file_tmp = $file['tmp_name'];
$file_type = $file['type'];
$file_ext = pathinfo($file_name, PATHINFO_EXTENSION);

$data_format = $_POST['format'];

if (in_array(strtolower($file_ext), $extensions) === false) {
    $errors[] = "Files must be in Excel format.";
}

if ($file_size > 524288000) {
    $errors[] = 'Files larger than 500MB are not allowed.';
}

if (in_array($data_format, $data_formats) === false) {
    $errors[] = "File format is not recognized.";
}

if (empty($errors) == true) {
    $desitnation = __DIR__ . "/../importer/incoming_data/{$data_format}/{$file_name}";
    move_uploaded_file($file_tmp, $desitnation);
    send_slack_message("File {$file_name} was uploaded successfully.");
    exit_and_return_json([
        'status' => 'success',
        'messages' => []
    ]);
} else {
    send_slack_message("An upload request was received for a file named {$file_name} but the following errors occurred: " . implode(',', $errors));
    exit_and_return_json([
        'status' => 'error',
        'messages' => $errors
    ]);
}

function exit_and_return_json($data)
{
    // TODO: double-check security impliations for these header values

    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header("Access-Control-Allow-Headers: *");
    echo json_encode($data);
    exit();
}

function send_slack_message($message)
{
    $url = "https://hooks.slack.com/services/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";
    $useragent = "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)";
    $payload = 'payload={"channel": "#notification", "username": "webhookbot", "text": "' . $message . '", "icon_emoji": ":ghost:"}';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_USERAGENT, $useragent); //set our user agent
    curl_setopt($ch, CURLOPT_POST, TRUE); //set how many paramaters to post
    curl_setopt($ch, CURLOPT_URL, $url); //set the url we want to use
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    curl_exec($ch); //execute and get the results
    curl_close($ch);
}
