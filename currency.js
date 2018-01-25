
function setBalancesUSD(){
	//get Binance's btc/usd conversion rate
	var vals = $(".f-fr .total strong");
	var btcVal = parseFloat(vals[0].innerText.replace(/[^0-9\.]/g, ''));
	var usdVal = parseFloat(vals[1].innerText.replace(/[^0-9\.]/g, ''));

	var rate = usdVal / btcVal;

	//replace BTC value of each coin with calculated USD value
	var items = $("." + CLASS_WRAPPER + " ." + CLASS_ITEM + " ." + CLASS_BTCVAL);
	items.each( function( i, el ){
		elBtc = parseFloat($(el).text());
		elUsd = (elBtc * rate).toFixed(2);
		$(el).text(elUsd);
	});

	var prevText = $(".th .items .equalValue").text();
	var newText = "USD ($) Value";

	// make sure to keep arrow
	if (prevText.indexOf(ARROW_DOWN) != -1){
		newText = newText + " " + ARROW_DOWN;
	}
	else if (prevText.indexOf(ARROW_UP) != -1) {
		newText = newText + " " + ARROW_UP;
	}

	$(".th .items .equalValue").text(newText);
}

$(window).on('load', function () {

	//check storage to see if user wants usd instead of btc
	  chrome.storage.sync.get([S_CURRENCY], function(items){
	    if (items[S_CURRENCY] == USD) {
	      setBalancesUSD();
	    }
	  });
});