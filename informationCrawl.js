const Promise = require('bluebird');
const decode = require('unescape');
const informationCrawler = require('./utils/informationCrawler');
const informations = require('./models/informations');

function crawl(targetId, pageNo = 1) {
  let findTarget = false;

  return informationCrawler(pageNo)
    .then((results) => Promise.map(results, (result) => {
      if (result.id[0] === targetId) {
        findTarget = true;
        return;
      }
      return informations.create({
        dataId: result.id[0],
        title: result.title[0],
        countryName: result.countryName[0],
        content: decode(result.content[0]),
        fileUrl: result.fileUrl[0],
        wrtDt: new Date(result.wrtDt[0]),
      });
    }))
    .then(() => {
      if (findTarget) return;
      return crawl(targetId, pageNo + 1);
    });
}

module.exports = () => {
  informations.findOne({
    order: [['wrtDt', 'desc']],
  })
  .then((lastInformation) => {
    const targetId = lastInformation.dataId;

    crawl(targetId);
  });
}
