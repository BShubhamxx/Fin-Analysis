
import pandas as pd
import re

class UnifiedTransaction:
    """
    Standard Schema for Financial Transactions
    """
    DATE = "Date"
    DESCRIPTION = "Description"
    AMOUNT = "Amount"
    CATEGORY = "Category"
    
    # Required columns for a valid transaction
    REQUIRED_COLUMNS = [DATE, AMOUNT]

def normalize_column_name(col_name: str) -> str:
    """
    Normalizes a column name to lower case alpha-numeric for comparison.
    """
    return re.sub(r'[^a-z0-9]', '', str(col_name).lower())

def standardize_columns(df: pd.DataFrame) -> tuple[pd.DataFrame, dict]:
    """
    Maps DataFrame columns to the UnifiedTransaction schema.
    Returns the standardized DataFrame and the mapping used.
    """
    column_mapping = {}
    reverse_mapping = {}
    
    # potential matches for each standard column
    patterns = {
        UnifiedTransaction.DATE: [r'date', r'txn.*date', r'timestamp', r'day', r'time'],
        UnifiedTransaction.DESCRIPTION: [r'desc', r'narrative', r'particulars', r'details', r'memo', r'transaction'],
        UnifiedTransaction.AMOUNT: [r'amount', r'amt', r'debit', r'credit', r'value', r'cost'],
        UnifiedTransaction.CATEGORY: [r'category', r'type', r'class']
    }
    
    original_columns = df.columns.tolist()
    
    for col in original_columns:
        normalized_col = normalize_column_name(col)
        matched = False
        
        for standard_col, regex_list in patterns.items():
            if standard_col in reverse_mapping.values():
                continue # Already found a match for this standard column
                
            for pattern in regex_list:
                if re.search(pattern, normalized_col):
                    column_mapping[col] = standard_col
                    reverse_mapping[col] = standard_col # keep track to avoid duplicates
                    matched = True
                    break
            if matched:
                break
    
    # Create a new dataframe with standardized columns only
    # We rename columns in place to keep the original data
    df_standardized = df.rename(columns=column_mapping)
    
    # Filter to keep only standardized columns + others (optional, maybe keep all?)
    # For now, let's keep all but ensure the standard ones are present
    
    return df_standardized, column_mapping

def validate_standardized_data(df: pd.DataFrame) -> list[str]:
    """
    Checks if the dataframe has the minimum required columns.
    """
    missing = []
    for col in UnifiedTransaction.REQUIRED_COLUMNS:
        if col not in df.columns:
            missing.append(col)
    return missing
