const BTN_PIE = 'btnPie';
const DIV_PIE = 'divPie';
const CHART_CANVAS = 'CHART_CANVAS';
const CLOSE_POPUP = '.ui-dialog-titlebar-close';
const CHART_COLORS_26 = ["#f0a3ff", "#0075dc", "#993f00", "#4c005c", "#191919", "#005c31", "#2bce48", "#ffcc99", "#808080", "#94ffb5", "#8f7c00", "#9dcc00", "#c20088", "#003380", "#ffa405", "#ffa8bb", "#426600", "#ff0010", "#5ef1f2", "#00998f", "#e0ff66", "#740aff", "#990000", "#ffff80", "#ffff00", "#ff5005"];
const PIE_LOGO = 'PIE_LOGO';

function randColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	console.log(r);
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getColors(){
	var rgbs = [[240,163,255],[0,117,220],[153,63,0],[76,0,92],[25,25,25],[0,92,49],[43,206,72],[255,204,153],[128,128,128],[148,255,181],[143,124,0],[157,204,0],[194,0,136],[0,51,128],[255,164,5],[255,168,187],[66,102,0],[255,0,16],[94,241,242],[0,153,143],[224,255,102],[116,10,255],[153,0,0],[255,255,128],[255,255,0],[255,80,5]];
	var hexArr = [];
	for (var i = 0; i < rgbs.length; i++){
		hexArr.push(rgbToHex(rgbs[i][0],rgbs[i][1],rgbs[i][2]));
	}
	return hexArr;
}

function getDataPie(){

	var labels = [];
	var vals = [];
	var colors = CHART_COLORS_26.sort(function() { return 0.5 - Math.random() });;

	var wrapper = $("." + CLASS_WRAPPER);
	var items = wrapper.children("." + CLASS_ITEM);
	var total = 0;
	var used = 0;
	var hidingCoins = false;

	items.each( function(i, el){
		val = parseFloat($(el).find("." + CLASS_BTCVAL).text().trim());
		total += val;
	});

	items.each( function(i, el){
		val = parseFloat($(el).find("." + CLASS_BTCVAL).text().trim());
		if (val <= 0){
			return 'continue';
		}
		if (val <= total * .01){
			hidingCoins = true;
			return 'continue';
		}

		symbol = $(el).find("." + CLASS_SYMBOL).text().trim();
		name = $(el).find("." + CLASS_NAME).text().trim();

		labels.push(name);
		vals.push(val);
		if (labels.length > colors.length){
			colors.push(randColor());
		}
		used += val;
	});

	if (hidingCoins){
		labels.push("Other");
		vals.push(total - used);
		colors.push(randColor());
		colors.push(randColor());
	}

	var data = {
		labels: labels,
	    datasets: [{
	    	label: "Portfolio",
			data: vals,
			backgroundColor: colors
	    }]
	};

	return data;
}

function getOptionsPie(){
	var options = 
	{
		tooltips: {
			callbacks: {
				label: function(tooltipItem, data) {
					var dataset = data.datasets[tooltipItem.datasetIndex];
					var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
						return previousValue + currentValue;
					});
					var currentValue = dataset.data[tooltipItem.index];
					var precentage = Math.floor(((currentValue/total) * 100)+0.5);
					var name = data.labels[tooltipItem.index];

					return " " + name + " " + precentage + "%";
				}
			}
		},
		animation: {
			animateRotate: true
		}
	} 

	return options;
}

function createPopup(){
	var popup = $('<div/>', {
		id: DIV_PIE,
	});

	$('<img/>',{
		id:PIE_LOGO,
		src:chrome.extension.getURL('images/icon.png'),
		width:'22px',
		height:'22px',
		css: {
			'position':'absolute',
			'right':'10px',
			'bottom':'10px',
		}
	}).appendTo(popup);

	popup.appendTo($(document.body));

}

function showPopup(){
	$('#' + DIV_PIE).dialog({width: 660, height: 420, title: "Portfolio Holdings"});
	$(CLOSE_POPUP).removeClass('ui-button-icon-only') // allows replacement of image with text
	$(CLOSE_POPUP).html("X");

	var dataPie = getDataPie();
	var optionsPie = getOptionsPie();

	//remove old canvas
	$('#' + CHART_CANVAS).remove();

	//create new canvas
	var canvas = $('<canvas/>', {
		id: CHART_CANVAS
	});
	canvas.appendTo($('#' + DIV_PIE));

	//create chart anew.  causes animation to play each time popup is opened.
	var ctx = $('#' + CHART_CANVAS)[0].getContext('2d');
	var chart = new Chart(ctx, {
		type: 'pie',
		data: dataPie,
		options: optionsPie
	});
}

function createButton(){
	$('<button/>', {
    	id: BTN_PIE,
    	type: 'button',
    	text: PIE_SYMBOL,
    	css: {'width': '20px', 'height': '20px', 'margin-right': '5px', 'font-size': '17px', 'line-height': '5px'}
	}).prependTo($(".chargeWithdraw-title .f-fr .total"));

	$('#' + BTN_PIE).click(function(){
		showPopup();
	});
}

$(window).on('load', function () {

	createPopup();
	createButton();

});