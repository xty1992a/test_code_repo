const sleep = (t) => new Promise(r => setTimeout(r, t))

const request = (params, data) => new Promise(async resolve => {
	uni.showLoading({title:'加载中...'});
	await sleep(500);
	uni.hideLoading();
	
	if(typeof data === 'function') {
		data = data(params)
	}
	
	resolve({success: true, data})
})

export const getList = (params) => request(params, (params) => {
	const {pageIndex: index, pageSize: size} = params
	return [...Array(size)].map((n,i)=> index*size + i + 1)
})