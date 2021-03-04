const glob = require('glob');
const fs = require('fs').promises;

function run() {
  glob('./data/**/*.js', async (e,f)=>{
	try{
	  while (f.length) {
	    let name = f.shift()
		await fs.rename(name, name.replace(/.js$/, '.ts'))
	  }
	}catch (e) {
	}
  })
}
run()
