var sharing_code = getUrlParam('sharing_code')
var campaign_id = getUrlParam('campaign_id')
var origin_request = document.location.origin
var sharingUrl = origin_request + '/moc/v1/sharings'
var campaignUrl = origin_request + '/moc/v1/promo_codes'
var is_new_user = ''

$(function () {
    var phoneInput = $('.phone-input')
    var getBtn = $('.get-btn')
    var popover = $('.popover')
    var closePopover = $('#close-popover')
    var popoverImg = $('.popover-img')
    var resultReason = $('.result-reason')
    var resultText = $('.result-text')
    var closePopoverBtn= $('.close-popover-btn')

    getBtn.on('click',function () {
        var phoneValue = phoneInput.val()
        if(!/^(0|86|17951)?[0-9]{11}$/i.test(phoneValue)){
            resultReason.text('请输入有效电话号码')
            resultText.text('领取失败')
            popoverImg.attr({src : 'images/failed.png'})
            closePopover.addClass('close-popover_fail').removeClass('close-popover_success')
            popover.css({display: 'flex'})
        }else if(campaign_id){
            submitAjax(campaignUrl,{campaign_id: campaign_id,phone_num : phoneValue})
        }else if(sharing_code){
            submitAjax(sharingUrl,{sharing_code: sharing_code,phone_num : phoneValue})
        }else{
            alert('未知错误')
        }
    })

    closePopover.on('click',function(){
        popover.css({display: 'none'})
        window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI3NTYyMDA0MQ==&scene=110#wechat_redirect'
    })

    closePopoverBtn.on('click',function () {
        popover.css({display: 'none'})
    })

    function submitAjax(url,params){
        $.ajax({
            type: 'post',
            url: url,
            data : params,
            ContentType: 'application/json',
            dataType: 'json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    'Accept' , 'application/json'
                )
            },
            success: function(data){
                if(data.is_new_user){
                    is_new_user = data.is_new_user
                }
                popoverImg.attr({src : 'images/success.png'})
                resultText.text('领取成功')
                // resultReason.text('已领取优惠券，即可进入账户查看')
                resultReason.text('您的优惠券已兑换成功，请登录App查收')
                closePopover.addClass('close-popover_success').removeClass('close-popover_fail')
                popover.css({display: 'flex'})

            },
            error: function(xhr,type){
                var errorMessage = ''
                if(xhr.status == 0){
                    errorMessage = '领取优惠券失败，请重新刷新网络'
                }else{
                    errorMessage = JSON.parse(xhr.responseText)._error.message
                }
                resultReason.text(errorMessage)
                resultText.text('领取失败')
                popoverImg.attr({src : 'images/failed.png'})
                closePopover.addClass('close-popover_fail').removeClass('close-popover_success')
                popover.css({display: 'flex'})
            }
        })
    }
})
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}