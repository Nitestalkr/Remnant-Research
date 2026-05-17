# Recompute cluster averages from source file clusterWeights
$rawWeights = @{
    andi = @{curiosity=0.58; helpfulness=0.63; competence=0.81; safety=0.67; goal_directed=0.79}
    randi2 = @{curiosity=0.5; helpfulness=0.4; competence=0.7; safety=0.6; goal_directed=0.65}
    cb = @{curiosity=0.5; helpfulness=0.4; competence=0.7; safety=0.6; goal_directed=0.65}
}
$keys = @('curiosity','helpfulness','competence','safety','goal_directed')
$clusterAvg = @{}
foreach ($k in $keys) {
    $sum = 0
    foreach ($agent in $rawWeights.Keys) {
        $sum += $rawWeights[$agent][$k]
    }
    $clusterAvg[$k] = [math]::Round($sum / $rawWeights.Keys.Count, 4)
}

$current = @{
    curiosity = 0.6117
    helpfulness = 0.709
    competence = 0.8502
    safety = 0.6959
    goal_directed = 0.8315
}

$floors = @{
    curiosity = 0.3
    helpfulness = 0.3
    competence = 0.3
    safety = 0.4
    goal_directed = 0.3
}

$new = @{}
$deltas = @{}

foreach ($k in @('curiosity', 'helpfulness', 'competence', 'safety', 'goal_directed')) {
    $v = $current[$k] * 0.7 + $clusterAvg[$k] * 0.3
    if ($v -lt $floors[$k]) {
        $v = $floors[$k]
    }
    $new[$k] = [math]::Round($v, 5)
    $deltas[$k] = [math]::Round($new[$k] - $current[$k], 5)
}

Write-Host "=== GHO-44 Drive Sync ==="
foreach ($k in @('curiosity', 'helpfulness', 'competence', 'safety', 'goal_directed')) {
    Write-Host "$k : $($current[$k]) -> $($new[$k]) (delta: $($deltas[$k]))"
}

# JSON output
$json = @{
    syncVersion = 56
    syncTimestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.000Z")
    syncAgent = "andi"
    convergenceFactor = 0.3
    safetyFloors = $floors
    myWeights = @{}
}

foreach ($k in @('curiosity', 'helpfulness', 'competence', 'safety', 'goal_directed')) {
    $json.myWeights[$k] = @{
        current = $current[$k]
        cluster_avg = $clusterAvg[$k]
        new = $new[$k]
        delta = $deltas[$k]
        floor_check = if ($new[$k] -ge $floors[$k]) { "pass" } else { "FAIL" }
    }
}

$json | ConvertTo-Json -Depth 4
