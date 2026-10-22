param(
    [Parameter(Mandatory = $true)][string]$InputPath,
    [Parameter(Mandatory = $true)][string]$OutputDirectory
)

$ErrorActionPreference = 'Stop'
$resolvedInput = (Resolve-Path -LiteralPath $InputPath).Path
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
$resolvedOutput = (Resolve-Path -LiteralPath $OutputDirectory).Path

$powerPoint = $null
$presentation = $null
try {
    $powerPoint = New-Object -ComObject PowerPoint.Application
    $powerPoint.AutomationSecurity = 3
    $presentation = $powerPoint.Presentations.Open($resolvedInput, -1, 0, 0)
    $presentation.Export($resolvedOutput, 'PNG', 1600, 900)
}
finally {
    if ($presentation -ne $null) {
        $presentation.Close()
        [void][Runtime.InteropServices.Marshal]::ReleaseComObject($presentation)
    }
    if ($powerPoint -ne $null) {
        $powerPoint.Quit()
        [void][Runtime.InteropServices.Marshal]::ReleaseComObject($powerPoint)
    }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
