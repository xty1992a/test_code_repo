export default class CouponService {
    static checkCanUsePoint(money, options) {
        if (options.memberAvailablePoint <= 0) {
            return {
                success: false,
                type: 0
            };
        }
        if (options.memberAvailablePoint < options.canPaidPointForMemberPoint) {
            return {
                success: false,
                type: 1
            }
        }
        if (money < options.canPaidPointForConsumeValue) {
            return {
                success: false,
                type: 2
            }
        }
        return {
            success: true
        };
    }
}