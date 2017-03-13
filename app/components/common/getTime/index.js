
import React from 'react';
import ReactDOM from 'react-dom';
// 格式化时间组件
class FormatTime extends React.Component{
	render(){
		var time = this.props.time;
        var format= this.props.format;
		function getMyDate(str){
        var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth()+1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime;
        if(format=="YYYY-MM-DD") {
          oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay);
        }else{
          oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay) +' '+ getzf(oHour) +':'+ getzf(oMin) +':'+getzf(oSen);//最后拼接时间
        };
        return oTime;
    };
    //补0操作
    function getzf(num){
        if(parseInt(num) < 10){
            num = '0'+num;
        }
        return num;
    }
		var formatTime = getMyDate(time);
		return(
			<span>
					{ formatTime }
			</span>
		)
	}
}
module.exports = FormatTime;
