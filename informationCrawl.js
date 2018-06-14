const Promise = require('bluebird');
const Html4Entities = require('html-entities').Html4Entities;
const informationCrawler = require('./utils/informationCrawler');
const informations = require('./models/informations');

const entities = new Html4Entities();

function crawl(targetId, pageNo = 1, foundIds = {}) {
  let findTarget = false;

  return informationCrawler(pageNo)
    .then((results) => Promise.each(results, (result) => { // 순서대로 넣기위해 each 사용
      if (result.id[0] === targetId) {
        findTarget = true;
        return;
      }

      if (findTarget || foundIds[result.id[0]]) {
        return;
      }

      foundIds[result.id[0]] = true;

      return informations.create({
        dataId: result.id[0],
        title: result.title[0],
        countryName: result.countryName[0],
        countryEnName: result.countryEnName[0],
        content: entities.decode(result.content[0]),
        fileUrl: result.fileUrl[0],
        wrtDt: new Date(result.wrtDt[0]),
      });
    }))
    .then(() => {
      if (findTarget) return Object.keys(foundIds).length;
      return crawl(targetId, pageNo + 1, foundIds);
    });
}

module.exports = () => {
  return informations.findOne({
    order: [['wrtDt', 'desc'], ['id', 'asc']], // 크롤링 후 먼저 나온 글부터 넣기 때문에 wrtDt가 같은경우 id 순으로 먼저 insert된 것이 더 최신글임
  })
  .then((lastInformation) => {
    const targetId = lastInformation.dataId;
    return crawl(targetId);
  })
  .then((foundCount) => {
    console.log('foundCount', foundCount);
    return foundCount;
  });
}
