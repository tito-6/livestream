# 🏆 Kooora API Integration Guide

## Overview

We've integrated the [Kooora Unofficial API](https://github.com/n-eq/kooora-unofficial-api) to fetch **REAL sports data** from kooora.com, one of the most popular Arabic sports websites.

---

## ⚡ Quick Start

### Test the Kooora API First

**Double-click:** `TEST_KOOORA_API.bat`

This will:
1. Install the Kooora Python library
2. Run tests to verify the API works
3. Show you sample data from kooora.com

### Run Full Platform with Real Data

**Double-click:** `RUN_WITH_KOOORA.bat`

This will:
1. Start Kooora API Service (Python Flask on port 5000)
2. Start Frontend (Next.js on port 3000)
3. Connect them together

---

## 🎯 What You Get

### Real Sports Data:
- ✅ **Today's Matches** - Live and upcoming matches
- ✅ **Yesterday's Results** - Match scores and stats
- ✅ **Tomorrow's Schedule** - Upcoming fixtures
- ✅ **League Tables** - Current standings
- ✅ **Top Scorers** - Goal scorers list
- ✅ **Team Information** - Team details
- ✅ **Search** - Find teams, leagues, players

### Arabic Content:
- All team names in Arabic
- League names in Arabic
- Authentic Middle Eastern sports coverage

---

## 📡 API Service

### Kooora Service (Port 5000)

A Python Flask API that wraps the Kooora library and provides RESTful endpoints.

**Endpoints:**

```
Health Check:
GET http://localhost:5000/health

Today's Matches:
GET http://localhost:5000/api/matches/today

Yesterday's Matches:
GET http://localhost:5000/api/matches/yesterday

Tomorrow's Matches:
GET http://localhost:5000/api/matches/tomorrow

Match Details:
GET http://localhost:5000/api/match/<match_id>

League Info:
GET http://localhost:5000/api/league/<league_id>

League Matches:
GET http://localhost:5000/api/league/<league_id>/matches

Active Leagues:
GET http://localhost:5000/api/leagues/active

Search:
GET http://localhost:5000/api/search?q=<query>
```

### Example Response (Today's Matches):

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
      "home_score": null,
      "away_score": null,
      "time": "20:00",
      "date": "2025-10-01",
      "status": "scheduled",
      "is_live": false
    }
  ],
  "count": 1
}
```

---

## 🔗 Frontend Integration

Update `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=http://localhost:3001
NEXT_PUBLIC_KOOORA_API=http://localhost:5000
```

### Fetch Real Data in Frontend:

```typescript
// Fetch today's matches
const response = await fetch('http://localhost:5000/api/matches/today');
const data = await response.json();

// Use the real data
const matches = data.data;
```

---

## 🧪 Testing

### Manual Test (Command Line):

```bash
# Install dependencies
cd kooora-service
pip install -r requirements.txt

# Run test script
python test_api.py
```

### Test via Browser:

1. Start the Kooora service:
   ```bash
   cd kooora-service
   python app.py
   ```

2. Open browser:
   ```
   http://localhost:5000/api/matches/today
   ```

---

## 📊 Sample Data Structure

### Match Object:
```python
{
    'id': '123456',
    'league_id': '22393',
    'league_name': 'الدوري الإسباني',
    'home_team': 'ريال مدريد',
    'away_team': 'برشلونة',
    'home_team_id': '456',
    'away_team_id': '789',
    'home_score': 2,      # null if not started
    'away_score': 1,      # null if not started
    'time': '20:00',
    'date': '2025-10-01',
    'status': 'live',     # 'scheduled', 'live', 'finished'
    'is_live': True
}
```

### League Object:
```python
{
    'id': '22393',
    'name': 'الدوري الإسباني',
    'table': [...],       # League standings
    'top_scorers': [...]  # Goal scorers
}
```

---

## 🎯 Use Cases

### 1. Live Matches Page
```typescript
// Fetch and display live matches
const fetchLiveMatches = async () => {
  const res = await fetch('http://localhost:5000/api/matches/today');
  const data = await res.json();
  
  const liveMatches = data.data.filter(m => m.is_live);
  setMatches(liveMatches);
};
```

### 2. Schedule Page
```typescript
// Fetch tomorrow's fixtures
const fetchSchedule = async () => {
  const res = await fetch('http://localhost:5000/api/matches/tomorrow');
  const data = await res.json();
  setSchedule(data.data);
};
```

### 3. League Page
```typescript
// Fetch league table
const fetchLeagueTable = async (leagueId) => {
  const res = await fetch(`http://localhost:5000/api/league/${leagueId}`);
  const data = await res.json();
  setTable(data.data.table);
  setScorers(data.data.top_scorers);
};
```

---

## 🔧 Configuration

### Kooora Service (kooora-service/app.py)

The service runs on port 5000 by default. To change:

```python
app.run(host='0.0.0.0', port=5000, debug=True)  # Change port here
```

### CORS Settings

The service allows all origins by default:

```python
CORS(app)  # Allows all origins
```

For production, restrict to your domain:

```python
CORS(app, origins=['https://yourdomain.com'])
```

---

## 🚨 Important Notes

### Data Source:
- Data is scraped from **kooora.com**
- Availability depends on the website being accessible
- Data is in **Arabic** by default

### Limitations:
- ❌ **No video streams** - Only match information
- ❌ **No live scores updates** - Need to refresh
- ⚠️ **Rate limiting** - Don't spam requests
- ⚠️ **Scraping-based** - May break if kooora.com changes structure

### Best Practices:
- ✅ Cache responses for 1-2 minutes
- ✅ Handle errors gracefully
- ✅ Show loading states
- ✅ Provide fallback mock data

---

## 📦 Dependencies

### Python (kooora-service):
```
kooora==1.2.0
flask==3.0.0
flask-cors==4.0.0
python-dotenv==1.0.0
requests==2.31.0
```

### Installation:
```bash
pip install -r requirements.txt
```

---

## 🎨 Integration Example

### Replace Mock Data with Real Data:

**Before (Mock):**
```typescript
const mockMatches = [
  { title: 'Al-Hilal vs Al-Nassr', viewers: 85000 }
];
```

**After (Real):**
```typescript
useEffect(() => {
  fetch('http://localhost:5000/api/matches/today')
    .then(res => res.json())
    .then(data => {
      const realMatches = data.data.map(match => ({
        id: match.id,
        title: `${match.home_team} vs ${match.away_team}`,
        league: match.league_name,
        time: match.time,
        isLive: match.is_live,
      }));
      setMatches(realMatches);
    });
}, []);
```

---

## 🔥 Popular Leagues

Common league IDs you can use:

```
22393 - الدوري الإسباني (La Liga)
22492 - الدوري الإنجليزي (Premier League)
22495 - دوري أبطال أوروبا (Champions League)
22496 - الدوري الإيطالي (Serie A)
22497 - الدوري الألماني (Bundesliga)
22498 - الدوري الفرنسي (Ligue 1)
```

---

## ✅ Testing Checklist

- [ ] Install Python 3.7+
- [ ] Run `TEST_KOOORA_API.bat`
- [ ] Verify test script shows today's matches
- [ ] Start Kooora service with `python app.py`
- [ ] Test endpoint: http://localhost:5000/health
- [ ] Test endpoint: http://localhost:5000/api/matches/today
- [ ] Integrate with frontend
- [ ] Replace mock data with real API calls

---

## 🚀 Ready to Use!

1. **Test the API**: Run `TEST_KOOORA_API.bat`
2. **Start Platform**: Run `RUN_WITH_KOOORA.bat`
3. **View Real Data**: Open http://localhost:3000

**You now have REAL sports data from kooora.com! 🏆⚽**

---

## 📖 Resources

- [Kooora Unofficial API GitHub](https://github.com/n-eq/kooora-unofficial-api)
- [Kooora.com Website](https://www.kooora.com)
- [Flask Documentation](https://flask.palletsprojects.com/)

---

**Last Updated**: 2025
**Integration Status**: ✅ Ready

