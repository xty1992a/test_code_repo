const compressing = require('compressing');
const glob = require('glob');
const fs = require('fs');
const chalk = require('chalk');

chalk.level = 1

async function zip(dir) {
  try{
	await compressing.zip.compressDir(dir, dir+'.zip')
	return true
  }catch (e) {
	return  false
  }
}

function zipped(dir) {
  return new Promise(resolve => {
    fs.access(dir+'.zip', fs.constants.F_OK,e => {
      resolve(!e)
	})
  })
}

function checkContainImages(dir) {
  return new Promise(resolve => {
    fs.readdir(dir, (e, f) => {
      f = f.filter(it => /jpg|png$/.test(it))
	  if(e) return resolve({success: false})
	  resolve({success: true, data: f})
	})
  })
}

async function zipDir(dir) {
  dir = dir.substring(0, dir.length-1)
  const result = await checkContainImages(dir)
  if(!result.success) return console.log(chalk.red(`check directory [${dir}] error`))
  if(!result.data.length) return console.log(chalk.gray(`directory [${dir}] did not contain image`))
  if(await zipped(dir)) return console.log(chalk.green(`directory [${dir}] had already zipped`))
  console.log(chalk.yellow(`zip directory ${dir}`))
  await zip(dir)
}

function scanDir(dir) {
  console.log(chalk.hex('#26c6da')(`---zipper start on ${dir}---`))
  glob(dir+'/*/',async (e,f)=> {
	if(e)return
	while (f.length) {
	  await zipDir(f.shift())
	}
  })
}

module.exports = scanDir
