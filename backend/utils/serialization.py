import numpy as np
import pandas as pd

def make_serializable(obj):
    """
    Recursively converts NumPy/Pandas types to native Python types for JSON/Firestore serialization.
    """
    if isinstance(obj, dict):
        return {str(k): make_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [make_serializable(v) for v in obj]
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        # Handle NaN - convert to None for JSON/Firestore compatibility
        if np.isnan(obj):
            return None
        return float(obj)
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, np.ndarray):
        return make_serializable(obj.tolist())
    elif isinstance(obj, pd.Timestamp):
        return obj.isoformat()
    elif pd.isna(obj): # Handles pd.NA, np.nan, pd.NaT
        return None
    else:
        return obj
