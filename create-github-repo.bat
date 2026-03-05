@echo off
echo ========================================
echo Creating GitHub Repository: UsPostalTracking-V2
echo ========================================
echo.
echo Please follow these steps:
echo.
echo 1. Open your browser and go to: https://github.com/new
echo 2. Repository name: UsPostalTracking-V2
echo 3. Description: Complete USPS package tracking website with 100+ FAQ schema
echo 4. Choose Public or Private
echo 5. DO NOT add README, .gitignore, or license
echo 6. Click "Create repository"
echo.
echo After creating the repository, press any key to push the code...
pause
echo.
echo Pushing code to GitHub...
git push -u origin main
echo.
echo ========================================
echo Done! Check your repository at:
echo https://github.com/chafii96/UsPostalTracking-V2
echo ========================================
pause
