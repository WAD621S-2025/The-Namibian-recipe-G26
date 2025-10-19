# Taste Namibia - Traditional Recipe Platform

A web-based platform for discovering, searching, and sharing traditional Namibian recipes, built with HTML, CSS, JavaScript, and PHP.
//Max//
## Features

- **Homepage**: Beautiful introduction to Namibian cuisine with featured recipes
- **Recipe Browsing**: Grid layout with search and category filtering
- **Recipe Details**: Full ingredient lists, instructions, and cultural context
- **Recipe Submission**: Form for users to share their traditional recipes
- **About Page**: Information about Namibian culinary heritage
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: PHP 7.4+
- **Database**: MySQL or SQLite
- **Server**: Apache (XAMPP recommended for local development)

## Installation

### Prerequisites
- XAMPP (includes Apache, PHP, and MySQL)
- Web browser
- Text editor

### Setup Instructions

1. **Download and Install XAMPP**
   - Download from [https://www.apachefriends.org/](https://www.apachefriends.org/)
   - Install and start Apache and MySQL services

2. **Clone/Download Project**
   ```bash
   # Place project files in XAMPP's htdocs directory
   # Usually located at: C:\xampp\htdocs\taste-namibia\
   ```

3. **Database Setup**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a new database called `taste_namibia`
   - Import the `database_setup.sql` file to create tables and sample data
   
   **Alternative (SQLite):**
   - The PHP files will automatically create an SQLite database if MySQL is not available

4. **Configure Database Connection**
   - Edit `submit_recipe.php` and `get_recipes.php`
   - Update database credentials if needed:
   ```php
   $db_host = 'localhost';
   $db_name = 'taste_namibia';
   $db_user = 'root';
   $db_pass = '';
   ```

5. **Start the Application**
   - Open your browser
   - Navigate to `http://localhost/taste-namibia/`

## File Structure

```
taste-namibia/
├── index.html              # Homepage
├── recipes.html            # Recipe browsing page
├── submit.html             # Recipe submission form
├── about.html              # About page
├── styles.css              # Main stylesheet
├── recipes.js              # Recipe browsing functionality
├── submit.js               # Form handling
├── submit_recipe.php       # Backend form processing
├── get_recipes.php         # API for fetching recipes
├── database_setup.sql      # Database schema and sample data
├── uploads/                # Directory for uploaded images
└── README.md              # This file
```

## Usage

### Browsing Recipes
1. Visit the homepage to see featured dishes
2. Click "Browse Recipes" or navigate to the Recipes page
3. Use the search bar to find recipes by name or ingredient
4. Filter by category using the filter buttons
5. Click any recipe card to view full details

### Submitting Recipes
1. Navigate to "Submit Recipe" page
2. Fill in all required fields:
   - Recipe name and description
   - Category and difficulty level
   - Prep/cook time and servings
   - Ingredients list
   - Step-by-step instructions
   - Optional: Cultural context and image
3. Click "Submit Recipe"

### Search Functionality
- **Real-time search**: Results update as you type
- d search**: Searches recipe names, descriptions, and ingredients
- **Category filtering**: Filter by dish type
- **Combined filters**: Search and category filters work together

## Customization

### Additegories
1. Update the category options in `submit.html`
2. Add corresponding filter buttons in `recipes.html`
3. Update the `getCategoryDisplayName()` function in `recipes.js`

### Styling Changes
- Edit `styles.css` to modify colors, fonts, and layouts
- The design uses CSS Grid and Flexbox for responsive layouts
- Color scheme is based on warm amber tones reflecting Namibian landscapes

### Adding New Features
- **User accounts**: Extend PHP backend with user authentication
- **Recipe ratings**: Add rating system to database and frontend
- **Comments**: Allow users to comment on recipes
- **Advanced search**: Add more search filters (prep time, difficulty, etc.)

## Database Schema

### Recipes Table
- `id`: Primary key (auto-increment)
- `name`: Recipe name (VARCHAR 255)
- `description`: Brief description (TEXT)
- `category`: Recipe category (VARCHAR 50)
- `prep_time`: Preparation time in minutes (INT)
- `cook_time`: Cooking time in minutes (INT)
- `servings`: Number of servings (INT)
- `difficulty`: Easy/Medium/Hard (ENUM)
- `ingredients`: JSON array of ingredients
- `instructions`: JSON array of instructions
- `cultural_context`: Cultural background (TEXT)
- `image_url`: Recipe image URL (VARCHAR 500)
- `created_at`: Timestamp (TIMESTAMP)

## Security Considerations

- Input validation on both frontend and backend
- SQL injection prevention using prepared statements
- File upload restrictions (type and size limits)
- XSS protection through proper data sanitization

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Cultural Note

This platform is designed to preserve and celebrate Namibian culinary heritage. We encourage authentic recipes and respectful representation of cultural traditions.

## Support

For issues or questions:
1. Check the browser console for JavaScript errors
2. Verify database connection and table structure
3. Ensure XAMPP services are running
4. Check file permissions for uploads directory

## Future Enhancements

- User authentication system
- Recipe rating and review system
- Social sharing features
- Mobile app version
- Multi-language support
- Recipe video uploads
- Nutritional information
- Meal planning features