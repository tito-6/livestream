$base = "http://localhost:8080/api"

Write-Host "--- CMS API TEST START ---" -ForegroundColor Magenta

# 1. BANNERS
Write-Host "`n1. Testing Banners..."
$banner = @{
    title_en    = "Mega Tournament";
    title_ar    = "Mega Tournament AR";
    subtitle_en = "Watch Live";
    subtitle_ar = "Watch Live AR";
    image_url   = "http://test.com/img.jpg";
    is_active   = $true
} | ConvertTo-Json
$res = Invoke-RestMethod -Uri "$base/content/banners" -Method Post -Body $banner -ContentType "application/json"
Write-Host "Created Banner: $($res.data.title_en)" -ForegroundColor Green

$active = Invoke-RestMethod -Uri "$base/content/active-banner"
if ($active.data.title_en -eq "Mega Tournament") {
    Write-Host "Active Banner Verified" -ForegroundColor Green
}
else {
    Write-Host "Active Banner Mismatch" -ForegroundColor Red
}

# 2. EVENTS
Write-Host "`n2. Testing Events..."
$event = @{
    title      = "Finals";
    team_home  = "Team A";
    team_away  = "Team B";
    venue      = "Stadium X";
    sport      = "football";
    start_time = (Get-Date).AddDays(1).ToString("yyyy-MM-ddTHH:mm:ssZ")
} | ConvertTo-Json
$resEvent = Invoke-RestMethod -Uri "$base/events" -Method Post -Body $event -ContentType "application/json"
$eventId = $resEvent.data.id
Write-Host "Created Event ID: $eventId" -ForegroundColor Green

$events = Invoke-RestMethod -Uri "$base/events"
if ($events.data.Count -gt 0) {
    Write-Host "Events List Verified ($($events.data.Count) found)" -ForegroundColor Green
}

# 3. USERS
Write-Host "`n3. Testing Users..."
$users = Invoke-RestMethod -Uri "$base/users"
Write-Host "Users Found: $($users.data.Count)" -ForegroundColor Cyan
if ($users.data.Count -gt 0) {
    $uid = $users.data[0].id
    $ban = Invoke-RestMethod -Uri "$base/users/$uid/ban" -Method Post
    Write-Host "User $uid Ban Status: $($ban.data.is_banned)" -ForegroundColor Yellow
    # Unban
    Invoke-RestMethod -Uri "$base/users/$uid/ban" -Method Post | Out-Null
}

Write-Host "`n--- CMS TEST COMPLETE ---" -ForegroundColor Magenta
