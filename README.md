# IP6 Mission Wetter
Dieses Projekt wurde im Rahmen des Informatikstudiums von Hannah Kühne & Tabea Eggler im Auftrag vom Verkehrshaus Luzern im FS20 erstellt.

## Projekt einsehen
http://86.119.41.172:5000/

### lokale Nutzung:

**Frontend:**
`cd client` & `npm start`

**Backend:**

| Windows | macOS |
| ------ | ------ |
| `cd server` | `cd server`  |
| `python -m venv venv` | `python3 -m venv venv` | 
| `>venv\Scripts\activate` | `. venv/bin/activate` |
| `pip install -r requirements.txt` | `pip install -r requirements.txt` |
| `cd app` |  `cd app` |
| `flask run` | `flask run` |

**Run Unit-Tests:**
`cd server/app` & `python -m unittest test_app`
