import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import glob


# *** Data source: Please consult the parameter description for more information: docs/data_specification_weather_app.pdf ***


def filter_data(df, birthdate):
    """filter dataframe based on birthdate and returns absolute values as an object in following order:
        lived_days, heat_days(tre200dx), clear_days(nto002d0), snow_days(hns000d0), rain_days(rre150d0), mean_temp(tre200d0)"""
    df = df.loc[(df['time'] >= birthdate)]
    lived_days = str((datetime.today() - birthdate).days)
    heat_days = (pd.to_numeric(df['tre200dx']) >= 30).sum()
    clear_days = (pd.to_numeric(df['nto002d0']) == 1).sum()
    snow_days = (pd.to_numeric(df['hns000d0']) > 1.0).sum()
    rain_days = (pd.to_numeric(df['rre150d0']) > 1.0).sum()
    mean_temp = round(pd.to_numeric(df['tre200d0']).mean(), 2)

    return {'lived_days': str(lived_days), 'heat_days': str(heat_days), 'clear_days': str(clear_days), 'snow_days': str(snow_days), 'rain_days': str(rain_days), 'mean_temp': str(mean_temp)}


def handle_missing_values(df):
    """replace nan/- values and prints sum of missing values"""
    # count and print nr of nan values
    count_tre200dx = ((df['tre200dx'] == '-').sum() +
                      (df['tre200dx'] == np.nan).sum())
    count_tre200d0 = ((df['tre200d0'] == '-').sum() +
                      (df['tre200d0'] == np.nan).sum())
    count_hns000d0 = ((df['hns000d0'] == '-').sum() +
                      (df['hns000d0'] == np.nan).sum())
    count_rre150d0 = ((df['rre150d0'] == '-').sum() +
                      (df['rre150d0'] == np.nan).sum())
    count_nto002d0 = ((df['nto002d0'] == '-').sum() +
                      (df['nto002d0'] == np.nan).sum())
    print(
        f'Sum missing values per attribute. count_tre200dx:{count_tre200dx}, count_tre200d0:{count_tre200d0}, count_hns000d0:{count_hns000d0}, count_rre150d0:{count_rre150d0}, count_nto002d0:{count_nto002d0}')

    # replace nan values (-)
    df = df.replace('-', np.nan)

    return df


def get_cleaned_livedata(station):
    """returns cleaned dataframe with livedata (from 01.01.2020) from a specific station"""
    currentdate = datetime.today().strftime('%Y%m%d')
    yesterdaydate = (datetime.now() - timedelta(days=1)).strftime('%Y%m%d')
    currentdate_without_year = datetime.today().strftime('%m%d')

    # from 2020 get every years' data from todays date (month and day)
    filenames = glob.glob(
        f'/deployment/data/livedata/VQAA09.LSSW.20[0-9][0-9]{currentdate_without_year}0450.*')

    # if todays data are not available yet -> get yesterdays data
    todays_data = glob.glob(
        f'/deployment/data/livedata/VQAA09.LSSW.{currentdate}0450.*')
    yesterdays_data = glob.glob(
        f'/deployment/data/livedata/VQAA09.LSSW.{yesterdaydate}0450.*')
    if len(todays_data) == 0 and len(yesterdays_data) > 0:
        filenames.append(yesterdays_data[0])

    # read all files and merge them together
    df_livedata = pd.DataFrame(
        columns=["Station/Location", "Date", "hns000d0", "rre150d0", "tre200d0", "tre200dx", "nto002d0"])

    for file in filenames:
        df_temp = pd.read_csv(
            f'{file}', sep=';', skiprows=2)
        df_livedata = pd.concat([df_temp, df_livedata]
                                ).drop_duplicates().reset_index(drop=True)

    # change string to datetime
    df_livedata['Date'] = pd.to_datetime(
        df_livedata['Date'], format='%Y%m%d', errors='coerce')
    df_livedata.sort_values(by=['Date'], inplace=True, ascending=False)

    # clean and filter df
    df_livedata = df_livedata.loc[(
        df_livedata['Station/Location'] == station)]
    df_livedata.rename(columns={'Date': 'time'}, inplace=True)
    df_livedata.rename(columns={'Station/Location': 'stn'}, inplace=True)
    df_livedata = df_livedata.loc[(
        df_livedata['time'] >= datetime(2020, 1, 1))]

    return df_livedata


def clean_data_genferseeregion(birthdate):
    """combines data from different stations and calculates data based on birthdate and region"""
    # combine data: 1939 - 1957
    df_geneve_observatoire = pd.read_csv('/deployment/data/genferseeregion/Geneve-Observatoire-1939-1957.txt',
                                         delim_whitespace=True, parse_dates=['time'])
    df_montreux = pd.read_csv('/deployment/data/genferseeregion/Montreux-Clarens-1939-1957.txt',
                              delim_whitespace=True, parse_dates=['time'])

    df = pd.merge(df_geneve_observatoire, df_montreux,
                  how='outer', on=['time'])
    df.drop(['stn_y', 'stn_x'], axis=1, inplace=True)

    # add data: 1958 - 2019
    df_geneve_cointrin = pd.read_csv('/deployment/data/genferseeregion/Geneve-Cointrin-1958-2019.txt',
                                     delim_whitespace=True, parse_dates=['time'])
    df_geneve_cointrin.drop('stn', axis=1, inplace=True)

    df = df.append(df_geneve_cointrin)

    # add live data: from 2020
    df_geneve_cointrin_livedata = get_cleaned_livedata('GVE')
    df = df.append(df_geneve_cointrin_livedata)

    # handle nan values
    df = handle_missing_values(df)

    # filter data for speicifc user (region and birtdate)
    filtered_result = filter_data(df, birthdate)

    return filtered_result


def clean_data_zentralschweiz(birthdate):
    """combines data from different stations and calculates data based on birthdate and region"""
    # combine data: 1939 - 2019
    df_altdorf = pd.read_csv('/deployment/data/zentralschweiz/Altdorf-1939-2019.txt',
                             delim_whitespace=True, parse_dates=['time'])
    df_luzern = pd.read_csv('/deployment/data/zentralschweiz/Luzern-1939-1958.txt',
                            delim_whitespace=True, parse_dates=['time'])

    df_altdorf['hns000d0'] = df_altdorf['hns000d0'].replace('-', np.nan)
    df = pd.merge(df_altdorf, df_luzern, how='outer', on=['time'])
    df['hns000d0'] = df['hns000d0_x'].fillna(df['hns000d0_y'])
    df.drop(['stn_y', 'stn_x', 'hns000d0_x', 'hns000d0_y'], axis=1, inplace=True)

    # add live data: from 2020
    df_altdorf_livedate = get_cleaned_livedata('ALT')
    df = df.append(df_altdorf_livedate)

    # handle nan values
    df = handle_missing_values(df)

    # filter data for speicifc user (region and birtdate)
    filtered_result = filter_data(df, birthdate)

    return filtered_result


def clean_data_ostschweiz(birthdate):
    """combines data from different stations and calculates data based on birthdate and region"""
    # combine data: 1939 - 2019
    df_chur = pd.read_csv('/deployment/data/ostschweiz/Chur-1939-2019.txt',
                          delim_whitespace=True, parse_dates=['time'])
    df_badragaz = pd.read_csv('/deployment/data/ostschweiz/Bad-Ragaz-1939-1957.txt',
                              delim_whitespace=True, parse_dates=['time'])

    df_chur['tre200dx'] = df_chur['tre200dx'].replace('-', np.nan)
    df = pd.merge(df_chur, df_badragaz, how='outer', on=['time'])
    df['tre200dx'] = df['tre200dx_x'].fillna(df['tre200dx_y'])
    df.drop(['stn_y', 'stn_x', 'tre200dx_x', 'tre200dx_y'], axis=1, inplace=True)

    # add live data: from 2020
    df_chur_livedate = get_cleaned_livedata('CHU')
    df = df.append(df_chur_livedate)

    # handle nan values
    df = handle_missing_values(df)

    # filter data for speicifc user (region and birtdate)
    filtered_result = filter_data(df, birthdate)

    return filtered_result


def clean_data_zürich(birthdate):
    """combines data from different stations and calculates data based on birthdate and region"""
    # combine data: 1939 - 2019
    df_zurich_fluntern = pd.read_csv('/deployment/data/zurich/Zurich-1939-2019.txt',
                                     delim_whitespace=True, parse_dates=['time'])
    df_zurich_kloten = pd.read_csv('/deployment/data/zurich/Zurich-Kloten-2016.txt',
                                   delim_whitespace=True, parse_dates=['time'])
    df_zurich_fluntern['hns000d0'] = df_zurich_fluntern['hns000d0'].replace(
        '-', np.nan)
    df_zurich_fluntern['nto002d0'] = df_zurich_fluntern['nto002d0'].replace(
        '-', np.nan)
    df = pd.merge(df_zurich_fluntern, df_zurich_kloten,
                  how='outer', on=['time'])
    df['hns000d0'] = df['hns000d0_x'].fillna(df['hns000d0_y'])
    df['nto002d0'] = df['nto002d0_x'].fillna(df['nto002d0_y'])
    df.drop(['stn_y', 'stn_x', 'hns000d0_x', 'hns000d0_y',
             'nto002d0_x', 'nto002d0_y'], axis=1, inplace=True)

    # add live data: from 2020
    df_zurich_fluntern_livedata = get_cleaned_livedata('SMA')
    df = df_zurich_fluntern.append(df_zurich_fluntern_livedata)

    # handle nan values
    df = handle_missing_values(df)

    # filter data for speicifc user (region and birtdate)
    filtered_result = filter_data(df, birthdate)

    return filtered_result


def clean_data_nordwestschweiz(birthdate):
    """combines data from different stations and calculates data based on birthdate and region"""
    # data: 1939 - 2019
    df_basel = pd.read_csv('/deployment/data/basel/Basel-1939-2019.txt',
                           delim_whitespace=True, parse_dates=['time'])

    # add live data
    df_basel_livedata = get_cleaned_livedata('BAS')
    df = df_basel.append(df_basel_livedata)

    # handle nan values
    df = df.astype({"hns000d0": float, "nto002d0": float, "rre150d0": float, "tre200d0": float, "tre200dx": float})
    df = handle_missing_values(df)
    df = df.drop_duplicates().reset_index()


    # filter data for speicifc user (region and birtdate)
    filtered_result = filter_data(df, birthdate)

    return filtered_result


def clean_data_tessin(birthdate):
    """combines data from different stations and calculates data based on birthdate and region"""
    # data: 1939 - 2019
    df_lugano = pd.read_csv('/deployment/data/tessin/Lugano-1939-2019.txt',
                            delim_whitespace=True, parse_dates=['time'])
    # add live data: from 2020
    df_lugano_livedata = get_cleaned_livedata('LUG')
    df = df_lugano.append(df_lugano_livedata)

    # handle nan values
    df = handle_missing_values(df)

    # filter data for speicifc user (region and birtdate)
    filtered_result = filter_data(df, birthdate)

    return filtered_result


def clean_data_mittelland(birthdate):
    """combines data from different stations and calculates data based on birthdate and region"""
    # combine data: 1939 - 2019
    df_bern = pd.read_csv('/deployment/data/mittelland/Bern-Zollikofen-1939-2019.txt',
                          delim_whitespace=True, parse_dates=['time'])
    df_meriringen = pd.read_csv('/deployment/data/mittelland/Meiringen-2012-2019.txt',
                                delim_whitespace=True, parse_dates=['time'])

    df_bern['nto002d0'] = df_bern['nto002d0'].replace('-', np.nan)
    df = pd.merge(df_bern, df_meriringen, how='outer', on=['time'])
    df['nto002d0'] = df['nto002d0_x'].fillna(df['nto002d0_y'])
    df.drop(['stn_y', 'stn_x', 'nto002d0_y', 'nto002d0_x'], axis=1, inplace=True)

    # add live data: from 2020
    df_bern_livedata = get_cleaned_livedata('BER')
    df_bern_livedata['nto002d0'] = df_bern_livedata['nto002d0'].replace(
        '-', np.nan)

    df_meiringen_livedata = get_cleaned_livedata('MER')
    df_meiringen_livedata.drop(
        ['tre200dx', 'tre200d0', 'hns000d0', 'rre150d0'], axis=1, inplace=True)

    df_livedata = pd.merge(
        df_bern_livedata, df_meiringen_livedata, how='outer', on=['time'])
    df_livedata['nto002d0'] = df_livedata['nto002d0_x'].fillna(
        df_livedata['nto002d0_y'])
    df_livedata.drop(['nto002d0_y', 'nto002d0_x'], axis=1, inplace=True)

    df = df.append(df_livedata)

    # handle nan values
    df = handle_missing_values(df)

    # filter data for speicifc user (region and birtdate)
    filtered_result = filter_data(df, birthdate)

    return filtered_result


def clean_data_ostschweiz_bergregion(birthdate):
    """combines data from different stations and calculates data based on birthdate and region"""
    # combine data: 1939 - 2019
    df_davos = pd.read_csv('/deployment/data/ostschweiz-berg/Davos_1939-2019.txt',
                           delim_whitespace=True, parse_dates=['time'])
    df_samedan = pd.read_csv('/deployment/data/ostschweiz-berg/Samedan-2005-2019.txt',
                             delim_whitespace=True, parse_dates=['time'])

    df_davos['nto002d0'] = df_davos['nto002d0'].replace('-', np.nan)
    df = pd.merge(df_davos, df_samedan, how='outer', on=['time'])
    df['nto002d0'] = df['nto002d0_x'].fillna(df['nto002d0_y'])
    df.drop(['stn_y', 'stn_x', 'nto002d0_x', 'nto002d0_y'], axis=1, inplace=True)

    # add live data: from 2020
    df_davos_livedata = get_cleaned_livedata('DAV')
    df_davos_livedata['nto002d0'] = df_davos_livedata['nto002d0'].replace(
        '-', np.nan)

    df_samedan_livedata = get_cleaned_livedata('SAM')
    df_samedan_livedata.drop(
        ['tre200dx', 'tre200d0', 'hns000d0', 'rre150d0'], axis=1, inplace=True)

    df_livedata = pd.merge(
        df_davos_livedata, df_samedan_livedata, how='outer', on=['time'])
    df_livedata['nto002d0'] = df_livedata['nto002d0_x'].fillna(
        df_livedata['nto002d0_y'])
    df_livedata.drop(['nto002d0_y', 'nto002d0_x'], axis=1, inplace=True)

    df = df.append(df_livedata)

    # handle nan values
    df = handle_missing_values(df)

    # filter data for speicifc user (region and birtdate)
    filtered_result = filter_data(df, birthdate)

    return filtered_result


if __name__ == "__main__":
    clean_data_genferseeregion(datetime.strptime('2004-01-01', '%Y-%m-%d'))
