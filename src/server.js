const express = require('express');
const axios = require('axios');
const fs = require('fs');
const grib2json = require('grib2json');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Allow only your frontend's origin
  methods: 'GET,POST', // Allow specific methods
  allowedHeaders: 'Content-Type' // Allow specific headers
}));

app.get('/fetch-grib', async (req, res) => {
  const gribUrl = 'https://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_0p25.pl?dir=%2Fgfs.20240610%2F12%2Fatmos&file=gfs.t12z.pgrb2.0p25.anl&all_var=on&all_lev=on&subregion=&toplat=37.15&leftlon=68.15&rightlon=97.55&bottomlat=8.30';
  const tempFilePath = path.join(__dirname, 'temp.grib2');

  try {
    console.log('Fetching GRIB file from URL...');
    const response = await axios({
      url: gribUrl,
      responseType: 'arraybuffer'
    });

    console.log('Saving GRIB file locally...');
    fs.writeFileSync(tempFilePath, response.data);

    console.log('Converting GRIB file to JSON...');
    grib2json.default(tempFilePath, { data: true, names: true }, (err, json) => {
      if (err) {
        console.error('Error converting GRIB to JSON:', err);
        res.status(500).send(`Error converting GRIB to JSON: ${err.message}`);
        return;
      }
      res.json(json);
      console.log('Conversion successful, cleaning up...');
      fs.unlinkSync(tempFilePath); // Clean up the temporary file
    });
  } catch (error) {
    console.error('Error processing GRIB file:', error);
    res.status(500).send(`Error processing GRIB file: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
