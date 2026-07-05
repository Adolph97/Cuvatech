<?php
// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database paths
$db_file = __DIR__ . '/orders.json';
$config_file = __DIR__ . '/config.json';

// Initialize files if they don't exist
if (!file_exists($db_file)) {
    $initial_orders = [
        [
            "id" => "ORD-7721",
            "type" => "IT",
            "customerName" => "Marcus Aurelius",
            "customerEmail" => "marcus@stoic.co",
            "status" => "Provisioned",
            "details" => ["plan" => "Cloud Migration", "nodes" => 12],
            "createdAt" => date(DATE_ISO8601, time() - 86400),
            "notifications" => ["Login credentials sent to client", "New order received from landing page"]
        ]
    ];
    file_put_contents($db_file, json_encode($initial_orders, JSON_PRETTY_PRINT));
}

if (!file_exists($config_file)) {
    $default_config = [
        "username" => "admin",
        "password" => "password",
        "stripePublishableKey" => "",
        "stripeSecretKey" => "",
        "paypalClientId" => "",
        "canvaApiKey" => "",
        "paymentMode" => "sandbox"
      ];
      file_put_contents($config_file, json_encode($default_config, JSON_PRETTY_PRINT));
}

// Routing based on the path parameter rewritten by .htaccess
$path = isset($_GET['path']) ? $_GET['path'] : '';

// Helper to read JSON inputs
function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true);
}

// Route: admin/login
if ($path === 'admin/login') {
    $input = getJsonInput();
    $config = json_decode(file_get_contents($config_file), true);
    
    if (isset($input['username']) && isset($input['password']) && 
        $input['username'] === $config['username'] && $input['password'] === $config['password']) {
        echo json_encode(["token" => "cuva_admin_secure_session_token"]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid username or password"]);
    }
    exit();
}

// Route: admin/change-password
if ($path === 'admin/change-password') {
    $input = getJsonInput();
    $config = json_decode(file_get_contents($config_file), true);
    
    if (!isset($input['currentPassword']) || $input['currentPassword'] !== $config['password']) {
        http_response_code(400);
        echo json_encode(["error" => "Incorrect current password"]);
        exit();
    }
    
    $config['password'] = $input['newPassword'];
    file_put_contents($config_file, json_encode($config, JSON_PRETTY_PRINT));
    echo json_encode(["success" => true]);
    exit();
}

// Route: admin/settings
if ($path === 'admin/settings') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $config = json_decode(file_get_contents($config_file), true);
        unset($config['password']); // Safety first
        echo json_encode($config);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = getJsonInput();
        $config = json_decode(file_get_contents($config_file), true);
        
        $config['stripePublishableKey'] = isset($input['stripePublishableKey']) ? $input['stripePublishableKey'] : '';
        $config['stripeSecretKey'] = isset($input['stripeSecretKey']) ? $input['stripeSecretKey'] : '';
        $config['paypalClientId'] = isset($input['paypalClientId']) ? $input['paypalClientId'] : '';
        $config['canvaApiKey'] = isset($input['canvaApiKey']) ? $input['canvaApiKey'] : '';
        $config['paymentMode'] = isset($input['paymentMode']) ? $input['paymentMode'] : 'sandbox';
        
        file_put_contents($config_file, json_encode($config, JSON_PRETTY_PRINT));
        unset($config['password']);
        echo json_encode($config);
    }
    exit();
}

// Route: settings/public
if ($path === 'settings/public') {
    $config = json_decode(file_get_contents($config_file), true);
    echo json_encode([
        "stripePublishableKey" => isset($config['stripePublishableKey']) ? $config['stripePublishableKey'] : '',
        "paypalClientId" => isset($config['paypalClientId']) ? $config['paypalClientId'] : '',
        "paymentMode" => isset($config['paymentMode']) ? $config['paymentMode'] : 'sandbox'
    ]);
    exit();
}

// Route: orders
if ($path === 'orders') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        echo file_get_contents($db_file);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = getJsonInput();
        $orders = json_decode(file_get_contents($db_file), true);
        
        $newOrder = [
            "id" => "ORD-" . rand(1000, 9999),
            "type" => isset($input['type']) ? $input['type'] : 'Contact',
            "customerName" => isset($input['customerName']) ? $input['customerName'] : '',
            "customerEmail" => isset($input['customerEmail']) ? $input['customerEmail'] : '',
            "details" => isset($input['details']) ? $input['details'] : [],
            "status" => "Pending",
            "createdAt" => date(DATE_ISO8601),
            "notifications" => ["New order received from landing page"]
        ];
        
        array_unshift($orders, $newOrder);
        file_put_contents($db_file, json_encode($orders, JSON_PRETTY_PRINT));
        
        // --- SEND NOTIFICATION EMAIL TO info@cuvatech.com ---
        $to = "info@cuvatech.com";
        $subject = "New Cuva Tech Docket: " . $newOrder['type'] . " Order (" . $newOrder['id'] . ")";
        
        // Strip image base64 raw string from the email body to keep the email clean and prevent spam blocks
        $cleanDetails = $newOrder['details'];
        if (isset($cleanDetails['fileData'])) {
            $cleanDetails['fileData'] = '[Image Base64 Data Uploaded Successfully]';
        }
        
        $message = "You have received a new service order on Cuva Tech.\n\n";
        $message .= "ID: " . $newOrder['id'] . "\n";
        $message .= "Service Type: " . $newOrder['type'] . "\n";
        $message .= "Customer: " . $newOrder['customerName'] . " (" . $newOrder['customerEmail'] . ")\n";
        $message .= "Date: " . $newOrder['createdAt'] . "\n\n";
        $message .= "Order Details:\n" . print_r($cleanDetails, true) . "\n\n";
        $message .= "Manage this order inside your admin panel: https://" . $_SERVER['HTTP_HOST'] . "/admin\n";
        
        $headers = "From: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n" .
                   "Reply-To: " . $newOrder['customerEmail'] . "\r\n" .
                   "X-Mailer: PHP/" . phpversion();
        
        // Send mail (cPanel handles this via sendmail)
        @mail($to, $subject, $message, $headers);
        
        echo json_encode($newOrder);
    }
    exit();
}

// Route: orders/:id/status
if (preg_match('/^orders\/([^\/]+)\/status$/', $path, $matches)) {
    $order_id = $matches[1];
    $input = getJsonInput();
    $orders = json_decode(file_get_contents($db_file), true);
    
    $found = false;
    foreach ($orders as &$order) {
        if ($order['id'] === $order_id) {
            $order['status'] = $input['status'];
            array_unshift($order['notifications'], "Order status updated to " . $input['status'] . " at " . date('H:i:s'));
            $found = true;
            $updated_order = $order;
            break;
        }
    }
    
    if ($found) {
        file_put_contents($db_file, json_encode($orders, JSON_PRETTY_PRINT));
        echo json_encode($updated_order);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Order not found"]);
    }
    exit();
}

// Route: orders/:id/notifications
if (preg_match('/^orders\/([^\/]+)\/notifications$/', $path, $matches)) {
    $order_id = $matches[1];
    $input = getJsonInput();
    $orders = json_decode(file_get_contents($db_file), true);
    
    $found = false;
    foreach ($orders as &$order) {
        if ($order['id'] === $order_id) {
            array_unshift($order['notifications'], $input['message']);
            $found = true;
            $updated_order = $order;
            break;
        }
    }
    
    if ($found) {
        file_put_contents($db_file, json_encode($orders, JSON_PRETTY_PRINT));
        echo json_encode($updated_order);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Order not found"]);
    }
    exit();
}

// Route: orders/:id/note (PATCH)
if (preg_match('/^orders\/([^\/]+)\/note$/', $path, $matches)) {
    $order_id = $matches[1];
    $input = getJsonInput();
    $orders = json_decode(file_get_contents($db_file), true);
    
    $found = false;
    foreach ($orders as &$order) {
        if ($order['id'] === $order_id) {
            $note = isset($input['note']) ? $input['note'] : '';
            array_unshift($order['notifications'], "📝 Note: \"" . substr($note, 0, 80) . "\"");
            $found = true;
            $updated_order = $order;
            break;
        }
    }
    
    if ($found) {
        file_put_contents($db_file, json_encode($orders, JSON_PRETTY_PRINT));
        echo json_encode($updated_order);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Order not found"]);
    }
    exit();
}

// Route: orders/:id (DELETE)
if (preg_match('/^orders\/([^\/]+)$/', $path, $matches) && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $order_id = $matches[1];
    $orders = json_decode(file_get_contents($db_file), true);
    
    $found = false;
    foreach ($orders as $key => $order) {
        if ($order['id'] === $order_id) {
            // Clean up uploaded file if exists
            $upload_url = '';
            if (isset($order['details']['fileUrl']) && $order['details']['fileUrl']) {
                $upload_url = $order['details']['fileUrl'];
            } elseif (isset($order['details']['logoUrl']) && $order['details']['logoUrl']) {
                $upload_url = $order['details']['logoUrl'];
            }

            if ($upload_url) {
                $file_path = __DIR__ . $upload_url;
                if (file_exists($file_path)) {
                    @unlink($file_path);
                }
            }
            unset($orders[$key]);
            $orders = array_values($orders);
            $found = true;
            break;
        }
    }
    
    if ($found) {
        file_put_contents($db_file, json_encode($orders, JSON_PRETTY_PRINT));
        http_response_code(200);
        echo json_encode(["success" => true]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Order not found"]);
    }
    exit();
}

// Route: uploads (GET - list uploaded graphics)
if ($path === 'uploads' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $upload_dir = __DIR__ . '/uploads/';
    $image_exts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
    $files = [];

    if (is_dir($upload_dir)) {
        foreach (scandir($upload_dir) as $filename) {
            if ($filename === '.' || $filename === '..') {
                continue;
            }

            $file_path = $upload_dir . $filename;
            if (!is_file($file_path)) {
                continue;
            }

            $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
            $files[] = [
                "filename" => $filename,
                "size" => filesize($file_path),
                "sizeKB" => round(filesize($file_path) / 1024),
                "url" => "/uploads/" . $filename,
                "type" => in_array($ext, $image_exts) ? "image/" . $ext : "application/octet-stream",
                "uploadedAt" => date(DATE_ISO8601, filemtime($file_path))
            ];
        }
    }

    echo json_encode($files);
    exit();
}

// Route: uploads/:filename (DELETE - remove uploaded graphic)
if (preg_match('/^uploads\/([^\/]+)$/', $path, $matches) && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $filename = basename($matches[1]);
    $file_path = __DIR__ . '/uploads/' . $filename;

    if (!file_exists($file_path)) {
        http_response_code(404);
        echo json_encode(["error" => "File not found"]);
        exit();
    }

    if (@unlink($file_path)) {
        echo json_encode(["success" => true, "message" => "File " . $filename . " deleted"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete file"]);
    }
    exit();
}

// Route: upload (POST - multipart file upload)
if ($path === 'upload' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $upload_dir = __DIR__ . '/uploads/';
    
    // Create uploads directory if it doesn't exist
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['file'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['png', 'jpg', 'jpeg', 'pdf', 'ai', 'svg', 'gif', 'webp'];
        
        if (!in_array($ext, $allowed)) {
            http_response_code(400);
            echo json_encode(["error" => "File type not allowed"]);
            exit();
        }
        
        if ($file['size'] > 25 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode(["error" => "File exceeds 25MB limit"]);
            exit();
        }
        
        // Generate unique filename
        $new_name = bin2hex(random_bytes(12)) . '.' . $ext;
        $target = $upload_dir . $new_name;
        
        if (move_uploaded_file($file['tmp_name'], $target)) {
            echo json_encode([
                "url" => "/uploads/" . $new_name,
                "name" => $file['name'],
                "type" => $file['type']
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to save uploaded file"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "No file uploaded or upload error"]);
    }
    exit();
}

// Fallback error
http_response_code(404);
echo json_encode(["error" => "Endpoint not found"]);
?>
