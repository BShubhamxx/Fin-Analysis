
import pandas as pd
import numpy as np
import math

def calculate_benford_stats(series: pd.Series) -> dict:
    """
    Calculates Benford's Law statistics for a given pandas Series (numeric).
    
    Returns:
        dict: {
            "distribution": { digit: { "actual": float, "expected": float }, ... },
            "score": float (Chi-Square like or MAD),
            "verdict": "Pass" | "Suspicious" | "Fail"
        }
    """
    # 1. Clean data: Remove NaNs, zeros, and take absolute values
    clean_series = series.dropna().abs()
    clean_series = clean_series[clean_series > 0]
    
    if clean_series.empty:
        return {"error": "No valid numeric data found for analysis"}

    # 2. Extract leading digits
    # Convert to string, take first char, convert back to int
    leading_digits = clean_series.astype(str).str[0].astype(int)
    
    # Filter only 1-9 (though clean_series > 0 check usually handles this, 0.5 -> '0'?)
    # str(0.5) is '0.5', first char '0'. Benford is usually 1-9.
    leading_digits = leading_digits[leading_digits.between(1, 9)]
    
    if leading_digits.empty:
         return {"error": "No valid leading digits (1-9) found"}

    total_count = len(leading_digits)
    
    # 3. Calculate Actual Frequencies
    actual_counts = leading_digits.value_counts().sort_index()
    actual_freq = (actual_counts / total_count).to_dict()
    
    # 4. Calculate Expected Frequencies & Deviation
    distribution = {}
    total_deviation = 0
    
    for digit in range(1, 10):
        expected_prob = math.log10(1 + 1/digit)
        actual_prob = actual_freq.get(digit, 0.0)
        
        diff = abs(actual_prob - expected_prob)
        total_deviation += diff
        
        distribution[digit] = {
            "actual": round(actual_prob, 4),
            "expected": round(expected_prob, 4)
        }
        
    # 5. Determine Verdict based on Mean Absolute Deviation (MAD)
    # MAD thresholds for Benford are somewhat heuristic.
    # < 0.006: Close conformity
    # 0.006 - 0.012: Acceptable conformity
    # 0.012 - 0.015: Marginally acceptable
    # > 0.015: Nonconformity
    
    # Let's use simpler bucket for MVP
    mad = total_deviation / 9
    
    if mad < 0.02: # Being generous for small datasets
        verdict = "Pass"
    elif mad < 0.05:
        verdict = "Suspicious"
    else:
        verdict = "Fail"

    return {
        "distribution": distribution,
        "mad_score": round(mad, 5),
        "verdict": verdict,
        "total_rows_analyzed": total_count
    }
