
/*
	type - 校验是数字 还是 小数 {number,float} , length 限制的长度 ，target元素
	min - 最小数字 , max - 最大数字
*/
export default function({target,type="number",length=6,max=999999,min=0}){
  let val = target.value && target.value.trim();
  if(!val){
    return;
  }
  val = (+ val) + "";
  // 小数
  if(type === "float"){
    let tp = /^[0-9]+([.]{1}[0-9]+){0,1}$/.test(val);
    // 如果符合 格式
    if(tp){
      val = val.substring(0,length);
      if(val < min){
        val = min
      }else if(val > max){
        val = max;
      }
    }else{
      val = min;
    }
  // 整数
  }else{
    let tp = /^[1-9][0-9]*$/.test(val);
    // 如果符合 格式
    if(tp){
      val = val.substring(0,length);
      if(val < min){
        val = min
      }else if(val > max){
        val = max;
      }
    }else{
      val = min;
    }
  }
  target.value = val;
  return val;

};
