const program = require('commander')
const { rename } = require('fs')
const { join } = require('path')
const { throwError, walkFiles } = require('./util')
const { version } = require('../package.json')

program
  .version(version)
  .option('-e, --exact <exact>', 'The exact filename to match')
  .option('-m, --match <match>', 'A regular expression to test the file name againt', RegExp)
  .option('-d, --matchdir <matchdir>', 'A regular expression to test the file\'s directory against')
  .option('-n, --newname <newname>', 'The new name for the file')
  .option('-r, --replace <replace>', 'What to replace the matcheed substring with')
  .parse(process.argv)

const { exact, match, matchdir, newname, replace } = program
const [ rootDir ] = program.args

walkFiles(rootDir, throwError(({ file, dir, path }) => {
  if (exact && file !== exact) {
    return
  } else if (match && !match.test(file)) {
    return
  }

  if (matchdir && !matchdir.test(dir)) return

  if (newname) {
    rename(path, join(dir, newname), throwError())
  } else if (match && replace) {
    rename(path, join(dir, file.replace(match, replace)), throwError())
  }
}))
