javascript: (function() {

	/* Configuration */

	var time = 7;
	var locations = [ /* C : Client, O : CGI, T : Télétravail, NA : N/A */
		'NA', /* Dimanche */
		'NA', /* Lundi */
		'NA', /* Mardi */
		'NA', /* Mercredi */
		'NA', /* Jeudi */
		'NA', /* Vendredi */
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
	
	/*SUMMUARYTABLE*/
	var updateDeclaredHours = function() {
		var elem = $('#UC_EX_TIME_HDR_UC_SCHEDULED_HRS');
		elem.value = 0;		
	};
	var updateDeclaredHoursReason = function() {
		var elem = $('#UC_EX_TIME_HDR_UC_REASON_CODE');
		elem.value = 'MW_STAT';
		
	};

	/* TIMETABLE */
	var timeTable = $('#ACE_UI_WRK1_INFO1');

	var updateTime = function() {
		updateTimeOnLine(23);
	};
	var updateTimeOnLine = function(line) {
		for (var column = 2; column <= 6; column++) {
			setValue('POL_TIME', column, line, time);
		}
	};

	var restTable = $('#UC_EX_TDLY_FR\\$scroll\\$0');

	var updateRestLunchLocation = function() {
		for (var column = 1; column <= 7; column++) {
			var location = locations[column - 1];
			updateRestOnColumn(column);
			updateLunchOnColumn(column);
			updateLocationOnColumn(column, location);
		}

		/* Overtime requested by manager */
		$('#UC_EX_TIME_FR_H_UC_OT_RQST_MNGR\\$0').value = 0;
		/* including Sunday hours */
		$('#UC_EX_TIME_FR_H_UC_OT_RM_SUNDAY\\$0').value = 0;
		/* including public holidays but Sunday */
		$('#UC_EX_TIME_FR_H_UC_OT_RM_PUBLIC_HO\\$0').value = 0;
	};

	var updateLunchOnColumn = function(column) {
		var value = (column<7 && column>1) ? 1 :0;
		setValue('UC_TIME_LIN_WRK_UC_DAILYREST1', column, 0, value);
	};

	var updateRestOnColumn = function(column) {
		for (var line = 0; line < 3; line++) {
			var value;
			if(column>1 && column<7) {value='Y';}
			else {value='N';}
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
		updateDeclaredHours();
		updateDeclaredHoursReason();
	}
	if (restTable) {
		updateRestLunchLocation();
	}

})();
