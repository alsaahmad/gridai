from typing import Dict

def get_seasonal_forecast(month: int) -> Dict:
    """
    Seasonal demand modeling:
    - Apr-Jul: HIGH (Summer)
    - Nov-Feb: MEDIUM (Winter)
    - Else: LOW
    """
    if 4 <= month <= 7:
        peak_season = "Summer Peak"
        monthly_risk_score = 8.5
        weekly_pattern = "Consistently High"
    elif month in [11, 12, 1, 2]:
        peak_season = "Winter High"
        monthly_risk_score = 6.0
        weekly_pattern = "Morning/Night Peaks"
    else:
        peak_season = "Off-Peak"
        monthly_risk_score = 3.5
        weekly_pattern = "Moderate Stable"

    return {
        "month": month,
        "peak_season": peak_season,
        "monthly_risk_score": monthly_risk_score,
        "weekly_pattern": weekly_pattern
    }
