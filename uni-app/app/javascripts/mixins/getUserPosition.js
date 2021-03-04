/**
 * Created by TY-xie on 2017/10/10.
 */
// import getLocation from '../utils/position';

function getLocation() {
  return Promise.resolve({success: false})
}

export default {
  methods: {
    getUserPosition() {
      console.log('start getpostion')
      return new Promise((resolve, reject) => {
				 getLocation().then(res => {
              	if(res.success){
								let latitude =	parseFloat(res.data.latitude) >= 0 ? res.data.latitude : ''
								let longitude =	parseFloat(res.data.longitude) >= 0 ? res.data.longitude : ''
									let pos = {
										lat: latitude,
										lng: longitude,
									}
									console.log('pos', pos)
									resolve(pos)
								}else{
									reject(res.data)
								}
              })
              .catch(err => {
                console.log('err', err)
                reject(err)
              })
      })
    },
  }
}
