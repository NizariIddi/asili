<?php
// Minimal PHP backend for Asili & Udongo
// Database connection - suppress errors for now
$host = '127.0.0.1';
$dbname = 'asili_udongo';
$user = 'root';
$pass = '';

$pdo = @new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
if ($pdo) {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}

// Simple routing based on URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = strtok($uri, '?');

// Serve index.html for root
if ($uri === '/' || $uri === '') {
    echo file_get_contents(__DIR__ . '/index.html');
    exit;
}

// API: Products - GET list
if ($uri === '/api/products' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category = c.name");
            echo json_encode(["success" => true, "products" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => "Database error"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Database not configured"]);
    }
    exit;
}

// API: Products - GET by ID
if ($uri === '/api/products') {
    $id = $_GET['id'] ?? '';
    if ($id) {
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category = c.name WHERE p.id = ?");
                $stmt->execute([$id]);
                $product = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($product) {
                    echo json_encode(["success" => true, "product" => $product]);
                } else {
                    http_response_code(404);
                    echo json_encode(["success" => false, "message" => "Product not found"]);
                }
            } catch (PDOException $e) {
                echo json_encode(["success" => false, "message" => "Database error"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Database not configured"]);
        }
    }
    exit;
}

// 404 for unknown routes
http_response_code(404);
echo "404 Not Found";
