
const SEARCH_INPUT = ".search_input .ng-valid";
const HIDE_CHECKBOX = ".balance_search #hidebalances";
const HIDE_LABEL = ".balance_search .f-fl .ng-binding";
const HIDE_WRAPPER = ".balance_search .f-fl";
const HIDE_TOOLTIP = ".iconfont.icon-wen.toolTip";
const HIDE_MINVAL = "inputMinVal"


function filterCoins(str, minVal){

	if (!$.isNumeric(minVal)) {
		minVal = 0;
	}
	str = str.toLowerCase();

	var wrapper = $("." + CLASS_WRAPPER);
	var items = wrapper.children("." + CLASS_ITEM);
	items.each( function(i, el){

		symbol = $(el).find("." + CLASS_SYMBOL).text().trim().toLowerCase();
		name = $(el).find("." + CLASS_NAME).text().trim().toLowerCase();
		val = parseFloat($(el).find("." + CLASS_BTCVAL).text().trim());

		if (symbol.indexOf(str) == -1 && name.indexOf(str) == -1){ //hide if doesn't contain string
			$(el).addClass("ng-hide");
		}
		else if (val < minVal){ //hide if val not high enough
			$(el).addClass("ng-hide");
		}
		else { //else, show
			$(el).removeClass("ng-hide");
		}
	});
}

function hideChecked(){
	return $(HIDE_CHECKBOX).is(':checked');
}

function minVal(){
	return (hideChecked() ? parseFloat($("#" + HIDE_MINVAL).val()) : 0);
}

function runFilter(){
	filterCoins($(SEARCH_INPUT).val(), minVal());
}

//update label text, input value based on user storage
function loadFromStorage(){
	chrome.storage.sync.get([S_CURRENCY, S_MIN_BALANCE, S_HIDE_CHECKED], function(items){
		
		//set label symbol
		sym = "(BTC)";
	    if (items[S_CURRENCY] == USD) {
			sym = "$";
	    }
		$(HIDE_LABEL).text("Hide assets less than " + sym + " ");

		//set min balance to display
		minBal = 0.001;
		if (typeof items[S_MIN_BALANCE] !== 'undefined'){
			minBal = items[S_MIN_BALANCE];
		}
		$('#' + HIDE_MINVAL).val(minBal);

		//set whether or not checkbox to hide balances is checked
		if (items[S_HIDE_CHECKED] === 'undefined' || items[S_HIDE_CHECKED]){
			$(HIDE_CHECKBOX).prop('checked', true);
		}
		else {
			$(HIDE_CHECKBOX).prop('checked', false);
		}

		runFilter();

	});
}

function removeListeners(){
	//remove native listeners
	var oldInput = $(SEARCH_INPUT);
	oldInput.replaceWith(oldInput.clone());

	var oldCheckbox = $(HIDE_CHECKBOX);
	oldCheckbox.replaceWith(oldCheckbox.clone());


}

function addListeners(){
	//add listener to search input field
	var input = $(SEARCH_INPUT);
	input.on('input', function() {
    	runFilter();
	});

	//add listener to checkbox
	var check = $(HIDE_CHECKBOX);
	check.on('change', function() {
		chrome.storage.sync.set({[S_HIDE_CHECKED]: hideChecked()}, function(){});
		runFilter();
	});

	//add listener to minimum input field
	input = $('#' + HIDE_MINVAL);
	input.on('input', function() {
		chrome.storage.sync.set({[S_MIN_BALANCE]: $(this).val()}, function(){});
    	runFilter();
	});
}

function createMinInput(){
	//add minimum input field
	$($(HIDE_WRAPPER)[1]).css({"width":"auto"});
	$('<input/>', {
    	id: HIDE_MINVAL,
    	type: 'number',
    	step: 'any',
    	min: '0',
    	css: {'cursor': 'auto', 'width': '40px'}
	}).appendTo($($(HIDE_WRAPPER)[1]));
}

$(window).on('load', function () {

	$(HIDE_TOOLTIP).hide(); //hide tooltip

	removeListeners();

	createMinInput()

	addListeners();

	loadFromStorage();

});