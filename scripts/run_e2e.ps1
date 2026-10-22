$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$nodePath = (Get-Command node).Source
$vitePath = Join-Path $projectRoot 'node_modules\vite\bin\vite.js'
$playwrightPath = Join-Path $projectRoot 'node_modules\@playwright\test\cli.js'
$resultsPath = Join-Path $projectRoot 'test-results'
$stdoutPath = Join-Path $resultsPath 'preview.stdout.log'
$stderrPath = Join-Path $resultsPath 'preview.stderr.log'

New-Item -ItemType Directory -Path $resultsPath -Force | Out-Null
$serverProcess = $null
try {
    $serverProcess = Start-Process `
        -FilePath $nodePath `
        -ArgumentList @($vitePath, 'preview', '--host', '127.0.0.1', '--port', '4173') `
        -WorkingDirectory $projectRoot `
        -RedirectStandardOutput $stdoutPath `
        -RedirectStandardError $stderrPath `
        -WindowStyle Hidden `
        -PassThru

    $ready = $false
    for ($attempt = 0; $attempt -lt 40; $attempt++) {
        try {
            $response = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:4173' -TimeoutSec 1
            if ($response.StatusCode -eq 200) {
                $ready = $true
                break
            }
        }
        catch {
            Start-Sleep -Milliseconds 250
        }
    }
    if (-not $ready) {
        $serverError = if (Test-Path $stderrPath) { Get-Content $stderrPath -Raw } else { '' }
        throw "Vite preview did not become ready. $serverError"
    }

    & $nodePath $playwrightPath test
    exit $LASTEXITCODE
}
finally {
    if ($serverProcess -and -not $serverProcess.HasExited) {
        Stop-Process -Id $serverProcess.Id -Force
    }
}
