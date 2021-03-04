<template>
    <action class="coupon-wrap" v-show="show" @touchmove.native.prevent @cancel="cancel">
        <div class="coupon-action " slot="bottom">
            <header class="coupon-head action-head">
                <div class="menu-item" :class="{active:menuIndex===0}" @click="checkMenu(0)">代金券</div>
                <div class="menu-item" :class="{active:menuIndex===1}" @click="checkMenu(1)">折扣券</div>
            </header>
            <section class="coupon-content">
                <p class="tips">代金券与折扣券不能同时享用
                     <button class="auto-pick" @click="autoPick">
                        使用推荐优惠
                     </button>
                </p>
                <transition-group :name="transitionName">
                    <coupon-list :list="list[0]"
                                 :show="menuIndex===0"
                                 v-show="menuIndex===0"
                                 key="checkbox"
                                 type="checkbox"
                                 @change="djqChange"></coupon-list>
                    <coupon-list :list="list[1]"
                                 :show="menuIndex===1"
                                 v-show="menuIndex===1"
                                 key="radio"
                                 type="radio"
                                 @change="zkqChange"></coupon-list>
                </transition-group>
            </section>
            <footer class="coupon-foot">
                <p class="text">选择 <span class="price">{{selectCount}}</span>张 {{menuIndex === 0 ? '代金券' :
                    '折扣券'}}，最高可抵扣 <span
                            class="price">{{selectDiscount}}</span></p>
                <button @click="cancel">确定</button>
            </footer>
        </div>
    </action>
</template>

<script>
    import CouponList from "./coupon-list.vue";
    import Action from "../../../../components/action";
    import {getCoupons} from "../../../../javascripts/api/gs-api.js";

    require("../js/math");
    Array.findAll = (arr, callback) => {
        var result = [];
        arr.forEach(e => {
            if (callback(e)) {
                result.push(e);
            }
        });
        return result;
    };
    export default {
        name: "coupon-action",
        props: {
            value: {
                type: String
            },
            allowMuti: {
                type: Boolean,
                default: false
            },
            discountParameter: {
                type: Object,
                default: {}
            }
        },
        components: {Action, CouponList},
        data() {
            return {
                menuIndex: 0,
                transitionName: "left",
                list: [[], []],
                show: false,
                money: 0
            };
        },
        methods: {
            checkMenu(index) {
                this.menuIndex = index;
                this.list[0].forEach(it => {
                    it.count = 0;
                    it.disabled = it.enableCount <= 0;
                    it.isCheck = false;
                });

                this.list[1].forEach(it => {
                    it.count = 0;
                    it.disabled = it.enableCount <= 0;
                    it.isCheck = false;
                });
            },
            cancel() {
                this.$emit("update:show", false);
                this.$emit("confirm");
                this.show = false;
            },
            check(id) {
                this.$emit("input", id);
            },
            zkqChange(item) {
                this.list[1].forEach(item=>{
                    item.isCheck = false;
                })
                let index = this.list[1].findIndex(it => it.couponSendGuid === item.couponSendGuid)
                this.list[1].splice(index, 1, item);
            },
            djqChange(item) {
                let index = this.list[0].findIndex(it => it.couponSendGuid === item.couponSendGuid)
                this.list[0].splice(index, 1, item);
                this.updateDjqListStatus();

            },
            autoSelect(money) {
                this.reset();
                this.filter(money);
                let curList = this.list[0].filter(item => item.enabled && money >= item.minConsumeValue && !item.disabled);
                let cashone = curList[0];
                console.log('cashone', cashone);
                console.log('自动勾选，金额卡券选择结果过滤', money);
                if (cashone) {
                    this.autoSelectByDjq(curList);
                } else {
                   this.autoSelectByZkq();
                }
            },
            autoPick(){
                this.reset();
                this.filter(this.money);
                if(this.menuIndex===0){
                    let curList = this.list[0].filter(item => item.enabled && this.money >= item.minConsumeValue && !item.disabled);
                    this.autoSelectByDjq(curList);
               }else{
                    this.autoSelectByZkq();
                }
            },
            autoSelectByDjq(curList){
                this.menuIndex = 0;
                if (this.allowMuti) {
                    let orderMaxYuan = Math.mult(
                        this.money,
                        this.discountParameter.couponConsumeMaxRate
                    );
                    let curDiscount = 0;
                    let minValueSum = 0;
                    for (let i = 0; i < curList.length; i++) {
                        let item = curList[i];
                        let enableDiscountMoney = Math.subtract(orderMaxYuan, curDiscount);
                        let enableMinValue = Math.subtract(this.money, minValueSum);
                        if (enableMinValue < 0) {
                            enableMinValue = 0;
                        }
                        if (enableDiscountMoney === 0) {
                            break;
                        }
                        let minConsumeValueCount = 0;

                        if (item.minConsumeValue === 0) {
                            minConsumeValueCount = item.number;
                        } else {
                            minConsumeValueCount = Math.floor(enableMinValue / item.minConsumeValue);
                            if (minConsumeValueCount > item.number) {
                                minConsumeValueCount = item.number;
                            }
                        }
                        let moneyMaxCount = Math.ceil(enableDiscountMoney / item.couponValue);
                        let enableCount = Math.min(minConsumeValueCount, moneyMaxCount);
                        minValueSum = Math.add(minValueSum, Math.mult(enableCount, item.minConsumeValue));
                        curDiscount = Math.add(curDiscount, Math.mult(enableCount, item.couponValue));
                        if (curDiscount > orderMaxYuan) {
                            curDiscount = orderMaxYuan;
                        }
                        if (enableCount > 0) {
                            item.isCheck = true;
                            item.count = enableCount;
                            console.log('item', item, minValueSum, minConsumeValueCount, moneyMaxCount, enableDiscountMoney, orderMaxYuan)
                        }
                    }
                } else {
                    curList.forEach(item=>{
                        item.disabled = true;
                    })
                    let cashone = curList[0];
                    cashone.isCheck = true;
                    cashone.count = 1;
                    cashone.disabled = false;
                }
            },
            autoSelectByZkq(){
                this.menuIndex = 1;
                let disone = this.list[1].find(d => d.enabled);
                console.log('disone', disone);
                if (disone) {
                    disone.isCheck = true;
                    disone.count = 1;
                }
            },
            getResult(parameter) {
                let selectedCoupons = this.getSelectedCoupons();
                let curList = this.list[this.menuIndex] || [];
                let count = curList.filter(e => e.enabled && e.isCheck).reduce((total, item) => {
                    return item.count + total;
                }, 0);
                return {
                    money: this.getDiscount(parameter),
                    count: count,
                    coupons: selectedCoupons,
                    total: this.getTotalCount()
                };
            },
            async loadCoupons(storeId, guid) {
                let result = await getCoupons(storeId, guid);
                // by yaol
                // if (result.success) {
                if (result.success && result.data.coupons) {
                    let rl = [];
                    for (let i = 0; i < result.data.coupons.length; i++) {
                        let item = result.data.coupons[i];
                        rl.push({...item, count: 0, enableCount: item.number, isCheck: false, enabled: true});
                    }
                    this.list = [
                        Array.findAll(rl, e => e.couponType === 2),
                        Array.findAll(rl, e => e.couponType === 3)
                    ]
                }
            },
            clear() {
                this.list[0].forEach(e => {
                    e.disabled = false;
                });
                this.list[1].forEach(e => {
                    e.disabled = false;
                });
                this.checkedCoupon = [];
            },
            reset() {
                this.list[0].forEach(item => {
                    item.isCheck = false;
                    item.disabled = false;
                    item.count = 0;
                });
                this.list[1].forEach(item => {
                    item.isCheck = false;
                    item.disabled = false;
                    item.count = 0;
                });
            },
            filter(money) {
                this.money = money;
                this.list[0].forEach(e => {
                    e.enabled = true;
                });
                this.list[0].forEach(e => {
                    if (!e.minConsumeValue || e.minConsumeValue <= this.money) {
                        e.enabled = true;
                    } else {
                        e.enabled = false;
                    }
                });
                this.list[1].forEach(e => {
                    e.enabled = true;
                });
                this.list[1].forEach(e => {
                    if (!e.minConsumeValue || e.minConsumeValue <= this.money) {
                        e.enabled = true;
                    } else {
                        e.enabled = false;
                    }
                });
            },
            showCoupon(money) {
                this.show = true;
                this.money = money;
                this.reset();
                this.filter(money);
            },
            getDiscount(parameter) {
                let curList = this.list[this.menuIndex] || [];
                let checkedCoupons = curList.filter(it => it.isCheck);
                if (!checkedCoupons.length) {
                    return 0;
                }
                let discount = 0;
                if (this.menuIndex === 0) {
                    let orderMaxYuan = Math.mult(
                        this.money,
                        parameter.couponConsumeMaxRate
                    );
                    checkedCoupons.forEach(item => {
                        console.log('item1111', item);
                        discount += Math.mult(item.couponValue, item.count);
                    });
                    if (discount > orderMaxYuan) {
                        discount = orderMaxYuan;
                    }
                    discount = Math.changeToDecimal(discount, 2);
                } else if (this.menuIndex === 1) {
                    let item = checkedCoupons[0];
                    let rate = Math.subtract(1, item.couponValue);
                    console.log('rate....',rate,this.money);
                    discount = Math.changeToDecimal(Math.mult(rate, this.money), 2);
                }
                return discount;
            },
            getSelectedCoupons() {
                let curList = this.list[this.menuIndex];
                let checkedCoupons = curList.filter(it => it.isCheck);
                if (!checkedCoupons.length) {
                    return "";
                }
                return JSON.stringify(checkedCoupons.map(it => ({
                    couponSendNoteGuid: it.couponSendGuid,
                    number: it.count
                })));
            },
            getTotalCount() {
                let total = 0;
                this.list[0].filter(x => x.enabled).forEach(item => {
                    total += item.number;
                });
                this.list[1].filter(x => x.enabled).forEach(item => {
                    total += item.number;
                });
                return total;
            },
            updateDjqListStatus() {
                let list = this.list[0];
                let checkedCoupons = list.filter(x => x.isCheck);
                if (!checkedCoupons.length) {
                    list.forEach(it => it.disabled = false);
                }
                if (!this.allowMuti) {//只允许一张
                    let isChecked = checkedCoupons.length === 1;
                    list.forEach(it => {
                        it.disabled = isChecked;
                        it.enableCount = 1;
                    });
                    if (isChecked) {
                        checkedCoupons[0].disabled = false;
                    }
                    return;
                }
                let currentMoney = Math.subtract(this.money, this.getCheckedMinValueSum(checkedCoupons));
                console.log('currentMoney', currentMoney);
                if (currentMoney < 0) {
                    currentMoney = 0;
                }
                list.forEach(it => {
                    let enableCount = 0;
                    if (!it.minConsumeValue) {
                        enableCount = it.number - it.count;
                    } else {
                        enableCount = Math.floor(currentMoney / it.minConsumeValue);
                    }
                    if (enableCount > (it.number - it.count)) {
                        enableCount = it.number - it.count;
                    }
                    it.enableCount = enableCount + it.count;
                    if (!it.isCheck) {
                        it.disabled = it.enableCount <= 0;
                    }
                    if (it.count === 0) {
                        it.isCheck = false;
                    }
                });
                return list;
            },
            getCheckedMinValueSum(checkedCoupons) {
                if (!checkedCoupons || !checkedCoupons.length) {
                    return 0;
                }
                let sumValue = 0;
                checkedCoupons.forEach(item => {
                    sumValue += Math.mult(item.minConsumeValue, item.count);
                });
                return sumValue;
            }
        },
        computed: {
            selectDiscount() {
                if (this.menuIndex === 0) {
                    let orderMaxYuan = Math.mult(
                        this.money,
                        this.discountParameter.couponConsumeMaxRate
                    );
                    let discount = 0;
                    this.list[this.menuIndex].filter(item => item.isCheck).forEach(item => {
                        discount += Math.mult(item.couponValue, item.count);
                    });
                    if (discount > orderMaxYuan) {
                        discount = orderMaxYuan;
                    }
                    discount = Math.changeToDecimal(discount, 2);
                    return discount;
                } else {
                    let checkedItem = this.list[1].find(x => x.isCheck);
                    if (!checkedItem) {
                        return 0;
                    }
                    let rate = Math.subtract(1, checkedItem.couponValue);
                    return Math.changeToDecimal(Math.mult(rate, this.money), 2);
                }
            },
            selectCount() {
                return this.list[this.menuIndex].filter(e => e.enabled && e.isCheck).reduce((total, item) => {
                    return item.count + total;
                }, 0);
            }
        },
        watch: {
            menuIndex(now, old) {
                if (now > old) {
                    this.transitionName = "left";
                }
                if (now < old) {
                    this.transitionName = "right";
                }
            },
            checkedCoupon(now) {
            },
            show(now) {
                // if (now) {
                //     document.body.style.height = "100%";
                // } else {
                //     document.body.style.height = "auto";
                // }
            }
        }
    };
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../../styles/variable";

    .coupon-action {
        background-color: #fff;
        border-radius: 8px 8px 0 0;

        .coupon-head {
            .menu-item {
                line-height: 47px;
                text-align: center;
                flex: 1;
                border-bottom: 1px solid transparent;

                &.active {
                    border-bottom-color: #ff9800;
                }
            }
        }

        .coupon-content {
            overflow: hidden;
            position: relative;
            height: 340px;
            padding-top: 36px;
            background-color: #f7f7f7;

            .tips {
                position: absolute;
                text-align: center;
                line-height: 36px;
                top: 0;
                left: 0;
                right: 0;
                font-size: 12px;
            }
        }

        .coupon-foot {
            position: relative;
            .shadow;

            .text {
                padding-left: 10px;
                .f12;
            }

            button {
                height: 48px;
                background-color: #ff9800;
                color: #fff;
                padding: 0 38px;
                position: absolute;
                top: 0;
                right: 0;
            }
        }
    }

    .left-enter,
    .right-leave-to {
        transform: translate3d(100%, 0, 0);
    }

    .left-enter-active,
    .left-leave-active {
        transition: 0.3s;
        position: absolute;
    }

    .right-enter,
    .left-leave-to {
        transform: translate3d(-100%, 0, 0);
    }

    .right-enter-active,
    .right-leave-active {
        transition: 0.3s;
        position: absolute;
    }

    .auto-pick {
        color: #fe9700;
        background-color: #fafafa;
        border: 0.026667rem solid #fe9700;
        padding: 0 0.2em;
        position: absolute;
        right: 0.266667rem;
        top: 0.2rem;
        font-size: 12px;
        line-height: 24px;
    }
</style>
