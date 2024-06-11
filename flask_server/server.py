
from flask import Flask, jsonify, request
import requests
import os
import cfgrib
import xarray as xr
import tempfile
import ecmwflibs

import eccodes
app = Flask(__name__)
PORT = 3001

# Enable CORS for all routes
from flask_cors import CORS
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/fetch-grib', methods=['GET'])
def fetch_grib():
    grib_url = 'https://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_0p25.pl?dir=%2Fgfs.20240610%2F12%2Fatmos&file=gfs.t12z.pgrb2.0p25.anl&all_var=on&all_lev=on&subregion=&toplat=37.15&leftlon=68.15&rightlon=97.55&bottomlat=8.30'
    
    try:
        # Fetching GRIB file from URL
        print('Fetching GRIB file from URL...')
        response = requests.get(grib_url)
        response.raise_for_status()

        # Saving GRIB file locally in a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".grib2") as temp_file:
            temp_file.write(response.content)
            temp_file_path = temp_file.name

        # Converting GRIB file to JSON
        print('Converting GRIB file to JSON...')
        ds = xr.open_dataset(temp_file_path, engine='cfgrib')
        data_dict = ds.to_dict()

        # Cleaning up the temporary file
        os.remove(temp_file_path)
        
        return jsonify(data_dict)
        
    except Exception as e:
        print(f'Error processing GRIB file: {e}')
        return f'Error processing GRIB file: {e}', 500

if __name__ == '_main_':
    app.run(host='0.0.0.0', port=PORT)
    input()