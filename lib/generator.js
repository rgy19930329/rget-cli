const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const rm = require('rimraf').sync

module.exports = function(
  metadata = {},
  src,
  filters = ['package.json', 'README.md', 'ua.json'],
  dest = '.',
) {
  if (!src) {
    return Promise.reject(new Error(`无效的source：${src}`))
  }

  return new Promise((resolve, reject) => {
    Metalsmith(process.cwd())
      .metadata(metadata)
      .clean(false)
      .source(src)
      .destination(dest)
      .use((files, metalsmith, done) => {
        const meta = metalsmith.metadata()
        Object.keys(files)
          .filter(
            (x) => {
              for (let i = 0; i < filters.length; i++) {
                if (x.includes(filters[i])) {
                  return true;
                }
              }
              return false;
            }
          )
          .forEach(fileName => {
            const t = files[fileName].contents.toString()
            files[fileName].contents = new Buffer(Handlebars.compile(t)(meta))
          })
        done()
      }).build(err => {
        rm(src)
        err ? reject(err) : resolve()
      })
  })
}
