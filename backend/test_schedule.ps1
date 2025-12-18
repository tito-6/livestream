$base = "http://localhost:8080/api"

Write-Host "--- EVENT EDIT TEST START ---" -ForegroundColor Magenta

# 1. Create Event
$ev = @{
    team_home  = "TestHome";
    team_away  = "TestAway";
    venue      = "Stadium X";
    start_time = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
} | ConvertTo-Json

$res = Invoke-RestMethod -Uri "$base/events" -Method Post -Body $ev -ContentType "application/json"
$id = $res.data.id
Write-Host "Created Event ID: $id" -ForegroundColor Green

# 2. Update Event
$upd = @{
    team_home = "UpdatedHome";
    venue     = "Stadium Y"
} | ConvertTo-Json

$res2 = Invoke-RestMethod -Uri "$base/events/$id" -Method Put -Body $upd -ContentType "application/json"

if ($res2.data.team_home -eq "UpdatedHome") {
    Write-Host "Event Update SUCCESS" -ForegroundColor Green
}
else {
    Write-Host "Event Update FAILED" -ForegroundColor Red
}

Write-Host "--- TEST COMPLETE ---" -ForegroundColor Magenta
