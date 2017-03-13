module.exports = function({type = "POST",success,error,url,data,async = true,cache = false}){
  $.ajax({
    type,
    success,
    error,
    url,
    data,
    async,
    cache
  });
}