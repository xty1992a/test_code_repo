class Message {
  constructor() {
	this.__storage_key__ = '__message__';
	this.__callback_map__ = {};
	this.listen();
  }

  // 监听消息
  // storage事件可以同域跨tab触发.所以需要甄别消息来源
  listen() {
	window.addEventListener('storage', e => {
	  // 与Message无关的storage事件
	  if (e.key !== this.__storage_key__) return;
	  // 删除所触发的事件
	  // 通知机制不能依赖于storage的特性,否则可以此时resolve结果
	  if (!e.newValue) return;
	  const data = JSON.parse(e.newValue);
	  // 消息为回复类型时,使postMessage方法产生的promise返回结果
	  if (data.isReply) {
		console.log('get reply');
		const key = data.type + '__replay__' + data.timeStamp;
		this.notify(key);
		return;
	  }
	  // 正常获得消息
	  this.getRemoteMessage(data);
	});
  }

  // 使localStorage变动,触发storage事件
  post(type, payload) {
	localStorage.setItem(this.__storage_key__, JSON.stringify({
	  type,
	  ...payload,
	}));
	// 清除数据防止污染
	setTimeout(() => {
	  localStorage.removeItem(this.__storage_key__);
	});
  }

  // 用户发消息时,设下一个监听器,监听到彼端回复后,resolve结果
  postMessage(type, message) {
	return new Promise(resolve => {
	  const stamp = Date.now();
	  this.post(type, {
		message,
		timeStamp: stamp,
		isReply: false,
	  });
	  // 用户所发消息,监听彼端回复
	  const replyKey = type + '__replay__' + stamp;
	  const reply = () => {
		resolve();
		this.clear(replyKey);
	  };
	  this.on(replyKey, reply);
	});
  }

  // 正常获得消息时,通知订阅者,并且回复彼端,这边收到消息
  getRemoteMessage(data) {
	this.notify(data.type, data.message);
	this.reply(data);
  }

  // 回复通知已收到
  reply(data) {
	this.post(data.type, {
	  isReply: true,
	  timeStamp: data.timeStamp
	});
  }

  // region 发布订阅模式
  notify(event, payload) {
	(this.__callback_map__[event] || []).forEach(cb => cb(payload));
  }

  on(event, callback) {
	const list = this.__callback_map__[event] || [];
	list.push(callback);
	this.__callback_map__[event] = list;
  }

  off(event, callback) {
	const list = this.__callback_map__[event] || [];
	this.__callback_map__[event] = list.filter(it => it !== callback);
  }

  clear(event) {
	delete this.__callback_map__[event];
  }

  // endregion
}
