"""
LiveSoccer API Client
Based on: https://github.com/im-parsa/LiveSoccer
"""

import requests
from typing import List, Dict, Optional
from datetime import datetime

class LiveSoccer:
    """Client for LiveSoccer API - Free live football scores"""
    
    BASE_URL = "https://livescore-api.com/api-client"
    
    def __init__(self):
        """Initialize LiveSoccer client"""
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def get_live_scores(self) -> List[Dict]:
        """Get all live scores"""
        try:
            url = f"{self.BASE_URL}/scores/live.json"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get('success') and data.get('data'):
                return data['data'].get('match', [])
            return []
        except Exception as e:
            print(f"Error fetching live scores: {e}")
            return []
    
    def get_fixtures(self, date: Optional[str] = None) -> List[Dict]:
        """Get fixtures for a specific date (format: DD.MM.YYYY)"""
        try:
            if not date:
                date = datetime.now().strftime("%d.%m.%Y")
            
            url = f"{self.BASE_URL}/scores/history.json?date={date}"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get('success') and data.get('data'):
                return data['data'].get('match', [])
            return []
        except Exception as e:
            print(f"Error fetching fixtures: {e}")
            return []
    
    def get_leagues(self) -> List[Dict]:
        """Get all available leagues"""
        try:
            url = f"{self.BASE_URL}/competitions/list.json"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get('success') and data.get('data'):
                return data['data'].get('competition', [])
            return []
        except Exception as e:
            print(f"Error fetching leagues: {e}")
            return []
    
    def get_league_matches(self, league_id: int) -> List[Dict]:
        """Get matches for a specific league"""
        try:
            url = f"{self.BASE_URL}/scores/live.json?competition_id={league_id}"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get('success') and data.get('data'):
                return data['data'].get('match', [])
            return []
        except Exception as e:
            print(f"Error fetching league matches: {e}")
            return []
    
    def get_match_details(self, match_id: int) -> Optional[Dict]:
        """Get detailed information about a specific match"""
        try:
            url = f"{self.BASE_URL}/match/data.json?match_id={match_id}"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get('success') and data.get('data'):
                return data['data']
            return None
        except Exception as e:
            print(f"Error fetching match details: {e}")
            return None
    
    def search_team(self, query: str) -> List[Dict]:
        """Search for teams"""
        try:
            url = f"{self.BASE_URL}/teams/search.json?name={query}"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get('success') and data.get('data'):
                return data['data'].get('team', [])
            return []
        except Exception as e:
            print(f"Error searching teams: {e}")
            return []

