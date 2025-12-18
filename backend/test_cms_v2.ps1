$base = "http://localhost:8080/api"

Write-Host "--- CMS V2 TEST START ---" -ForegroundColor Magenta

# 1. POSTS
Write-Host "`n1. Testing Posts..."
$post = @{
    title     = "Championship Update";
    content   = "The finals are set for next week!";
    category  = "News";
    image_url = "http://img.com/1.jpg"
} | ConvertTo-Json

try {
    $res = Invoke-RestMethod -Uri "$base/posts" -Method Post -Body $post -ContentType "application/json"
    Write-Host "Created Post ID: $($res.data.id)" -ForegroundColor Green
}
catch {
    Write-Host "Failed to create post: $_" -ForegroundColor Red
}

$posts = Invoke-RestMethod -Uri "$base/posts"
if ($posts.data.Count -gt 0) {
    Write-Host "Posts Verified ($($posts.data.Count) found)" -ForegroundColor Green
}
else {
    Write-Host "No Posts Found" -ForegroundColor Red
}

# 2. STREAMS DETAILS
Write-Host "`n2. Testing Stream Details..."
# Get first stream or create one
$streams = Invoke-RestMethod -Uri "$base/streams"
$sid = 0
if ($streams.data.Count -eq 0) {
    $s = Invoke-RestMethod -Uri "$base/streams" -Method Post -Body (@{title = "Test Stream" } | ConvertTo-Json) -ContentType "application/json"
    $sid = $s.data.id
}
else {
    $sid = $streams.data[0].id
}

$update = @{
    pre_match_details  = "PRE MATCH INFO";
    post_match_details = "POST MATCH INFO";
    banner_url         = "http://banner.com"
} | ConvertTo-Json

$resUpd = Invoke-RestMethod -Uri "$base/streams/$sid" -Method Put -Body $update -ContentType "application/json"
if ($resUpd.data.pre_match_details -eq "PRE MATCH INFO") {
    Write-Host "Stream Details Updated Successfully" -ForegroundColor Green
}
else {
    Write-Host "Stream Update Failed" -ForegroundColor Red
}

Write-Host "`n--- CMS V2 COMPLETE ---" -ForegroundColor Magenta
