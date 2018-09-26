const { readdir, stat } = require('fs')

const throwError = callback => function (error, ...args) {
  if (error) throw error
  if (callback) callback.apply(this, args)
}

const walkFiles = (dir, callback) => readdir(dir, (error, files) => {
  if (error) return callback(error)

  files.forEach(file => {
    const path = join(dir, file)

    stat(path, (error, stats) => {
      if (error) return callback(error)

      if (stats.isDirectory()) {
        walkFiles(path, callback)
      } else {
        callback(null, { file, dir, path })
      }
    })
  })
})

module.exports = { throwError, walkFiles }
