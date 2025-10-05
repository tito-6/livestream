from flask import Flask, jsonify, request
from flask_cors import CORS
from kooora.kooora import Kooora, League
import datetime

app = Flask(__name__)
CORS(app)

# Initialize Kooora API
api = Kooora()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'service': 'kooora-service',
        'status': 'healthy'
    })

@app.route('/api/matches/today', methods=['GET'])
def get_today_matches():
    """Get all matches being played today"""
    try:
        today_matches = api.get_today_matches()
        
        matches_list = []
        for league_id, matches in today_matches.items():
            try:
                league = League.from_id(league_id)
                league_name = league.get_title()
            except:
                league_name = f"League {league_id}"
            
            for match in matches:
                match_data = {
                    'id': str(match.get_id()),
                    'league_id': str(league_id),
                    'league_name': league_name,
                    'home_team': match.get_home_team().get_name(),
                    'away_team': match.get_away_team().get_name(),
                    'home_team_id': match.get_home_team().get_id(),
                    'away_team_id': match.get_away_team().get_id(),
                    'time': match.get_time(),
                    'date': match.get_date(),
                    'status': match.get_status(),
                    'is_live': match.get_status() == 'live',
                }
                matches_list.append(match_data)
        
        return jsonify({
            'success': True,
            'data': matches_list,
            'count': len(matches_list)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/matches/yesterday', methods=['GET'])
def get_yesterday_matches():
    """Get yesterday's matches"""
    try:
        yesterday_matches = api.get_yesterday_matches()
        
        matches_list = []
        for league_id, matches in yesterday_matches.items():
            try:
                league = League.from_id(league_id)
                league_name = league.get_title()
            except:
                league_name = f"League {league_id}"
            
            for match in matches:
                match_data = {
                    'id': str(match.get_id()),
                    'league_id': str(league_id),
                    'league_name': league_name,
                    'home_team': match.get_home_team().get_name(),
                    'away_team': match.get_away_team().get_name(),
                    'home_score': match.get_home_score(),
                    'away_score': match.get_away_score(),
                    'time': match.get_time(),
                    'date': match.get_date(),
                    'status': match.get_status(),
                }
                matches_list.append(match_data)
        
        return jsonify({
            'success': True,
            'data': matches_list,
            'count': len(matches_list)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/matches/tomorrow', methods=['GET'])
def get_tomorrow_matches():
    """Get tomorrow's matches"""
    try:
        tomorrow_matches = api.get_tomorrow_matches()
        
        matches_list = []
        for league_id, matches in tomorrow_matches.items():
            try:
                league = League.from_id(league_id)
                league_name = league.get_title()
            except:
                league_name = f"League {league_id}"
            
            for match in matches:
                match_data = {
                    'id': str(match.get_id()),
                    'league_id': str(league_id),
                    'league_name': league_name,
                    'home_team': match.get_home_team().get_name(),
                    'away_team': match.get_away_team().get_name(),
                    'home_team_id': match.get_home_team().get_id(),
                    'away_team_id': match.get_away_team().get_id(),
                    'time': match.get_time(),
                    'date': match.get_date(),
                    'status': match.get_status(),
                }
                matches_list.append(match_data)
        
        return jsonify({
            'success': True,
            'data': matches_list,
            'count': len(matches_list)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/match/<match_id>', methods=['GET'])
def get_match_info(match_id):
    """Get detailed information about a specific match"""
    try:
        # Note: Kooora API doesn't have direct match fetch by ID
        # We'll need to search through today's matches
        today_matches = api.get_today_matches()
        
        for league_id, matches in today_matches.items():
            for match in matches:
                if str(match.get_id()) == match_id:
                    match_data = {
                        'id': str(match.get_id()),
                        'league_id': str(league_id),
                        'home_team': match.get_home_team().get_name(),
                        'away_team': match.get_away_team().get_name(),
                        'home_score': match.get_home_score(),
                        'away_score': match.get_away_score(),
                        'time': match.get_time(),
                        'date': match.get_date(),
                        'status': match.get_status(),
                        'is_live': match.get_status() == 'live',
                    }
                    
                    # Try to get stats if match is played
                    try:
                        stats = match.get_stats()
                        match_data['stats'] = stats
                    except:
                        match_data['stats'] = None
                    
                    return jsonify({
                        'success': True,
                        'data': match_data
                    })
        
        return jsonify({
            'success': False,
            'error': 'Match not found'
        }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/league/<league_id>', methods=['GET'])
def get_league_info(league_id):
    """Get league information including table and top scorers"""
    try:
        league = League.from_id(int(league_id))
        
        league_data = {
            'id': league_id,
            'name': league.get_title(),
        }
        
        # Get league table
        try:
            table = league.get_table()
            league_data['table'] = table
        except:
            league_data['table'] = None
        
        # Get top scorers
        try:
            scorers = league.get_top_scorers()
            league_data['top_scorers'] = scorers
        except:
            league_data['top_scorers'] = None
        
        return jsonify({
            'success': True,
            'data': league_data
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/league/<league_id>/matches', methods=['GET'])
def get_league_matches(league_id):
    """Get all matches for a specific league today"""
    try:
        today_matches = api.get_today_matches()
        
        if int(league_id) in today_matches:
            matches = today_matches[int(league_id)]
            
            matches_list = []
            for match in matches:
                match_data = {
                    'id': str(match.get_id()),
                    'home_team': match.get_home_team().get_name(),
                    'away_team': match.get_away_team().get_name(),
                    'home_score': match.get_home_score(),
                    'away_score': match.get_away_score(),
                    'time': match.get_time(),
                    'date': match.get_date(),
                    'status': match.get_status(),
                    'is_live': match.get_status() == 'live',
                }
                matches_list.append(match_data)
            
            return jsonify({
                'success': True,
                'data': matches_list,
                'count': len(matches_list)
            })
        else:
            return jsonify({
                'success': True,
                'data': [],
                'count': 0,
                'message': 'No matches today for this league'
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/search', methods=['GET'])
def search():
    """Search for leagues, teams, or players"""
    try:
        query = request.args.get('q', '')
        
        if not query:
            return jsonify({
                'success': False,
                'error': 'Search query required'
            }), 400
        
        results = api.search(query)
        
        return jsonify({
            'success': True,
            'data': results,
            'query': query
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/team/<team_id>', methods=['GET'])
def get_team_info(team_id):
    """Get team information"""
    try:
        # Note: Kooora API team fetching is limited
        # This is a placeholder for when team data is available
        return jsonify({
            'success': False,
            'error': 'Team info endpoint not fully implemented in Kooora API'
        }), 501
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/leagues/active', methods=['GET'])
def get_active_leagues():
    """Get list of active leagues (leagues with matches today)"""
    try:
        today_matches = api.get_today_matches()
        
        leagues = []
        for league_id in today_matches.keys():
            try:
                league = League.from_id(league_id)
                league_data = {
                    'id': str(league_id),
                    'name': league.get_title(),
                    'match_count': len(today_matches[league_id])
                }
                leagues.append(league_data)
            except:
                continue
        
        return jsonify({
            'success': True,
            'data': leagues,
            'count': len(leagues)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("🏆 Kooora Sports API Service Starting...")
    print("📡 Available endpoints:")
    print("  GET  /health")
    print("  GET  /api/matches/today")
    print("  GET  /api/matches/yesterday")
    print("  GET  /api/matches/tomorrow")
    print("  GET  /api/match/<match_id>")
    print("  GET  /api/league/<league_id>")
    print("  GET  /api/league/<league_id>/matches")
    print("  GET  /api/leagues/active")
    print("  GET  /api/search?q=<query>")
    print("\n✅ Server ready on http://localhost:5000")
    
    app.run(host='0.0.0.0', port=5000, debug=True)

