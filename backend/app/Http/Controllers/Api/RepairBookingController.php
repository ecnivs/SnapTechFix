<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class RepairBookingController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Create a new repair booking with notifications
     */
    public function store(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'deviceCategory' => 'required|string',
            'brand' => 'required|string',
            'model' => 'required|string',
            'issue' => 'required|string',
            'name' => 'required|string|min:2',
            'email' => 'nullable|email',
            'phone' => 'required|string|min:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Generate unique booking code
            $publicCode = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));

            // Prepare booking data
            $bookingData = [
                'public_code' => $publicCode,
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'device_category' => $request->deviceCategory,
                'device_brand' => $request->brand,
                'device_model' => $request->model,
                'issue_description' => $request->issue,
                'status' => 'pending',
                'created_at' => now()
            ];

            // For demo purposes, we'll use the demo contact info
            $demoBookingData = [
                'public_code' => $publicCode,
                'name' => $request->name,
                'email' => config('notifications.demo_email'), // Use demo email
                'phone' => config('notifications.demo_phone'), // Use demo phone
                'device_category' => $request->deviceCategory,
                'device_brand' => $request->brand,
                'device_model' => $request->model,
                'issue_description' => $request->issue,
                'status' => 'pending',
                'created_at' => now()
            ];

            // Send notifications using demo contact info
            $notificationResults = $this->notificationService->sendRepairBookingNotifications($demoBookingData);

            // Log the booking attempt
            Log::info('Repair booking created', [
                'booking_code' => $publicCode,
                'customer' => $request->name,
                'device' => $request->brand . ' ' . $request->model,
                'notifications' => $notificationResults
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Repair booking created successfully!',
                'data' => [
                    'public_code' => $publicCode,
                    'name' => $request->name,
                    'device' => $request->brand . ' ' . $request->model,
                    'issue' => $request->issue,
                    'status' => 'pending',
                    'notifications' => $notificationResults
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Failed to create repair booking: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create repair booking. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get booking status by public code
     */
    public function track($publicCode)
    {
        try {
            // For demo purposes, return mock data
            $statuses = ['pending', 'confirmed', 'in_progress', 'completed'];
            $mockData = [
                'public_code' => $publicCode,
                'status' => $statuses[array_rand($statuses)],
                'device' => 'Demo Device',
                'created_at' => now()->subHours(2),
                'estimated_completion' => now()->addDays(2),
                'updates' => [
                    [
                        'status' => 'pending',
                        'message' => 'Order received and waiting for pickup',
                        'timestamp' => now()->subHours(2)
                    ]
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $mockData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }
    }

    /**
     * Test notification system
     */
    public function testNotifications(Request $request)
    {
        try {
            $testBookingData = [
                'public_code' => 'TEST' . rand(1000, 9999),
                'name' => 'Test Customer',
                'email' => config('notifications.demo_email'),
                'phone' => config('notifications.demo_phone'),
                'device_brand' => 'Apple',
                'device_model' => 'iPhone 13',
                'issue_description' => 'Screen replacement',
            ];

            $results = $this->notificationService->sendRepairBookingNotifications($testBookingData);

            return response()->json([
                'success' => true,
                'message' => 'Test notifications sent',
                'results' => $results
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send test notifications',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}