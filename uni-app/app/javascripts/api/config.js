/**
 * Created by TY-xie on 2017/10/17.
 */
// Member
export const ADDMEMBERADDRESS_URL = "/Member/AddMemberAddress";
export const DELETEMEMBERADDRESS_URL = "/Member/DeleteMemberAddressByGuids";
export const EDITMEMBERADDRESS_URL = "/Member/UpdateMemberAddress";
export const GetMemberPoint_URL = "/Member/GetMemberPointNotePaged";

// gift
export const GetGIFTORDERLIST_URL = "/Gift/GetGiftOrderPagedNew";

// booking
export const GETBESPEAKLIST_URL = "/booking/GetActivityList";
export const BOOKINGSUBMITORDER_URL = "/Booking/SubmitOrder";
export const GETBOOKINGORDERLIST_URL = "/Booking/GetOrderList";
export const BOOKINGCANCELORDER_URL = "/Booking/CancelOrder";
export const BOOKINGREVIEWPOST_URL = "/Booking/ReviewPost";
export const CHECKBOOKINGTIME_URL = "/Booking/CheckBookingTime";
export const GETBOOKINGTIMECOUNT_URL = "/Booking/GetBookingTimeCount";

// GroupBuy
export const GETGROUPBUYLIST_URL = "/GroupBuy/GetGroupBuyList";
export const GROUPBUYBUYORDER_URL = "/GroupBuy/BuyOrder";
export const GROUPBUYORDREBUY_URL = "/Pay/SubmitGroupBuyOrder";
export const GROUPBUYPAY_URL = "/GroupBuy/Pay";
export const GETGROUPORDERLIST_URL = "/GroupBuy/GetOrders";
export const GETTICKETSLIST_URL = "/GroupBuy/GetTickets";
export const SUBMITREFUND_URL = "/GroupBuy/SubmitRefund";
export const CANCELREFUND_URL = "/GroupBuy/CancelRefund";

//Store
export const GETSTORELIST_URL = "/Store/GetStoreList";
export const GETCOUNTRYLIST = "/Store/GetRegionList";
export const GETDROPDOWNLIST_URL = "/Store/GetDropDownListData";
export const GETCHAINSTORELIST_URL = "/Store/GetChainStoreList";
export const GETCOUNTIES_URL = "/Store/GetCounties";

//Recommend
export const GETRECOMMENDPAGE_LIST = "/Recommend/GetRecommendPage";
export const GETWITHDRAWS_LIST = "/Recommend/GetWithdraws";
export const WITHDRAWSPOST_URL = "/Recommend/WithdrawsPost";
export const GETNEWSHARECODE_URL = "/Recommend/GetNewShareCode";

//Business
export const BINDBYMOBILE_URL = "/Business/BindByMobileAction";
export const BINDBYCARD_URL = "/Business/BindByCardAction";
export const GETSMSCHECKCODE_URL = "/Business/GetSmsCheckCodeNew";
export const GETSMSCHECKCODEANDVALIDATEMEMBER_URL =
    "/Business/GetSmsCheckCodeAndValidateMember";
export const GETADVERTISEFLOATLIST_URL = "/Business/GetAdvertiseFloatList";
export const REGISTER_URL = "/Business/Register";
export const CHECKRECOMMENT_URL = "/Business/CheckRecomment";

//CityBenefit
export const GETCOUPONLIST_URL = "/CityBenefit/LoadCouponPage";
export const GETCONSUMELIST_URL = "/CityBenefit/LoadComsumePage";
export const GETCOUPONCOUNTANDCARDCOUNT_URL ="/CityBenefit/LoadCouponCountAndCardCount";
export const GETADDVALUELIST_URL = "/CityBenefit/LoadMemberAddValuePage";
export const GETCUPON_URL = "/CityBenefit/GetCupon";
export const GETCUPONLIST_URL = "/CityBenefit/GetCouponPage";
export const GETCARDLIST_URL = "/CityBenefit/GetVipPage";
export const GETCOUPONPACKAGE_URL = "/CityBenefit/GetCouponPackage";

// CountMall
export const GETCOUNTLIST_URL = "/CountMall/GetCountItemList";
export const GETCOUNTITEMORDER_URL = "/CountMall/GetCountItemOrder";
export const DELETEGOODSITEMORDER_URL = "/CountMall/DeleteGoodsItemOrder";
export const COUNTMALLBUY_URL = "/CountMall/Buy";
export const GETMEMBERCOUNTNOTE_URL = "/CountMall/GetMemberCountNotePaged";
export const GETMEMBERAVAILABLE_URL = "/CountMall/GetMemberAvailableCountPaged";
export const GETMEMBERADDCOUNTITEM_URL = "/CountMall/GetMemberAddCountItem";
export const GETAVAILABLEUSECOUNTMALL_URL ="/CountMall/GetAvailableUseCountMall";
export const CONFIGUSECOUNTMALL_URL = "/CountMall/ConfigUseCountMall";

// Coupon
export const GETCOUPONPAGED_URL = "/Coupon/GetCouponPaged";
export const GETONLINECUPON_URL = "/Coupon/GetCupon";
export const GETMEMBERCOUPONLIST_URL ="/Coupon/GetMemberCouponByMemberGuidPaged";
export const GETCOUPONSTORE_URL = "/Coupon/GetStore";
export const SUBMITORDER_URL = "/Coupon/SubmitOrder";
export const GETCOUPONSHARERECOR_URL = "/Coupon/GetCouponShareRecordPage";
export const QUICKREGISTERANDGETCOUPONd_URL ="/Coupon/QuickRegisterAndGetCoupon";
export const GETCOUPONGIFT_URL = "/Coupon/GetCouponGift";
export const UPDATAWXSHARE_URL = "//Coupon/UpdataWxShareJs";
export const COUPONGIFTNUMBER_URL = "/Coupon/CouponGiftNumber";
export const GETCOUPONPACKAGELIST_URL = "/Coupon/GetCouponPackageList";
export const COUNT_GETAVAILABLECOUPONS_URL = "/Coupon/GetAvailableCoupons";
export const USECOUPON_URL = "/Coupon/UseCoupon";
export const GETLISTQRCODE_URL = "/Coupon/GetCouponListQRCode";
export const GETCOUNTLISTQRCODE_URL = "/Coupon/GetCountListQRCode";

// Game
export const GETPRIZE_URL = "/Game/GetPrize";
export const OPENLUCKYWALLET_URL = "/Game/OpenLuckyWallet";
export const GETLUCKYWALLETNOTEPAGE_URL = "/Game/GetLuckyWalletNotePage";
// Business
export const GETBUSINESSINFO_URL = "/Business/GetBusinessInfo";

// Business
export const GETFEEDBACKLIST_URL = "/Business/GetFeedbackList";
export const SENDMEMO_URL = "/Business/Feeback";

// Member
export const GETCONMEMBERSUMELIST_URL = "/Member/GetConsumeList";
export const GETMEMBERVALUENOTE_URL = "/Member/GetMemberValueNotePaged";
export const GETINVOICE_URL = "/Member/GetInvoice";
export const GETMEMBERGOODSNOTEDETAILS_URL ="/Member/GetMemberGoodsNoteDetails";
export const GETCOLLECTPOINTNOTE_URL = "/Member/GetCollectPointNotePage";
export const DEFAULTMEMBERADDVALUE_URL = "/Member/GetRechargeJson";
export const MEMBERADDVALUE_URL = "/Member/GetVlueRuleChargeJson";
export const COMPLETEINFO_URL = "/Member/CompleteInfo";
export const GETSHORTMENU_URL = "/Business/GetShortMenu";
export const CHANGPASSWORD_URL = "/Member/ChangePassword";
export const CHANGEPASSWORDFORVIPCLOUD_URL = "/Member/ChangePasswordForVipcloud";
export const ADDCOMMENT_URL = "/Member/AddComment";

// 
export const GETADVERTISEHOMELIST_URL = "/Business/GetAdvertiseHomeList";
export const BINDSELECTEDMEMBERMOBILE_URL = "/Member/BindSelectedMemberMobile";
export const UNBINDSUBMIT = "/Member/UnbindSubmit";
export const SUBMITMEMBERCARDORDER_URL = "/Member/SubmitMemberCardOrder";

// Shop
export const PAGE_SIZE = 2;
export const ORDERFIELD = "SellCount"; 
export const ORDERTYPE = "DESC"; 

export const HEAD_URL = "/api/Shop/GetIndexAdvResponse";
export const INDEX_LIST_URL = "/api/Shop/GetCategoryAndGoodsItem";
export const DETAIL_URL = "/api/Shop/GetGoodsDetailBase";
export const SKU_URL = "/api/Shop/GetGoodsDetailSku";
export const GROUPSPLICE_URL = "/api/Shop/GetGoodsDetailGroupSplice";
export const EDITSHOPCART_URL = "/api/Shop/EditGoodsItemShopCart";
export const GETCATEGORY_URL = "/api/Shop/GetCategory";
export const SECONDCATEGORY_URL = "/api/Shop/GetSecondCategory";
export const GETGOODSORDER_URL = "/api/Shop/GetGoodsOrder";
export const GOODSITEMS_URL = "/api/Shop/GetGoodsItems";
export const GETSHOPCARTS_URL = "/api/Shop/GetShopCarts";
export const DELETESHOPCARTS_URL = "/api/Shop/DeleteGoodsItemShopCart";
export const GETGOODSORDERDETAIL_URL = "/api/Shop/GetGoodsOrderDetail";
export const GETRELATIONCATEGORY_URL = "/api/Shop/GetRelationCategory";
export const GETBILLREFUND_URL = "/api/Shop/GetBillRefund";
export const MALL_SUBMITREFUND_URL = "/api/Shop/SubmitRefund";
export const MALL_CANCELREFUND_URL = "/api/Shop/CancelRefund";
export const GETGROUPSPLICE_URL = "/api/Shop/GetGroupSplice";
export const GETSHOPCARTNUMBER_URL = "/api/Shop/GetShopCartCount";
export const GETSPLICES_URL = "/api/Shop/GetSplices";

export const COUPONDETAIL_URL = "/Coupon/CouponDetail";
export const GET_REGISTER_RUL = "/api/Common/GetRecruitApplyUrl";
export const MALL_GETCOUPONLIST_URL = "/api/Shop/GetCouponList";
export const GETCOUPON_URL = "/api/Shop/GetCoupon";
export const GETEXISTSORDER_URL = "/api/Shop/GetExistsOrder";
export const GETORDERINFO_URL = "/api/Shop/GetOrderInfo";
export const GETAVAILABLECOUPONS_URL = "/api/Shop/GetAvailableCoupons";
export const GETMEMBERPAYINFO_URL = "/api/Shop/GetMemberPayInfo";
export const GETFREIGHTFEE_URL = "/api/Shop/GetFreightFee";
export const GETCHAINSTORES_URL = "/api/Shop/GetChainStores";
export const GOODSORDERSUBMIT_URL = "/api/Shop/GoodsOrderSubmit";
export const GETPARAMETERS_URL = "/api/Shop/GetParameters";
export const GETSUCCESSRESPONSE_URL = "/api/Shop/GetSuccessResponse";
export const GETMEMBERADDRESS_URL = "/api/Common/GetMemberAddress";
export const MALL_ADDMEMBERADDRESS_URL = "/api/Common/AddMemberAddress";
export const MALL_DELETEMEMBERADDRESS_URL = "/api/Common/DeleteMemberAddress";
export const MALL_EDITMEMBERADDRESS_URL = "/api/Common/EditMemberAddress";
export const GEINTERFACESTATUS_URL = "/api/Common/GeInterfaceStatus";
export const CANCELGOODSBILLORDER_URL = "/api/Shop/CancelGoodsBillOrder";
export const GETTEMPLATE_URL = "/api/Shop/GetTemplate";
export const GETSHAREDATA_URL = "/api/Common/GetShareData";
export const GETCOPYRIGHTDATA_URL = "/api/Common/GetCopyRightData";
export const GETFLOATDATA_URL = "/api/Common/GetFloatData";
export const GETSHARECONFIG_URL = "/api/Common/GetShareConfig";
export const GETORDERNOTICEINFO_URL = "/api/shop/getOrderNoticeInfo";
export const ASSIGNCHAINSTORE_URL = "/api/Shop/AssignChainStore";
export const MALL_ADDWXMEMBERADDRESS_URL = '/api/Common/AddWxMemberAddress'

export const GETORDERCODELIST_URL = "/api/Shop/GetOrderCodeList";
export const VERIFYSELFPICKORDER_URL = "/api/Shop/VerifySelfPickOrder";
export const CONFIRMGOODS_URL = "/api/Shop/ConfirmGoods";
export const GETREFUNDORDERLIST_URL = "/api/Shop/GetRefundOrderList";
export const GETQRCODEURL_URL = "/api/Shop/GetQrCodeUrl";

export const GETORDERSTATUSSTATISTICS_URL = "/Shop/GetOrderStatusStatistics";

// Custom
export const GETGOODSITEMONLINELIST_URL = "/Shop/GetGoodsItemOnlineList";
export const GETGROUPSPLICELIST_URL = "/Shop/GetGroupSpliceList";
export const SHOP_GETCOUPONLIST_URL = "/Coupon/GetCouponList";

//count

export const COUNTSUBMIT_URL = "/Coupon/Submit";
export const GETMYCOUPON_URL = "/Count/GetMyCoupon";
export const GETCOUNTORDER_URL = "/Coupon/GetOrder";
export const GETUSEDRECORD_URL = "/Count/GetUsedRecord";

export const GETCHILDCARDLIST_URL = "/ChildCard/GetChildCardList";
export const UPDATELIMITVALUE_URL = "/ChildCard/UpdateLimitValue";
export const GETMEBMERINFO_URL = "/ChildCard/GetMebmerInfo";
export const GETCONSUMENOTELIST_URL = "/ChildCard/GetConsumeNoteList";
export const GETINVOICERECORDLIST = "/Member/GetInvoiceRecordList";
export const GETINVOICENOTRECORDLIST = "/Member/GetInvoiceNotRecordList";
export const CHILDCARDBIND_URL = "/ChildCard/Bind";
export const CHILDCARDUNBIND_URL = "/ChildCard/UnBind";

//common
export const UPLOADSINGLEIMAGE_URL = "/Common/UploadSingleImage";

//gameCatch
export const STARTGAME_URL = "/Game/StartGame";
export const CMPLETEGAMECATCH_URL = "/Game/CmpleteGameCatch";
export const HELPSTARTGAME_URL = "/Game/HelpStartGame";
export const HELPCMPLETEGAMECATCH_URL = "/Game/HelpCmpleteGameCatch";
export const GAMECATCHLISTPAGE_URL = "/Game/GameCatchListPage";
export const PAGEROOT_URL = "/Game/PageRoot";
export const SENDPRIZE_URL = "/Game/SendPrize";

//Upay
export const GETORDERSTATUS_URL = "/Upay/GetOrderStatus";
export const GETPAYCOUPONS_URL = "/Upay/GetPayCoupons";
export const TRYUPDATELUCKDRAWSENDNOTEMEMBERGUID_URL ="/Upay/TryUpdateLuckDrawSendNoteMemberGuid";
export const GETADVERTISE_URL = "/Upay/GetAdvertise";
export const GETCOLLECTPOINTSTATUS_URL = "/Upay/GetCollectPointStatus";
export const GETCOUPONDISTANCE_URL = "/Upay/GetCouponDistance";
export const UPAYOPENLUCKYWALLET_URL = "/Upay/OpenLuckyWallet";
export const GETLUCKDRAWMONEY_URL = "/Upay/GetLuckDrawMoney";
export const GETACTIVITYANDCOLLECTPOINT_URL = "/Upay/GetActivityAndCollectPoint";

export const GETSMSCODE_URL = 'business/GetSmsCode';
