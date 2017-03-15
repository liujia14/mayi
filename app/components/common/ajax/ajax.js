module.exports = function({type = "POST",success,error,url,data,async = true,cache = false}){
  $.ajax({
    type,
    success,
    error,
    url,
    data,
    async,
    cache,
    complete : (xhr,data) => {
            var head = xhr.responseText.indexOf('"code":"302"');
            if(head !== -1){
                location.reload();
            }
        }
  });
}