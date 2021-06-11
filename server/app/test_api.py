from api import app
import unittest
import pathlib
from datetime import datetime, timedelta
import glob

# Start tests: cd server/app, python -m unittest test_api (in venv)


class TestAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_404(self):
        rv = self.app.get('/other')
        self.assertEqual(rv.status, '404 NOT FOUND')

    # test endpoint: /downloadfdp
    def test_get_downloadftp_today(self):
        currentdate = datetime.today().strftime('%Y%m%d')
        filename = glob.glob(f'VQAA09.LSSW.{currentdate}0450.*')
        rv = self.app.get("/downloadftp")
        self.assertEqual(rv.status, '200 OK')
        path = pathlib.Path(filename[0])
        self.assertEqual(path.exists(), True)

    def test_get_downloadftp_yesterday(self):
        yesterdaydate = (datetime.now() - timedelta(days=1)).strftime('%Y%m%d')
        filename = glob.glob(f'VQAA09.LSSW.{yesterdaydate}0450.*')
        rv = self.app.get("/downloadftp")
        self.assertEqual(rv.status, '200 OK')
        path = pathlib.Path(filename[0])
        self.assertEqual(path.exists(), True)

    # test endpoint: /data, call different regions
    def test_get_data_genferseeregion(self):
        rv = self.app.get(
            "data?region=genferseeregion&birthdate=1940-12-31T23:00:00.000Z")
        assert rv.status == '200 OK'

    def test_get_data_zentralschweiz(self):
        rv = self.app.get(
            "data?region=zentralschweiz&birthdate=1940-12-31T23:00:00.000Z")
        assert rv.status == '200 OK'

    def test_get_data_ostschweiz(self):
        rv = self.app.get(
            "data?region=ostschweiz&birthdate=1940-12-31T23:00:00.000Z")
        assert rv.status == '200 OK'

    def test_get_data_ostschweiz_bergregion(self):
        rv = self.app.get(
            "data?region=ostschweiz_bergregion&birthdate=1940-12-31T23:00:00.000Z")
        assert rv.status == '200 OK'

    def test_get_data_mittelland(self):
        rv = self.app.get(
            "data?region=mittelland&birthdate=1940-12-31T23:00:00.000Z")
        assert rv.status == '200 OK'

    def test_get_data_zürich(self):
        rv = self.app.get(
            "data?region=zürich&birthdate=1940-12-31T23:00:00.000Z")
        assert rv.status == '200 OK'

    def test_get_data_nordwestschweiz(self):
        rv = self.app.get(
            "data?region=nordwestschweiz&birthdate=1940-12-31T23:00:00.000Z")
        assert rv.status == '200 OK'

    def test_get_data_tessin(self):
        rv = self.app.get(
            "data?region=tessin&birthdate=1940-12-31T23:00:00.000Z")
        assert rv.status == '200 OK'

    # test endpoint: /data, different birthdates
    def test_get_data_birthdat1(self):
        rv = self.app.get(
            "data?region=genferseeregion&birthdate=1994-01-02T23:00:00.000Z")
        assert rv.status == '200 OK'

    def test_get_data_birthdat2(self):
        rv = self.app.get(
            "data?region=genferseeregion&birthdate=2000-07-30T23:00:00.000Z")
        assert rv.status == '200 OK'

    def test_get_data_birthdat3(self):
        rv = self.app.get(
            "data?region=genferseeregion&birthdate=1960-11-29T23:00:00.000Z")
        assert rv.status == '200 OK'
