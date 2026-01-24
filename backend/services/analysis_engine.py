
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

def calculate_spending_summary(df: pd.DataFrame) -> dict:
    """
    Calculates spending summary stats.
    Requires: 'Amount' column. Optional: 'Date', 'Category'.
    """
    summary = {}
    
    if "Amount" not in df.columns:
        return {}

    # 1. Total Spend (Sum of negative numbers usually, but here likely absolute if mixed? 
    # Let's assume input is standard: Debits are negative or positive depending on bank. 
    # For now, let's sum numeric values. If we standardized columns, Amount is typically numeric.
    # We will compute Total Volume (Sum of Abs) and Net Flow.
    
    # Clean numeric
    amounts = pd.to_numeric(df["Amount"], errors='coerce').fillna(0)
    
    summary["total_volume"] = float(amounts.abs().sum())
    summary["net_flow"] = float(amounts.sum())
    summary["transaction_count"] = int(len(df))
    summary["avg_transaction"] = float(amounts.mean()) if not df.empty else 0

    # 2. Date Range & Trend
    if "Date" in df.columns:
        try:
            # Check format first? Standardizer usually handles conversion to datetime objects if possible.
            # But standardizer just regexes names, doesn't parse content yet? 
            # Oh, the plan said "Standardizer... Convert data types". 
            # Let's verify standardizer.py content. 
            # Wait, standardizer logic in `standardizer.py` (checked earlier in `view_code_item` Step 821) 
            # only renamed columns, didn't convert types. 
            # I should probably robustly convert to datetime here or in standardizer.
            # Let's do it here safely.
            dates = pd.to_datetime(df["Date"], errors='coerce')
            valid_dates = dates.dropna()
            
            if not valid_dates.empty:
                summary["date_range"] = {
                    "start": valid_dates.min().isoformat(),
                    "end": valid_dates.max().isoformat()
                }
                
                # Monthly Trend
                # Group by Month-Year
                # Create a temporary dataframe for grouping
                temp_df = pd.DataFrame({"Date": dates, "Amount": amounts})
                temp_df = temp_df.dropna(subset=["Date"])
                
                # Resample or GroupBy
                # monthly = temp_df.set_index('Date').resample('M')['Amount'].sum() # 'M' is deprecated in favor of 'ME'
                # Let's use string formatting for safer grouping without relying on deprecated pandas aliases
                temp_df["Month"] = temp_df["Date"].dt.strftime("%Y-%m")
                monthly_trend = temp_df.groupby("Month")["Amount"].sum().to_dict()
                summary["monthly_trend"] = monthly_trend
                
        except Exception as e:
            print(f"Date parsing failed in summary: {e}")

    # 3. Category Breakdown
    if "Category" in df.columns:
        # Fill NA
        cats = df["Category"].fillna("Uncategorized").astype(str)
        # Group by Category, sum Amounts
        # We probably want sum of ABS amounts to see volume per category? 
        # Or just sum? Usually sum of expenses. 
        # If dataset has income (positive) and expense (negative), summing might cancel out.
        # Let's assume simpler: Breakdown by Count for now, or Sum of Abs?
        # Let's do Count and Sum.
        
        # We need to join with amounts
        temp_cat = pd.DataFrame({"Category": cats, "Amount": amounts})
        breakdown = temp_cat.groupby("Category")["Amount"].agg(['sum', 'count'])
        
        # Convert to simple dict usually preferred for JSON
        # Top 5 by volume
        breakdown["abs_sum"] = breakdown["sum"].abs()
        top_cats = breakdown.sort_values("abs_sum", ascending=False).head(6)
        
        summary["top_categories"] = top_cats.drop(columns=["abs_sum"]).to_dict(orient="index")

    return summary
