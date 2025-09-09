#!/bin/bash

# Exit on error
set -e

echo "Setting up WordPress for headless mode..."

# Install WP-CLI if not exists
if ! command -v wp &> /dev/null; then
    echo "Installing WP-CLI..."
    curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
    chmod +x wp-cli.phar
    sudo mv wp-cli.phar /usr/local/bin/wp
fi

# Wait for WordPress to be ready
until wp core is-installed --allow-root; do
    echo "Waiting for WordPress to be ready..."
    sleep 5
done

# Install and activate required plugins
echo "Installing required plugins..."
wp plugin install --activate --allow-root \
    jwt-authentication-for-wp-rest-api \
    wp-rest-api-controller \
    advanced-custom-fields \
    custom-post-type-ui \
    wordpress-seo \
    wp-graphql

# Configure JWT Authentication
echo "Configuring JWT Authentication..."
wp config set JWT_AUTH_SECRET_KEY 'your-secret-key' --add --type=constant --allow-root
wp config set JWT_AUTH_CORS_ENABLE true --add --type=constant --allow-root
wp rewrite structure '/%postname%/' --hard --allow-root
wp rewrite flush --hard --allow-root

# Create necessary custom post types
echo "Creating custom post types..."
wp scaffold plugin snaptechfix-cpt --skip-tests --force --allow-root

# Add custom post type registration to the plugin
cat > wp-content/plugins/snaptechfix-cpt/snaptechfix-cpt.php << 'EOL'
<?php
/**
 * Plugin Name:  SnapTechFix Custom Post Types
 * Description: Custom Post Types for SnapTechFix
 * Version:     1.0.0
 */

function snaptechfix_register_post_types() {
    // Services Post Type
    register_post_type('service', [
        'labels' => [
            'name' => 'Services',
            'singular_name' => 'Service',
        ],
        'public' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
        'menu_icon' => 'dashicons-admin-tools',
    ]);

    // Products Post Type
    register_post_type('product', [
        'labels' => [
            'name' => 'Products',
            'singular_name' => 'Product',
        ],
        'public' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
        'menu_icon' => 'dashicons-cart',
    ]);
}
add_action('init', 'snaptechfix_register_post_types');
EOL

# Activate the custom post types plugin
wp plugin activate snaptechfix-cpt --allow-root

# Set up default pages
echo "Creating default pages..."
wp post create --post_type=page --post_title='Home' --post_status=publish --allow-root
wp post create --post_type=page --post_title='Repair' --post_status=publish --allow-root
wp post create --post_type=page --post_title='Buy Back' --post_status=publish --allow-root
wp post create --post_type=page --post_title='Training' --post_status=publish --allow-root
wp post create --post_type=page --post_title='Gallery' --post_status=publish --allow-root
wp post create --post_type=page --post_title='Blog' --post_status=publish --allow-root

# Set up default menu
echo "Setting up default menu..."
wp menu create "Main Menu" --allow-root
wp menu location assign "Main Menu" primary --allow-root
wp menu item add-post "Main Menu" 1 --title="Home" --allow-root
wp menu item add-post "Main Menu" 2 --title="Repair" --allow-root
wp menu item add-post "Main Menu" 3 --title="Buy Back" --allow-root
wp menu item add-post "Main Menu" 4 --title="Training" --allow-root
wp menu item add-post "Main Menu" 5 --title="Gallery" --allow-root
wp menu item add-post "Main Menu" 6 --title="Blog" --allow-root

echo "WordPress setup complete!"
echo "Access your WordPress admin at: http://localhost:8000/wp-admin"
echo "Access phpMyAdmin at: http://localhost:8080"
