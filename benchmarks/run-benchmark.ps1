# Benchmark Runner — Automated System Metrics Collection
# Usage: pwsh run-benchmark.ps1 [--bucket cognitive|agents|research|stability|all]

param(
    [ValidateSet('cognitive', 'agents', 'research', 'stability', 'all')]
    [string]$Bucket = 'all'
)

$repoRoot = $PSScriptRoot
$outputDir = "$repoRoot\metrics"
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$reportFile = "$outputDir\benchmark_${timestamp}.json"

Write-Output "Running benchmark for bucket: $Bucket"

# Helper: get cron job status
function Get-CronStatus {
    param([string]$JobId)
    $jobs = @()
    # This will be populated via the cron tool in the agent context
    # For standalone script, returns placeholder
    return @{ status = 'agent-collected'; note = 'Run via OpenClaw cron for live data' }
}

# Helper: get drive stats
function Get-DriveStats {
    $drives = Get-Volume | Where-Object { $_.DriveLetter -and $_.Size -gt 0 }
    $result = @()
    foreach ($d in $drives) {
        $used = [math]::Round(($d.Size - $d.SizeRemaining) / 1GB, 1)
        $total = [math]::Round($d.Size / 1GB, 1)
        $pct = [math]::Round(($d.Size - $d.SizeRemaining) / $d.Size * 100, 1)
        $result += @{
            drive = $d.DriveLetter
            used_gb = $used
            total_gb = $total
            percent_used = $pct
        }
    }
    return $result
}

# Helper: get OS memory
function Get-OSMemory {
    $os = Get-CimInstance Win32_OperatingSystem
    $freeGB = [math]::Round($os.FreePhysicalMemory / 1GB, 1)
    $totalGB = [math]::Round($os.TotalVisibleMemorySize / 1GB, 1)
    $pct = [math]::Round($os.FreePhysicalMemory / $os.TotalVisibleMemorySize * 100, 1)
    return @{
        free_gb = $freeGB
        total_gb = $totalGB
        percent_free = $pct
    }
}

# Build benchmark data
$benchmark = @{
    timestamp = $timestamp
    bucket = $Bucket
    metrics = @{}
}

if ($Bucket -eq 'all' -or $Bucket -eq 'stability') {
    Write-Output "Collecting stability metrics..."
    $benchmark.metrics.stability = @{
        os_memory = Get-OSMemory
        drives = Get-DriveStats
        gateway_status = 'agent-collected'
        cron_health = 'agent-collected'
        crash_frequency = 'agent-collected'
        plugin_health = 'agent-collected'
    }
}

if ($Bucket -eq 'all' -or $Bucket -eq 'cognitive') {
    Write-Output "Collecting cognitive metrics..."
    $benchmark.metrics.cognitive = @{
        gnw_cycle_count = 'agent-collected'
        gnw_cycle_completeness = 'agent-collected'
        grao_round = 'agent-collected'
        grao_success_rate = 'agent-collected'
        exploration_ratio = 'agent-collected'
        boredom_scan_status = 'agent-collected'
    }
}

if ($Bucket -eq 'all' -or $Bucket -eq 'agents') {
    Write-Output "Collecting agent metrics..."
    $benchmark.metrics.agents = @{
        dev_team_status = 'agent-collected'
        visual_team_status = 'agent-collected'
        task_completion_rate = 'agent-collected'
        handoff_success_rate = 'agent-collected'
        error_rate = 'agent-collected'
        skill_utilization = 'agent-collected'
    }
}

if ($Bucket -eq 'all' -or $Bucket -eq 'research') {
    Write-Output "Collecting research metrics..."
    $benchmark.metrics.research = @{
        arxiv_monitor_status = 'agent-collected'
        paper_relevance_score = 'agent-collected'
        deep_dive_consolidation = 'agent-collected'
        prototype_viability = 'agent-collected'
        keyword_count = 'agent-collected'
    }
}

# Write JSON output
$benchmark | ConvertTo-Json -Depth 4 | Out-File -Encoding utf8 $reportFile

Write-Output "Benchmark saved to: $reportFile"
Write-Output "Next step: Run analysis report via OpenClaw agent"
