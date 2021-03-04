<template>
  <div class="number-keyboard">
    <table cellpadding="0" cellspacing="0" border="0">
      <tbody>
      <tr v-for="item in list" :key="item.value">
        <td
                @click="itemClick({value: it.value,type: it.type})"
                :rowspan="it.type==='text'?'3':''"
                v-for="it in item">
          <div class="keyboard-cell" :class="it.type">
            <template v-if="it.type==='text'">确认</template>
            <template v-if="it.type==='num'">{{it.value}}</template>
            <template v-if="it.type==='money'">￥{{it.value}}</template>
            <template v-if="it.type==='icon'">
              <i class="iconfont" :class="icon[it.value]"></i>
            </template>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
	name: 'number-keyboard',
	props: {
	  initValue: {
		type: String,
		default: ''
	  }
	},
	data() {
	  return {
		value: [],
		icon: {
		  c: 'icon-zizhumaidanshouqijianpan',
		  x: 'icon-zizhumaidanshanchu'
		},
		list: [
		  [
			{type: 'money', value: '100'},
			{type: 'money', value: '200'},
			{type: 'money', value: '300'},
			{type: 'money', value: '500'},
		  ],
		  [
			{type: 'num', value: '1'},
			{type: 'num', value: '2'},
			{type: 'num', value: '3'},
			{type: 'icon', value: 'x'},
		  ],
		  [
			{type: 'num', value: '4'},
			{type: 'num', value: '5'},
			{type: 'num', value: '6'},
			{type: 'text', value: 'c'},
		  ],
		  [
			{type: 'num', value: '7'},
			{type: 'num', value: '8'},
			{type: 'num', value: '9'},
		  ],
		  [
			{type: 'num', value: '00'},
			{type: 'num', value: '0'},
			{type: 'num', value: '.'},
		  ],
		]
	  };
	},
	methods: {
	  cancel() {
		this.$emit('confirm', this.result);
	  },
	  itemClick({type, value}) {
		if (type === 'money') {
		  this.value = value.split('');
		  this.$emit('input', this.result);
		  // this.cancel();
		  return;
		}
		else {
		  var cur = this.value;
		  switch (value) {
			case 'x':
			  cur.pop();
			  break;
			case 'c':
			  this.cancel();
			  break;
			case '.':
			  if (cur.length === 0) {
				cur.push(0);
			  }
			  else if (cur.indexOf('.') < 0) {
				cur.push('.');
			  }
			  break;
			case '00':
			  this.itemClick({
				type: 'num',
				value: '0'
			  });
			  this.itemClick({
				type: 'num',
				value: '0'
			  });
			  break;
			default:
			  cur.length === 1 && cur[0] === '0' && cur.pop();
			  cur.indexOf('.') < 0 && cur.length < 5 ? cur.push(value) : cur.length - cur.indexOf('.') < 2 + 1 && cur.push(value);
			  break;
		  }
		}
		this.$emit('input', this.result);
	  },
	  reset(val) {
		if (val) {
		  this.value = (val + '').split('');
		}
		else {
		  this.value = [];
		}
	  }
	},
	computed: {
	  result() {
		return this.value.join('');
	  }
	},
	watch: {
	  initValue: {
		handler: function (now) {
		  console.log('初始值变了', now, 111);
		  this.value = [];
		  if (now && now > 0) {
			this.value = (now + '').split('');
		  }
		}
	  }
	}
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../../styles/variable";

  .number-keyboard {
	background-color: #F3F4F5;
	position: absolute;
    padding: 4px;
   	bottom: 0;
	right: 0;
	left: 0;

    table {
      width: 100%;

      tr {
        display: flex;

        td {
          text-align: center;
          width: 25%;
          padding: 5px;

          .keyboard-cell {
            color: #000;
            background-color: #fff;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

            &:active {
              overflow: hidden;
              box-shadow: inset 0 0 40px rgba(0, 0, 0, .1);
            }

            &.num, &.icon {
              height: 48px;
            }

            &.num {
              .fz(60px);
            }

            &.money {
              .fz(50px);
              height: 48px;
              background-color: #07C160;
              color: #fff;
            }

            &.text {
              background-color: #FE9700;
              .fz(42px);
              color: #fff;
              height: 160px;
            }
          }

          .icon-zizhumaidanshouqijianpan, .icon-zizhumaidanshanchu {
            font-size: 32px;
            color: #000;
          }
        }
      }
    }
  }
</style>
