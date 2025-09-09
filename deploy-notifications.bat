@echo off
echo 🚀 Deploying SnapTechFix Real Notifications to Supabase...
echo.

REM Check if Supabase CLI is installed
supabase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Supabase CLI not found. Please install it first:
    echo npm install -g supabase
    pause
    exit /b 1
)

echo ✅ Supabase CLI found
echo.

REM Deploy the notification function
echo 📤 Deploying send-notifications function...
supabase functions deploy send-notifications

if %errorlevel% neq 0 (
    echo ❌ Deployment failed
    pause
    exit /b 1
)

echo.
echo 🎉 Real notifications deployed successfully!
echo.
echo 📱 SMS notifications will be sent via Twilio (+18706865717)
echo 📧 Email notifications will be sent via SendGrid
echo 🎯 Recipients: +91 9731852323 and rayyanbusinessofficial@gmail.com
echo.
echo ✨ Your repair booking form now sends REAL notifications!
echo.
pause