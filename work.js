javascript: (function() {

	/* Configuration */

	var time = 7.7;
	var locations = [ /* C : Client, O : CGI, T : Télétravail, NA : N/A */
		'NA', /* Dimanche */
		'C', /* Lundi */
		'C', /* Mardi */
		'C', /* Mercredi */
		'C', /* Jeudi */
		'C', /* Vendredi */
		'NA' /* Samedi */
	];

	/* Code */

	var documents = [document];
	var iframes = document.getElementsByTagName('iframe');
	for (var iframeIndex = 0; iframeIndex < iframes.length; iframeIndex++) {
		documents.push(iframes[iframeIndex].contentDocument);
	}
	var $ = function(selector) {
		selector = selector.substr(1).replace(/\\\$/g, '$');
		console.log(selector);
		for (var documentIndex = 0; documentIndex < documents.length; documentIndex++) {
			var elem = documents[documentIndex].getElementById(selector);
			if (elem) {
				return elem;
			}
		}
		console.log('not found');
		return null;
	};
	console.log(documents);

	/* TIMETABLE */
	var timeTable = $('#l0EX_TIME_DTL\\$0');

	var updateTime = function() {
		updateTimeOnLine(0);
	};
	var updateTimeOnLine = function(line) {
		for (var column = 2; column <= 6; column++) {
			setValue('TIME', column, line, time);
		}
	};

	var restTable = $('#UC_EX_TDLY_FR\\$scroll\\$0');

	var updateRestLunchLocation = function() {
		for (var column = 1; column <= 7; column++) {
			var location = locations[column - 1];
			updateRestOnColumn(column, location == 'NA' ? 'NA' : 'Y');
			updateLunchOnColumn(column, location == 'NA' ? 0 : 1);
			updateLocationOnColumn(column, location);
		}

		/* Overtime requested by manager */
		$('#UC_EX_TIME_FR_H_UC_OT_RQST_MNGR\\$0').value = 0;
		/* including Sunday hours */
		$('#UC_EX_TIME_FR_H_UC_OT_RM_SUNDAY\\$0').value = 0;
		/* including public holidays but Sunday */
		$('#UC_EX_TIME_FR_H_UC_OT_RM_PUBLIC_HO\\$0').value = 0;
	};

	var updateLunchOnColumn = function(column, value) {
		setValue('UC_TIME_LIN_WRK_UC_DAILYREST1', column, 0, value);
	};

	var updateRestOnColumn = function(column, value) {
		for (var line = 0; line < 3; line++) {
			setValue('UC_DAILYREST', column, line, value);
		}
	};

	var updateLocationOnColumn = function(column, value) {
		setValue('UC_LOCATION_A', column, 0, value);
		setValue('UC_LOCATION_A', column, 1, value);
	};

	var setValue = function(name, column, line, value) {
		var id = '#' + name + column + '\\$' + line;
		console.log(id);
		var elem = $(id);
		elem.value = value;
		elem.onchange();
	};

	if (timeTable) {
		updateTime();
	}
	if (restTable) {
		updateRestLunchLocation();
	}

})();
