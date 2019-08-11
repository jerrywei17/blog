const uuid = require('uuid/v1')
const { Storage } = require('@google-cloud/storage')
const requireLogin = require('../middlewares/requireLogin')

const storage = new Storage({
  projectId: 'blog-247308',
  keyFilename: './src/private-keys/gcp-key.json',
});
const myBucket = storage.bucket('blog-image_bucket');
let expiresTime = new Date()
expiresTime.setTime(expiresTime.getTime() + (30*60*1000))

const config = {
  action: 'write',
  expires: expiresTime,
  version: 'v4'
};

module.exports = app => {
  app.get('/api/upload', requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`
    const file = myBucket.file(key);

    file.getSignedUrl(config, (err, url) => {
      if (err) {
        console.error(err);
        return;
      }
      res.send({
        key,
        url
      })
    });
  });
}
