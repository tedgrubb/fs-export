const http = require('http');

const request = {
  getJSON: (url, callback) => {
    http.get(url, (res) => {
      let rawData = '';

      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          callback(parsedData);
        } catch (e) {
          console.error(e.message);
        }
      })
    });
  },

  getImage: (url, callback) => {
    http.get(url, (res) => {
      let rawData = '';
      res.setEncoding('binary');

      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          callback(rawData);
        } catch (e) {
          console.error(e.message);
        }
      })
    });
  }
}

module.exports = request