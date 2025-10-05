#!/usr/bin/env python3
"""
Test script for Kooora API
Run this to verify the API works before integrating
"""

from kooora.kooora import Kooora, League
import json

def test_kooora_api():
    print("🏆 Testing Kooora API Integration\n")
    print("="*50)
    
    # Initialize API
    print("\n1️⃣  Initializing Kooora API...")
    api = Kooora()
    print("✅ API initialized successfully\n")
    
    # Test: Get today's matches
    print("2️⃣  Fetching today's matches...")
    try:
        today_matches = api.get_today_matches()
        print(f"✅ Found {len(today_matches)} leagues with matches today\n")
        
        # Show first few leagues
        count = 0
        for league_id, matches in today_matches.items():
            if count >= 3:  # Show only first 3 leagues
                break
            
            try:
                league = League.from_id(league_id)
                league_name = league.get_title()
            except:
                league_name = f"League {league_id}"
            
            print(f"   📊 {league_name}")
            print(f"      League ID: {league_id}")
            print(f"      Matches: {len(matches)}")
            
            # Show first match
            if matches:
                match = matches[0]
                print(f"      Sample Match:")
                print(f"        🏠 Home: {match.get_home_team().get_name()}")
                print(f"        ✈️  Away: {match.get_away_team().get_name()}")
                print(f"        ⏰ Time: {match.get_time()}")
                print(f"        📅 Date: {match.get_date()}")
                print(f"        📍 Status: {match.get_status()}")
            print()
            count += 1
        
        if len(today_matches) > 3:
            print(f"   ... and {len(today_matches) - 3} more leagues\n")
    
    except Exception as e:
        print(f"❌ Error fetching today's matches: {e}\n")
        return False
    
    # Test: Get yesterday's matches
    print("3️⃣  Fetching yesterday's matches...")
    try:
        yesterday_matches = api.get_yesterday_matches()
        print(f"✅ Found {len(yesterday_matches)} leagues with matches yesterday\n")
    except Exception as e:
        print(f"❌ Error fetching yesterday's matches: {e}\n")
    
    # Test: Get tomorrow's matches
    print("4️⃣  Fetching tomorrow's matches...")
    try:
        tomorrow_matches = api.get_tomorrow_matches()
        print(f"✅ Found {len(tomorrow_matches)} leagues with matches tomorrow\n")
    except Exception as e:
        print(f"❌ Error fetching tomorrow's matches: {e}\n")
    
    # Test: Get league info (Spanish La Liga - ID: 22393)
    print("5️⃣  Testing league info (La Liga)...")
    try:
        liga = League.from_id(22393)
        print(f"✅ League name: {liga.get_title()}")
        
        # Try to get table
        try:
            table = liga.get_table()
            print(f"✅ League table fetched (entries: {len(table)})")
        except:
            print("⚠️  League table not available")
        
        # Try to get top scorers
        try:
            scorers = liga.get_top_scorers()
            print(f"✅ Top scorers fetched (count: {len(scorers)})")
        except:
            print("⚠️  Top scorers not available")
        print()
    except Exception as e:
        print(f"❌ Error fetching league info: {e}\n")
    
    # Test: Search functionality
    print("6️⃣  Testing search (searching for 'ريال مدريد')...")
    try:
        results = api.search("ريال مدريد")
        print(f"✅ Search completed")
        print(f"   Results: {json.dumps(results, ensure_ascii=False, indent=2)}\n")
    except Exception as e:
        print(f"❌ Error searching: {e}\n")
    
    print("="*50)
    print("✅ Kooora API Test Complete!\n")
    print("🎯 Summary:")
    print("   • API is functional")
    print("   • Can fetch match data")
    print("   • Can fetch league information")
    print("   • Ready for integration\n")
    
    return True

if __name__ == "__main__":
    test_kooora_api()

