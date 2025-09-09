<?php
// Enable debug mode for development
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// Disable frontend access for non-admin users
if (!defined('DOING_CRON') && !defined('DOING_AJAX') && !current_user_can('administrator')) {
    wp_redirect(home_url('/wp-admin'));
    exit;
}

// Allow CORS for frontend
function add_cors_http_header() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}
add_action('init','add_cors_http_header');

// Disable XML-RPC
add_filter('xmlrpc_enabled', '__return_false');

// Disable REST API for non-authenticated users
add_filter('rest_authentication_errors', function($result) {
    if (!empty($result)) {
        return $result;
    }
    if (!is_user_logged_in()) {
        return new WP_Error('rest_not_logged_in', 'You are not logged in.', array('status' => 401));
    }
    return $result;
});
