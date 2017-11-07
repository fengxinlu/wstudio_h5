var red_packet_id = getUrlParam('id')
var amount = getUrlParam('amount')
var origin_request = document.location.origin
var redPacketUrl = origin_request + '/moc/v1/coupons/red_packet'

$(function () {
    var phoneInput = $('.phone-input')
    var getBtn = $('.get-btn')
    var resultText = $('.result-text')
    var popover = $('.popup')
    var closeBtn = $('.close-btn')
    var red_envelope_num = $('.red_envelope_num')

    red_envelope_num.text(amount + '元')

    getBtn.on('click',function () {
        var phoneValue = phoneInput.val()
        if(!/^(0|86|17951)?[0-9]{11}$/i.test(phoneValue)){
            resultText.text('请输入有效电话号码')
            popover.css({display: 'flex'})
        }else if(red_packet_id){
            submitAjax(redPacketUrl,{red_packet_id: red_packet_id,phone_num : phoneValue})
        }else{
            alert('未知错误')
        }
    })

    closeBtn.on('click',function () {
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
                resultText.text('领取成功')
                popover.css({display: 'flex'})
            },
            error: function(xhr,type){
                var errorMessage = ''
                if(xhr.status == 0){
                    errorMessage = '领取红包失败，请重新刷新网络'
                }else{
                    errorMessage = JSON.parse(xhr.responseText)._error.message
                }
                resultText.text(errorMessage)
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