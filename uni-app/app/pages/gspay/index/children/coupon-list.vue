<template>
    <div class="coupon-wrap" @touchmove.stop>
        <ul class="coupon-list">
            <li class="coupon-item"
                v-show="item.enabled"
                :class="{checked: item.isCheck}"
                @click="checkItem(item)"
                v-for="(item, index) in list">
                <div class="check">
                    <i class="iconfont icon-icon_xuanzhong1" :class="{disabled:item.disabled}"
                       v-if="type==='radio'"></i>
                    <i class="iconfont icon-fuxuankuang-xuanzhong" :class="{disabled:item.disabled}"
                       v-if="type==='checkbox'"></i>
                </div>
                <coupon-card :data="item" :index="index">
<!--                    <div class="counter-wrap" v-if="item.couponType===2" @click.stop>-->
<!--                        <input-number :max="item.enableCount"-->
<!--                                      :stop="false"-->
<!--                                      @input="countChange(item, ...arguments)"-->
<!--                                      :disabled="!item.isCheck"-->
<!--                                      :value="item.count"/>-->
<!--                    </div>-->
                </coupon-card>
            </li>
        </ul>
    </div>
</template>

<script>
    import CouponCard from './coupon-card'
    import InputNumber from '../../../../components/InputNumber/Main.vue'

    require('../js/math');
    export default {
        name: 'coupon-list',
        components: {CouponCard, InputNumber},
        props: {
            show: Boolean,
            type: {
                type: String,
                default: 'radio',
            },
            list: {
                type: Array,
                required: true,
            },
        },
        data() {
            return {}
        },
        created() {
            console.log(this.list)
        },
        methods: {
            getColors(index) {
                return ['blue', 'red', 'orange', 'green', 'blown'][index % 5]
            },
            checkItem(item) {
                if (item.disabled) {
                    return;
                }
                item.count = 1;
                this.$emit('change', {...item, isCheck: !item.isCheck})
            },
            getCouponVal(item) {
                if (item.couponType === 2) {
                    return `${item.couponValue}元`
                } else {
                    return `${Math.changeToDecimal(Math.mult(item.couponValue, 10))}折`
                }
            },
            countChange(item, val) {
                if (item.disabled) {
                    return;
                }
                this.$emit('change', {...item, count: val});
            }
        },
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
    @import "../../../../styles/variable";
    @import "../../../../styles/modules/bgColor";

    .two-dot(@bg: #fafafa, @size: 14px) {
        position: relative;
        &:before, &:after {
            content: '';
            position: absolute;
            width: @size;
            height: @size;
            border-radius: 50%;
            background-color: @bg;
            top: 50%;
            z-index: 1;
        }
        &:before {
            left: -@size / 2;
            transform: translateY(-50%) rotate(135deg);
            box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.07) inset;
        }
        &:after {
            right: -@size / 2;
            transform: translateY(-50%) rotate(-45deg);
            box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.07) inset;
        }
    }

    .coupon-wrap {
        height: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;

        .coupon-list {
            padding: 0 10px 10px;
        }

        .coupon-item {
            margin-bottom: 10px;
            position: relative;
            display: flex;

            .coupon-card {
                box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
                .two-dot;
                width: 325px;
                border-radius: 4px;
            }

            &.checked {
                .check {
                    .iconfont {
                        color: #ff9700;
                    }
                }
            }

            .disabled {
                color: #dfdfdf;
            }

            .check {
                width: 30px;
                line-height: 100px;

                .iconfont {
                    font-size: 20px;
                }
            }

            .counter-wrap {
                position: absolute;
                bottom: 0;
                right: 0;
                top: 0;
                display: flex;
                align-items: center;
                padding: 0 20px;
            }

        }
    }

</style>
