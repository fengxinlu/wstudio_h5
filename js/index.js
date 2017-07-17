var sharing_code = getUrlParam('sharing_code')
var campaign_id = getUrlParam('campaign_id')
var origin_request = document.location.origin
var sharingUrl = origin_request + '/moc/v1/sharings'
var campaignUrl = origin_request + '/moc/v1/promo_codes'
var is_new_user = ''

$(function(){
    var dpr = window.devicePixelRatio
    var submitBtn = $('.submit')
    var phone = $('.phone_num')
    var popover = $('.popover')
    var closePopover = $('#close-popover')
    var popoverImg = $('.popover-img')
    var resultReason = $('.result-reason')
    var resultText = $('.result-text')
    var firstScreen = $('.firstScreen')[0]
    var nextScreen = $('#nextScreen')
    var closePopoverBtn= $('.close-popover-btn')
    //$('body').css({height: screen.height*dpr})

    phone.on('input',function (e) {
        var value = e.target.value
        if(value.length == 11){
            submitBtn.css({backgroundColor : '#0A62C3'})
        }else{
            submitBtn.css({backgroundColor : '#ccc'})
        }
    })

    submitBtn.on('click',function () {
        var phoneValue = phone.val()

        if(!/^(0|86|17951)?[0-9]{11}$/i.test(phoneValue)){
            resultReason.text('请输入有效电话号码')
            resultText.text('领取失败')
            popoverImg.attr({src : 'images/failed.png'})
            closePopover.addClass('close-popover_fail').removeClass('close-popover_success')
            popover.css({display: 'flex'})
        }else if(sharing_code){
            submitAjax(sharingUrl,{sharing_code: sharing_code,phone_num : phoneValue})
        }else if(campaign_id){
           submitAjax(campaignUrl,{campaign_id: campaign_id,phone_num : phoneValue})
        }else{
            alert('未知错误')
        }
    })
    closePopover.on('click',function(){
        popover.css({display: 'none'})
        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=io.kuban.robinson'
    })

    closePopoverBtn.on('click',function(){
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
});
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
