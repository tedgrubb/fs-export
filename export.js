const request = require('./utils/request.js');
const fs = require('fs');

const user = ''; // id or slug

if (user === '') {
  console.error('Fatal. You must set your user id or name in export.js');
  process.exit(1);
}

const profileURL = `http://www.foodspotting.com/people/${user}/reviews.json`;

const tmp = './tmp/images';

// create directory if it doesn't exist;
if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);

// Remove any previously generated html file
fs.unlink('./tmp/foodspotting.html', (err) => {});

const downloadImage = (url, filename) => {
  request.getImage(url, (imagedata) => {
    const file = `./tmp/images/${filename}.jpg`;
    fs.writeFile(file, imagedata, 'binary', (err) => {
      if (err) {
        console.log('Error downloading', url);
      } else {
        console.log('Downloaded', filename);
      }
    });
  });
}

const processPage = (data) => {
  data.map((review) => {
    const url = review.thumb_280.replace('thumb_275', 'original')
    const filename = review.id;
    downloadImage(url, filename);
  });

  fs.appendFileSync('./tmp/foodspotting.html', data.map((review) => {
    return '<div style="width:280px;height:400px;float:left; border: 1px solid #CCC;margin: 0 10px 10px 0;">'+
      '<img src="./images/'+ review.id +'.jpg" width="280" height="280" />'+
      '<div style="padding: 5px 10px; font-size: 13px;font-family: Helvetica Neue">'+
        `<p>${review.creator_action} - ${review.item.name} @ ${review.place.name}</p>`+
        `<p style="color: #777;">${review.place.full_address}</p>`+
        `<p style="color: #777;">${review.taken_at}</p>`+
      '</div>'+
    '</div>';
  }).join(''));
}

const getReviewsForPage = (page) => {
  const url = `${profileURL}?page=${page}`;

  request.getJSON(url, (result) => {
    processPage(result.data);

    if (page < result.total) {
      getReviewsForPage(page + 1);
    }
  });
}

getReviewsForPage(1);