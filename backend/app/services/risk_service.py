def risk_level_for_score(score: float) -> str:
    if score >= 80:
        return "critical"
    if score >= 60:
        return "high"
    if score >= 35:
        return "medium"
    return "low"


def condition_status_for_level(level: str) -> str:
    if level == "critical":
        return "blocked"
    if level in {"high", "medium"}:
        return "risky"
    return "safe"
