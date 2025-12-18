$base = "http://localhost:8080/api"

Write-Host "1. Testing CREATE Stream..."
$body = @{ title="Test Championship"; sport_category="Soccer" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "$base/streams" -Method Post -Body $body -ContentType "application/json"
$id = $response.data.id
Write-Host "Created Stream ID: $id" -ForegroundColor Green

Write-Host "2. Testing READ Stream..."
$stream = Invoke-RestMethod -Uri "$base/streams/$id"
Write-Host "Stream Title: $($stream.data.title)" -ForegroundColor Cyan

Write-Host "3. Testing UPDATE Stream (Go LIVE)..."
$updateBody = @{ is_live=$true; title="Live Championship Logic" } | ConvertTo-Json
$updated = Invoke-RestMethod -Uri "$base/streams/$id" -Method Put -Body $updateBody -ContentType "application/json"
Write-Host "New Status: $($updated.data.is_live)" -ForegroundColor Yellow

Write-Host "4. Testing DELETE Stream..."
Invoke-RestMethod -Uri "$base/streams/$id" -Method Delete
Write-Host "Stream Deleted" -ForegroundColor Red

Write-Host "API Test Complete"
