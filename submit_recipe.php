<?php
// Database configuration
$db_host = 'localhost';
$db_port = '3306';
$db_name = 'taste_namibia';
$db_user = 'root';
$db_pass = '';

// Create database connection
try {
    $pdo = new PDO("mysql:host=$db_host;port=$db_port;dbname=$db_name", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Validate required fields
        $required_fields = ['recipe_name', 'description', 'category'];
        foreach ($required_fields as $field) {
            if (empty($_POST[$field])) {
                throw new Exception("Missing required field: $field");
            }
        }
        
        // Validate ingredients and instructions
        if (empty($_POST['ingredients']) || !is_array($_POST['ingredients'])) {
            throw new Exception("At least one ingredient is required");
        }
        
        if (empty($_POST['instructions']) || !is_array($_POST['instructions'])) {
            throw new Exception("At least one instruction is required");
        }
        
        // Clean and prepare data
        $name = trim($_POST['recipe_name']);
        $description = trim($_POST['description']);
        $category = $_POST['category'];
        $prep_time = intval($_POST['prep_time'] ?? 0);
        $cook_time = intval($_POST['cook_time'] ?? 0);
        $servings = intval($_POST['servings'] ?? 1);
        $difficulty = $_POST['difficulty'] ?? 'Easy';
        $cultural_context = trim($_POST['cultural_context'] ?? '');
        
        // Process ingredients (remove empty ones)
        $ingredients = array_filter(array_map('trim', $_POST['ingredients']));
        if (empty($ingredients)) {
            throw new Exception("At least one ingredient is required");
        }
      
        // Process instructions (remove empty ones)
        $instructions = array_filter(array_map('trim', $_POST['instructions']));
        if (empty($instructions)) {
            throw new Exception("At least one instruction is required");
        }
        
        // Handle image upload or URL
        $image_data = null;
        $image_url = '';
        
        if (!empty($_FILES['recipe_image']['name'])) {
            // Handle file upload - store as base64 in database
            $file_extension = strtolower(pathinfo($_FILES['recipe_image']['name'], PATHINFO_EXTENSION));
            $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
            
            if (!in_array($file_extension, $allowed_extensions)) {
                throw new Exception("Invalid file type. Only JPG, PNG, and GIF are allowed.");
            }
            
            if ($_FILES['recipe_image']['size'] > 5 * 1024 * 1024) { // 5MB limit
                throw new Exception("File size too large. Maximum 5MB allowed.");
            }
            
            // Read file and convert to base64
            $image_content = file_get_contents($_FILES['recipe_image']['tmp_name']);
            if ($image_content === false) {
                throw new Exception("Failed to read uploaded image");
            }
            
            // Get MIME type
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime_type = finfo_file($finfo, $_FILES['recipe_image']['tmp_name']);
            finfo_close($finfo);
            
            // Store as data URI (base64)
            $image_data = 'data:' . $mime_type . ';base64,' . base64_encode($image_content);
            
        } elseif (!empty($_POST['image_url'])) {
            // Fallback to URL if provided
            $image_url = filter_var($_POST['image_url'], FILTER_VALIDATE_URL);
            if (!$image_url) {
                throw new Exception("Invalid image URL");
            }
        }
        
        // Convert arrays to JSON for storage
        $ingredients_json = json_encode($ingredients);
        $instructions_json = json_encode($instructions);
        
        // Insert into database
        $sql = "INSERT INTO recipes (name, description, category, prep_time, cook_time, servings, difficulty, ingredients, instructions, cultural_context, image_data, image_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $name,
            $description,
            $category,
            $prep_time,
            $cook_time,
            $servings,
            $difficulty,
            $ingredients_json,
            $instructions_json,
            $cultural_context,
            $image_data,
            $image_url
        ]);
        
        // Success response
        $response = [
            'success' => true,
            'message' => 'Recipe submitted successfully!',
            'recipe_id' => $pdo->lastInsertId()
        ];
        
        // If this is an AJAX request, return JSON
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            header('Content-Type: application/json');
            echo json_encode($response);
            exit;
        }
        
        // Otherwise redirect back to form with success message
        header('Location: submit.html?success=1');
        exit;
        
    } catch (Exception $e) {
        $error_message = $e->getMessage();
        
        // If this is an AJAX request, return JSON error
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'message' => $error_message
            ]);
            exit;
        }
        
        // Otherwise redirect back with error
        header('Location: submit.html?error=' . urlencode($error_message));
        exit;
    }
}

// If not a POST request, redirect to form
header('Location: submit.html');
exit;
