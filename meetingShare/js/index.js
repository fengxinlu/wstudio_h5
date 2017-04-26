var id = getUrlParam('id')
var origin_request = document.location.origin
var url = `${origin_request}/moc/v1/reservations/${id}/share`

$(function () {
    var inviterAvatar = $('.inviterAvatar img')
    var inviterName = $('.inviterName')
    var meetingTime = $('.meetingTime')
    var meetingName = $('#meetingName')
    var meetingAddress = $('#meetingAddress')
    var addressLink = $('.addressLink')
    var dpr = window.devicePixelRatio;
    var width = window.screen.width
    if(width*dpr <= 640){
        $('.meetingList span').css({'font-size':'20px'})
    }
    $.ajax({
        type: 'get',
        url: url,
        ContentType: 'application/json',
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                'Accept' , 'application/json'
            )
        },
        success: function (data) {
            var host = data.host
            var area_name = data.area_name
            var address = data.area.physical_address
            var latitude = data.area.latitude
            var longitude = data.area.longitude
            var start_at = data.start_at
            var end_at = data.end_at
            var timeShow = parseDate(start_at, end_at)
            var areaNameURI = encodeURIComponent(area_name)
            var addressURI =  encodeURIComponent(address)
            var addressUrl = `http://apis.map.qq.com/uri/v1/marker?marker=coord:${latitude},${longitude};title:${areaNameURI};addr:${addressURI}&referer=WStudio`
            inviterAvatar.attr('src',host.avatar)
            meetingTime.html(timeShow)
            inviterName.html(host.name)
            meetingName.html(area_name)
            meetingAddress.html(address)
            addressLink.attr('href',addressUrl)
        }
    })
})

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

function parseDate(start_at,end_at) {

    var s_startAt_R = start_at.substring(0, start_at.length - 15)
    var s_startAt_Date = s_startAt_R.substring(5, s_startAt_R.length)
    var start_month = s_startAt_Date.substring(0,s_startAt_Date.length - 3) //月数
    var start_day = s_startAt_Date.substring(3,s_startAt_Date.length) //天数

    var s_startAt_Time = start_at.substring(0, start_at.length - 9)
    s_startAt_Time = s_startAt_Time.substring(11, s_startAt_Time.length) //开始时间

    var s_endAt_Time = end_at.substring(0, end_at.length - 9)
    s_endAt_Time = s_endAt_Time.substring(11, s_endAt_Time.length) //结束时间

    var timeStr =  start_month+'月'+start_day+'日'+' '+s_startAt_Time+' '+'-'+' '+s_endAt_Time
    return timeStr
}
