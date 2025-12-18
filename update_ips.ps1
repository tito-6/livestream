$target = "192.168.1.171"
$files = Get-ChildItem -Path d:\streamcast -Recurse -Include *.tsx, *.ts, *.go

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw
        if ($null -eq $content) { continue }
        
        $newContent = $content -replace "localhost:8080", "$target`:8080"
        $newContent = $newContent -replace "localhost:3000", "$target`:3000"
        $newContent = $newContent -replace "localhost:1935", "$target`:1935"
        
        if ($content -ne $newContent) {
            Set-Content $file.FullName $newContent
            Write-Host "Updated $($file.Name)"
        }
    }
    catch {
        Write-Host "Failed to read $($file.Name): $_"
    }
}
