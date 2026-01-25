
import os
import google.generativeai as genai
import json
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("Warning: GEMINI_API_KEY not found in environment variables.")
            self.model = None
        else:
            genai.configure(api_key=api_key)
            # gemini-2.0-flash hit quota limits (429).
            # Switching to 'gemini-flash-latest' (alias for stable 1.5-flash) for better quotas.
            self.model = genai.GenerativeModel('gemini-flash-latest')

    def generate_insights(self, analysis_data: dict) -> dict:
        """
        Generates AI-powered insights from the analysis data.
        Returns a dictionary with 'summary', 'key_findings', and 'recommendations'.
        """
        if not self.model:
            return {
                "summary": "AI Insights unavailable (API Key missing).",
                "key_findings": [],
                "recommendations": []
            }

        try:
            prompt = self._construct_prompt(analysis_data)
            
            response = self.model.generate_content(prompt)
            return self._parse_response(response.text)

        except Exception as e:
            print(f"Error generating AI insights: {e}")
            return {
                "summary": "Error analyzing data with AI.",
                "key_findings": [f"Error Details: {str(e)}"],
                "recommendations": ["Check server logs for details."]
            }

    def _construct_prompt(self, data: dict) -> str:
        """
        Helper to build the text prompt for Gemini.
        """
        benford = data.get("benford_analysis", {})
        summary = data.get("spending_summary", {})
        
        prompt = f"""
        You are an expert Financial Forensic Auditor. Analyze the following summary of a financial dataset and provide a risk assessment.
        
        DATA SUMMARY:
        - Total Transactions: {summary.get('transaction_count', 'N/A')}
        - Total Volume: ${summary.get('total_volume', 'N/A')}
        - Date Range: {summary.get('date_range', {}).get('start', 'N/A')} to {summary.get('date_range', {}).get('end', 'N/A')}
        
        BENFORD'S LAW ANALYSIS:
        - Verdict: {benford.get('verdict', 'N/A')}
        - MAD Score: {benford.get('mad_score', 'N/A')} (Lower is better, >0.015 is suspicious)
        
        TASK:
        Provide a JSON response with the following structure (do NOT use Markdown formatting, just raw JSON):
        {{
            "summary": "2-3 sentences summarizing the overall financial health and integrity based on the data.",
            "key_findings": ["Bulleted finding 1", "Bulleted finding 2", "Bulleted finding 3"],
            "recommendations": ["Actionable recommendation 1", "Actionable recommendation 2"]
        }}
        
        If the Benford Verdict is 'Fail' or 'Suspicious', highlight this as a potential fraud indicator in the summary.
        Keep the tone professional, objective, and concise.
        """
        return prompt

    def _parse_response(self, text: str) -> dict:
        """
        Helper to parse Gemini's response. Handles potential Markdown wrapping.
        """
        try:
            # Clean markdown code blocks if present
            clean_text = text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.startswith("```"):
                clean_text = clean_text[3:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
                
            return json.loads(clean_text)
        except json.JSONDecodeError:
            # Fallback if model didn't return valid JSON
            return {
                "summary": text[:250] + "...",
                "key_findings": ["Could not parse AI response structured data."],
                "recommendations": ["Review full logs."]
            }

ai_service = AIService()
