# Kooora Sports API Service

Flask-based API service that wraps the Kooora unofficial API to provide real sports data from kooora.com (Arabic sports website).

## Features

- Real-time match data from kooora.com
- Today's, yesterday's, and tomorrow's matches
- League information (tables, top scorers)
- Match details and stats
- Search functionality
- Arabic sports content

## Installation

```bash
cd kooora-service
pip install -r requirements.txt
```

## Running

```bash
python app.py
```

Server will start on: http://localhost:5000

## API Endpoints

### Health Check
```
GET /health
```

### Matches

**Get Today's Matches**
```
GET /api/matches/today
```
Returns all matches being played today across all leagues.

**Get Yesterday's Matches**
```
GET /api/matches/yesterday
```

**Get Tomorrow's Matches**
```
GET /api/matches/tomorrow
```

**Get Match Details**
```
GET /api/match/<match_id>
```

### Leagues

**Get Active Leagues**
```
GET /api/leagues/active
```
Returns leagues that have matches today.

**Get League Info**
```
GET /api/league/<league_id>
```
Returns league table and top scorers.

**Get League Matches**
```
GET /api/league/<league_id>/matches
```
Returns today's matches for a specific league.

### Search

**Search**
```
GET /api/search?q=<query>
```
Search for leagues, teams, or players.

## Example Response

### Today's Matches
```json
{
  "success": true,
  "data": [
    {
      "id": "123456",
      "league_id": "22393",
      "league_name": "الدوري الإسباني",
      "home_team": "ريال مدريد",
      "away_team": "برشلونة",
      "time": "20:00",
      "date": "2025-10-01",
      "status": "live",
      "is_live": true
    }
  ],
  "count": 1
}
```

## Integration with Frontend

Update your frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=http://localhost:3001
NEXT_PUBLIC_KOOORA_API=http://localhost:5000
```

## Data Source

This service uses the [kooora-unofficial-api](https://github.com/n-eq/kooora-unofficial-api) Python library to fetch real sports data from kooora.com, one of the most popular Arabic sports websites.

## Limitations

- Data is scraped from kooora.com, so availability depends on the website
- No live video streams (only match information)
- Rate limiting may apply
- Some features are limited by the Kooora API capabilities

## Notes

- All team names and league names are in Arabic
- Match times are in the source timezone
- Live match detection is based on match status

