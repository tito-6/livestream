from flask import Flask, jsonify, request
from flask_cors import CORS
from livesoccer import LiveSoccer
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Initialize LiveSoccer API
livesoccer = LiveSoccer()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'service': 'livesoccer-service',
        'status': 'healthy'
    })

@app.route('/api/live', methods=['GET'])
def get_live_scores():
    """Get all live football scores"""
    try:
        matches = livesoccer.get_live_scores()
        
        formatted_matches = []
        for match in matches:
            formatted_match = {
                'id': match.get('id'),
                'home_team': match.get('home', {}).get('name', 'Unknown'),
                'away_team': match.get('away', {}).get('name', 'Unknown'),
                'home_score': match.get('home', {}).get('goals', 0),
                'away_score': match.get('away', {}).get('goals', 0),
                'status': match.get('status', 'unknown'),
                'time': match.get('time', ''),
                'league': match.get('competition', {}).get('name', 'Unknown'),
                'league_id': match.get('competition', {}).get('id'),
                'is_live': match.get('status') == 'inprogress',
            }
            formatted_matches.append(formatted_match)
        
        return jsonify({
            'success': True,
            'data': formatted_matches,
            'count': len(formatted_matches),
            'source': 'LiveSoccer API'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/fixtures', methods=['GET'])
def get_fixtures():
    """Get fixtures for a specific date"""
    try:
        date = request.args.get('date')  # Format: DD.MM.YYYY
        matches = livesoccer.get_fixtures(date)
        
        formatted_matches = []
        for match in matches:
            formatted_match = {
                'id': match.get('id'),
                'home_team': match.get('home', {}).get('name', 'Unknown'),
                'away_team': match.get('away', {}).get('name', 'Unknown'),
                'home_score': match.get('home', {}).get('goals'),
                'away_score': match.get('away', {}).get('goals'),
                'status': match.get('status', 'unknown'),
                'time': match.get('time', ''),
                'date': match.get('date', ''),
                'league': match.get('competition', {}).get('name', 'Unknown'),
                'league_id': match.get('competition', {}).get('id'),
            }
            formatted_matches.append(formatted_match)
        
        return jsonify({
            'success': True,
            'data': formatted_matches,
            'count': len(formatted_matches),
            'date': date or datetime.now().strftime("%d.%m.%Y"),
            'source': 'LiveSoccer API'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/leagues', methods=['GET'])
def get_leagues():
    """Get all available leagues"""
    try:
        leagues = livesoccer.get_leagues()
        
        formatted_leagues = []
        for league in leagues:
            formatted_league = {
                'id': league.get('id'),
                'name': league.get('name'),
                'country': league.get('location', {}).get('name'),
                'logo': league.get('logo', ''),
            }
            formatted_leagues.append(formatted_league)
        
        return jsonify({
            'success': True,
            'data': formatted_leagues,
            'count': len(formatted_leagues),
            'source': 'LiveSoccer API'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/league/<league_id>/matches', methods=['GET'])
def get_league_matches(league_id):
    """Get live matches for a specific league"""
    try:
        matches = livesoccer.get_league_matches(int(league_id))
        
        formatted_matches = []
        for match in matches:
            formatted_match = {
                'id': match.get('id'),
                'home_team': match.get('home', {}).get('name', 'Unknown'),
                'away_team': match.get('away', {}).get('name', 'Unknown'),
                'home_score': match.get('home', {}).get('goals', 0),
                'away_score': match.get('away', {}).get('goals', 0),
                'status': match.get('status', 'unknown'),
                'time': match.get('time', ''),
                'is_live': match.get('status') == 'inprogress',
            }
            formatted_matches.append(formatted_match)
        
        return jsonify({
            'success': True,
            'data': formatted_matches,
            'count': len(formatted_matches),
            'league_id': league_id,
            'source': 'LiveSoccer API'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/match/<match_id>', methods=['GET'])
def get_match_details(match_id):
    """Get detailed information about a specific match"""
    try:
        match = livesoccer.get_match_details(int(match_id))
        
        if match:
            return jsonify({
                'success': True,
                'data': match,
                'source': 'LiveSoccer API'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Match not found'
            }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/search/team', methods=['GET'])
def search_team():
    """Search for teams"""
    try:
        query = request.args.get('q', '')
        
        if not query:
            return jsonify({
                'success': False,
                'error': 'Search query required'
            }), 400
        
        teams = livesoccer.search_team(query)
        
        return jsonify({
            'success': True,
            'data': teams,
            'count': len(teams),
            'query': query,
            'source': 'LiveSoccer API'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("⚽ LiveSoccer API Service Starting...")
    print("📡 Available endpoints:")
    print("  GET  /health")
    print("  GET  /api/live                        - Live scores")
    print("  GET  /api/fixtures?date=DD.MM.YYYY    - Fixtures")
    print("  GET  /api/leagues                     - All leagues")
    print("  GET  /api/league/<id>/matches         - League matches")
    print("  GET  /api/match/<id>                  - Match details")
    print("  GET  /api/search/team?q=<query>       - Search teams")
    print("\n✅ Server ready on http://localhost:5001")
    
    app.run(host='0.0.0.0', port=5001, debug=True)

