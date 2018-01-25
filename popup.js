

$(function() {

  //set checkbox listeners
  $('#' + ID_CHECKBOX_USD).change(function(){
    if ($(this).is(':checked')) {
      chrome.storage.sync.set({[S_CURRENCY]: USD, [S_MIN_BALANCE]: 0.001}, function(){});
    } else {
      chrome.storage.sync.set({[S_CURRENCY]: BTC, [S_MIN_BALANCE]: 0.001}, function(){});    
    }
  });

  //get user preference from storage and set checkbox appropriately
  chrome.storage.sync.get([S_CURRENCY], function(items){
    if (items[S_CURRENCY] == USD) {
      $('#' + ID_CHECKBOX_USD).prop('checked', true);
    }
  });

});
