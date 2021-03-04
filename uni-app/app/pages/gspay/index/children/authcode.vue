<template>
  <action :position="'center'" v-show="isShow" @cancel="cancel">
    <div class="author-code" slot="center">
      <p class="head">
        <span>{{head}}</span>
        <i class="iconfont icon-quxiao ex_click" v-tap="{methods: cancel}"></i>
      </p>
      <p v-if="tips" class="tips">
        <span>{{tips}}</span>
      </p>
      <div class="center" v-tap="{methods:showFocus}">
        <p>
<!--          :class="showStep(item)"-->
          <span class="cell"  v-for="item in codelength"></span>
        </p>
        <input class="code" type="tel" v-model="code" ref="input">
      </div>
      <p class="wraning">
        <i class="iconfont icon-tishi2" v-show="wraning"></i>
        <span>{{wraning}}</span>
      </p>
    </div>
  </action>
</template>

<script>
	import Action from '../../../../components/action'

	export default {
		name: 'author-code',
		components: {Action},
		props: {
			head: {
				type: String,
				default: '请服务员输入授权码'
			},
			codelength: {
				type: Number,
				default: 6
			}
		},
		data () {
			return {
				code: '',
				isShow: false,
				wraning: '',
				tips: '',
				callback: null
			}
		},
		methods: {
			showStep(item){
				let code = '' + this.code
				if (code.length >= item) {
					return 'fill'
				}
				return ''
			},
			cancel(){
				this.isShow = false
				this.code = ''
				this.wraning = ''
				this.$emit('cancel')
			},
			showFocus(){
				this.$nextTick(() => {
					this.$refs.input.focus()
				})
			},
			async checkCode(code){
				if (this.callback) {
					var a = await  this.callback(code)
					return a
				}
				return false
			},
			showCode(tips){
				let key = {}
				let pro = new Promise((resolve, reject) => {
					key.resolve = resolve
					key.reject = reject
				})
				this.pub.$emit('check', {key, tips: tips})
				return pro
			},
			setCheckFun(cb){
				this.callback = cb
			}
		},
		watch: {
			async code(now){
				if (now.length > this.codelength) {
					this.code = now.substring(0, this.codelength)
				}
				if (this.code.length === this.codelength) {
					if (await this.checkCode(now)) {
						this.isShow = false
						this.key.resolve(this.code)
						this.code = ''
					} else {
						this.wraning = '授权码验证失败'
					}
				}
			},
			isShow(now) {
				if (now) {
					this.$nextTick(() => {
						this.$refs.input.focus()
					})
				} else {
					this.$nextTick(() => {
						this.$refs.input.blur()
					})
				}
			}
		},
		created(){
			this.pub.$on('check', option => {
				this.isShow = true
				this.key = option.key
				this.tips = option.tips
			})
		}
	}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../../styles/variable";

  .author-code {
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    width: 300px;
    .head {
      .f18;
      text-align: center;
      padding: 26px 0;
      font-weight: bold;
      position: relative;
      .iconfont {
        position: absolute;
        color: @grayC;
        .translate(0, -50%);
        right: 10px;
        top: 35%;
      }
    }
    .tips {
      .f14;
      text-align: center;
      padding: 10px 0;
      position: relative;
    }
    .center {
      text-align: center;
      .cell {
        width: 41px;
        vertical-align: middle;
        height: 41px;
        background-color: #f2f2f2;
        border: 1px solid #dadada; /*px*/
        text-align: center;
        line-height: 41px;
        display: inline-block;
        &.fill {
          &:before {
            content: '';
            display: inline-block;
            width: 10px;
            height: 10px;
            background-color: #333;
            border-radius: 50%;
          }
        }
      }
      .code {
        position: absolute;
        z-index: -1;
        text-indent: -999em; /*文本向左缩进*/
        margin-left: -100%;
        width: 200%;
        opacity: 0;
      }
    }
    .wraning {
      flex: 1;
      padding: 20px 10px 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #F44336;
      i {
        color: #F44336;
        font-size: 14px;
        margin-top: -3px;
        margin-right: 5px;
      }
    }
  }
</style>
<style lang="less" rel="stylesheet/less">
  .action {
    bottom: 0;
    top: 0;
  }
</style>
