from flask import Flask, request, Response
from flask_cors import CORS, cross_origin
from datetime import datetime, timedelta
from multiprocessing import Process
import ftplib
import pandas as pd
import data
import time
import re
import glob
import shutil
import os

app = Flask(__name__)
cors = CORS(app)


@app.route('/data')
@cross_origin()
def get_data():
    """calculates data based on birthdate,region and returns absolute values in following order:
        lived_days, heat_days(tre200dx), clear_days(nto002d0), snow_days(hns000d0), rain_days(rre150d0), mean_temp(tre200d0)"""
    region = request.args.get('region')
    birthdate_input_sring = request.args.get('birthdate')[:10]
    date_format = '%Y-%m-%d'
    birthdate = datetime.strptime(
        birthdate_input_sring, date_format) + timedelta(1)
    res = getattr(data, f'clean_data_{region}')(birthdate)
    return res


@app.route('/downloadftp')
@cross_origin()
def get_all_ftp_data():
    """creates a daemon thread for downloading all relevant data while the response it sent directly after starting the background thread."""
    daemon_process = Process(
        target=download_data_multiprocessing,
        daemon=True
    )
    daemon_process.start()
    return Response(status=200)


def download_data_multiprocessing():
    """triggers download relevant data from meteo ftp server"""
    start = time.time()

    # connect to sever
    FTP_HOST = "sl140.web.hostpoint.ch"
    FTP_USER = "missionerde@sys.verkehrshaus.info"
    FTP_PASS = "QMZKPoc2"
    ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS)

    currentdate_without_year = datetime.today().strftime('%m%d')
    yesterdays_date = (datetime.now() - timedelta(days=1)).strftime('%Y%m%d')

    # download all relevant data:
    # -> all files with todays month and day incl. past years since 2020
    # -> yesterdays data (in case todays data are not available yet)
    pattern_today = re.compile(
        rf"^VQAA09.LSSW.20[0-9][0-9]{currentdate_without_year}0450.*$")
    pattern_yesterday = re.compile(
        rf"^VQAA09.LSSW.{yesterdays_date}0450.*$")

    current_dict = os.getcwd()
    os.chdir("../data/livedata")
    for f in ftp.nlst():
        if pattern_today.match(f) or pattern_yesterday.match(f):
            fhandle = open(f, 'wb')
            ftp.retrbinary('RETR ' + f, fhandle.write)
    os.chdir(current_dict)

    ftp.quit()
    end = time.time()
    print("Used time for download data:", end - start, "sec")


if __name__ == "__main__":
    app.run()
