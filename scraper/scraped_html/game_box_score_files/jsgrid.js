/**
* jsgrids
* maybe the most lightweight jquery table plugin ever
* @author jenn schiffer
*/

(function($) {

	var pluginName = 'jsgrid';

	var defaults = {
		tableWidth : 'auto',
		freezeColumnCount : 0,
		datatype: "json",
		crossHoverOff : false,
		sortBy : null,
		sortOrder : null,
		paginationItems : true,
		columnOrder : "",
		pageSize : 1280
	};

	var classes = {
		outer : 'outer',
		inner : 'inner',
		cellValue : 'cell-value',
		crosshover : 'crosshover',
		frozen : 'frozen-cell',
		labels : 'labels',
		groups : 'groups',
		labelValue : 'label-value',
		footer : 'footer',
		header : 'header',
		sortableLabel : 'sortable',
		sortedByThis : 'sorted',
		sortOrderArrow : 'sort-order-arrow',
		sortedASC : 'asc',
		sortedDESC : 'desc',
		notRecord : 'not-records',
		totalsRow : 'totalsRow',
		footerID : 'footer',
		footerPagination : 'pagination',
		footerPaginationArrows : 'page-arrows',
		footerPaginationFirst : 'page-first',
		footerPaginationPrev : 'page-prev',
		footerPaginationNext : 'page-next',
		footerPaginationLast : 'page-last',
		footerPaginationInfo : 'page-info',
		firstColumn : 'col-first',
		firstRowNum : 'row-first',
		lastRowNum : 'row-last',
		totalRows : 'row-total',
		tooltipClass : 'tooltip',
		tooltipContentClass : 'tooltip-content',
		tooltipArrowClass : 'tooltip-arrow',
		colArrangeMode : 'colarrange',
		moreColumnsMode : 'morecolumns',
		addColumnPlus : 'add-column',
		colArrangeButton : 'colarrange-button',
		colArrangeResetButton : 'colarrange-reset-button',
		colArrangeMoreColumnsButton : 'colarrange-morecolumns-button',
		customHiddenColumn : 'custom-hidden-column',
		colControls : 'colarrange-controls',
		colControlsLeft : 'controls-left',
		colControlsHide : 'controls-close',
		colControlsRight : 'controls-right',
		hiddenColumnsShown : 'hidden-columns-shown',
		hiddenColumn : 'hidden-column',
		headerID : 'header',
		toPNGButton : 'toPNG',
		footerPaginationRowCountChoice : 'page-row-choice',
		footerPaginationPageNumbers : 'page-number-choice',
		footerPaginationChangePages : 'page-change-nav',
		paginationCurrent : 'current',
		pageNumberControls : 'page-number-controls',
		merged : 'merged',
		outerscroller : 'scroller-outer',
		hasOuterscroller : 'has-scroller-outer'
	};

	var assets = {
		toPNGButton : '',
	};

	var copy = {
		colArrangeModeOn : 'Arrange',
		colArrangeModeOff : 'Done',
		colArrangeReset : 'Reset Table',
		showCustomHiddenColumns : 'Include More Stats',
		showAllRowsPaginate : 'Paginate Items',
		asc : 'ASC',
		desc : 'DES',
		toPNGButton : 'Image',
		firstPageArrow : ' << ',
		prevPageArrow : ' < ',
		nextPageArrow : ' > ',
		lastPageArrow : ' >> '
	};
	
	var methods = {

	/*** INITIALIZE GRID ***/

		init : function(opts) {
			return this.each(function() {
				var $this = $(this).addClass(pluginName);
				var options = $.extend({}, defaults, opts);
				data = {
					$this : $this,
					originalOptions : options,
					datatype : options.datatype,
					datastr : options.datastr,
					gridName : options.gridName,
					columns : options.columns,
					tableWidth : options.tableWidth,
					tableHeight : options.tableHeight,
					minCellWidth : options.minCellWidth,
					freezeColumnCount : options.freezeColumnCount,
					rowsPerPage : options.rowsPerPage,
					groupHeaders : options.groupHeaders,
					colArrangeMode : options.colArrangeMode,
					colArrangeModeButtonID : options.colArrangeModeButtonID,
					crossHoverOff : options.crossHoverOff,
					hideFooter : options.hideFooter,
					toPNG : options.toPNG,
					sortBy : options.sortBy,
					sortOrder : options.sortOrder,
					pageNumber : options.pageNumber,
					disableCallback : options.disableCallback,
					paginationItems : options.paginationItems,
					paginationRowCountChoice : options.paginationRowCountChoice,
					columnOrder : options.columnOrder,
					hiddenColumnCount : 0,
					addMoreColumnsLabel: options.addMoreColumnsLabel,
					hideMoreColumnsLabel: options.hideMoreColumnsLabel,
					conditionalFormatting : options.conditionalFormatting
				};

				if ( typeof data.columnOrder === "string") {
					data.columnOrder = data.columnOrder.split(',');
				}

				var initPageNumber = data.pageNumber;

				$this.data(pluginName, data);

				// call header generation
				methods.generateHeader.call($this);

				// call footer generation
				methods.generateFooter.call($this);

				// call table generation
				methods.generateTable.call($this);


				/** Initial customization **/

				// sort
				if ( data.sortBy && data.sortOrder ) {
					methods.sortColumn.call($this, data.sortBy, data.sortOrder);
				}

				// page number
				if ( initPageNumber && data.rowsPerPage ) {
					methods.goToPage.call($this, initPageNumber);
				}

				// column arrangement
				if ( data.columnOrder && data.columnOrder.length > 0 && data.columnOrder[0] !== null ) {
					methods.setColumnOrder.call($this, data.columnOrder);
				}

				// conditional formatting
				if ( data.conditionalFormatting && data.conditionalFormatting.length > 0 && data.conditionalFormatting[0] !== null ) {
					for ( var i = 0; i < data.conditionalFormatting.length; i++ ) {
						methods.addConditionalFormatting.call($this, data.conditionalFormatting[i]);
					}
				}

			});
		},



	/*** BUILD GRID ***/

		generateTable : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }
			
			// generate table header row
			$this.append('<tr class="' + classes.labels + ' ' + classes.notRecord + '">');


			// generate and add cell headers to header row
			$.each(data.columns, function( index, value ){
				var cellHeader = methods.generateColumnHeaderCell.call($this, value);
				$this.find('tr.' + classes.labels).append(cellHeader);
			});

			// call method to generate records
			methods.generateRecordRows.call($this);

			// save original and different types of rows to data
			data.$colHeaderRow = $this.find('tr.'+classes.notRecord).eq(0);
			data.$originalColHeaderRow = $this.find('tr.'+classes.notRecord).eq(0);

			data.$records = $this.find('tr').not('.'+classes.notRecord).not('.'+classes.totalsRow);
			data.$originalRecords = $this.find('tr').not('.'+classes.notRecord);
			data.$allRows = $this.find('tr');
			data.$originalRows = $this.find('tr');
			data.$totalsRow = $this.find('tr.'+classes.totalsRow);
			$this.data(pluginName, data);

			// set table width if option given (always is, as there is a default right now to "auto")
			if ( data.tableWidth || data.tableHeight) {
				$this.wrap('<div class="' + pluginName + ' outer"><div class="' + pluginName + ' inner">');
				$this.parent().css('height', data.tableHeight);
			}

			// hidden columns
			data.$hiddenColumns = $this.find('.'+classes.hiddenColumn);

			// do initial style and refresh table
			methods.initGridStyle.call($this);
		},

		generateHeader : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// create footer
			$header = $('<div id="' + $this.attr('id') + '-' + classes.headerID + '">');

			// add header to table unless hideHeader is shown
			$this.before($header);

			if ( data.hideHeader ) {
				$header.hide();
			}

			$header.addClass(classes.header)
				.addClass(pluginName)
				.outerWidth( $this.find('.'+classes.labels).outerWidth() );

			// add header to data
			data.$header = $header;
			$this.data(pluginName, data);
		},

		generateFooter : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// create footer
			$footer = $('<div id="' + $this.attr('id') + '-' + classes.footerID + '">');

			// add footer to table unless hideFooter is shown
			$this.after($footer);

			if ( data.hideFooter ) {
				$footer.hide();
			}

			$footer.addClass(classes.footer)
				.addClass(pluginName)
				.outerWidth( $this.find('.'+classes.labels).outerWidth() );

			// add footer to data
			data.$footer = $footer;
			$this.data(pluginName, data);
		},

		generateColumnHeaderCell : function( cellOptions ) {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			var cellWidth, hiddenColumnClass;

			if ( cellOptions.hide === true && ( data.columnOrder.length === 0 || data.columnOrder[0] === "" ) ) {

				// col set as hidden and as custom hidden
				hiddenColumnClass = classes.hiddenColumn + ' ' + classes.customHiddenColumn;
			}
			else {
				hiddenColumnClass = '';
			}

			// create header cell and generate label
			var $cell = $('<th>');
			var labelValue = '<span class="' + classes.labelValue + '">' + cellOptions.label + '</span>';

			// get width
			if ( !cellOptions.width ) {
				if ( data.minCellWidth ) {
					cellWidth = data.minCellWidth;
				}
				else {
					cellWidth = "auto";
				}
			}
			else {
				cellWidth = cellOptions.width;
			}

			// set name as id, column position as class, and html as labelValue
			$cell.attr('id',cellOptions.name)
				.addClass('col-' + cellOptions.name)
				.addClass(hiddenColumnClass)
				.html('<div style="width:' + cellWidth + '">' + labelValue + '</div>');

			// add sortable class and arrows if sortable is set to true
			if ( cellOptions.sortable !== false ) {
				$cell.addClass(classes.sortableLabel);
				$cell.prepend('<div class="' + classes.sortOrderArrow + '">');
			}

			// add tooltip if set
			if ( cellOptions.tooltipOn && cellOptions.tooltipDesc && !IS_MOBILE) {
				// append tooltip
				var $tooltip = $('<div class="' + classes.tooltipClass + '">');
				var $tooltipTitle = $('<h3>').text(cellOptions.filterLabel).wrap('<div class="' + classes.tooltipContentClass + '">');
				var $tooltipDescription = $('<p>').text(cellOptions.tooltipDesc);
				var $tooltipArrow = $('<div class="' + classes.tooltipArrowClass + '"> </div>');
				$tooltip.append($tooltipTitle.parent().append($tooltipDescription).append($tooltipArrow)).hide();
				$cell.append($tooltip);
			}

			return $cell;
		},

		generateRecordRows : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			var recordRows = [];

			// generate rows for each record in json feed
			$.each(data.datastr, function( index, value){
				var rowIndex = index;
				var $rowData = $(this);
				
				// create new row object
				var $newRecord = $('<tr class="' + rowIndex + '">');

				if ( data.datatype == 'json' ) {
					// go through each column option to get the name of the cell we need
					$.each(data.columns, function( index, value ){
						// get the column data
						var $columnData = $(this)[0];

						if ( $columnData.hide === true ) {
						// cell set as hidden
							$columnData.hiddenColumnClass = classes.hiddenColumn;
						}
						else {
							$columnData.hiddenColumnClass = '';
						}
						
						// get the column name (eg: L)
						var columnName = $columnData.name;
		
						// generate new cell
						var $cell = methods.generateRecordCell.call($this, $columnData, rowIndex, $rowData[0][columnName], $rowData);
						
						// append cell to this record
						$newRecord.append($cell);
						
					});
				}
				else if ( data.datatype == 'jsonstring' ) {
						// go through each record from jsonstring and get cell data
						$.each($rowData, function( index, value ){
							var columnsOptions = data.columns[index];
							var cell = methods.generateRecordCell.call($this, columnsOptions, rowIndex, value, $(this));
							$newRecord.append(cell);
						});
					}

				// if cell name is noSortColumn, set parent class to notRecord
				if( $rowData[0].doNotSort) {
					$newRecord.addClass(classes.totalsRow);
				}

				//COMMENT DNP MERGE 
				if ( $rowData[0].COMMENT) {
					$newRecord.addClass(classes.merged);
					var cellMergeCount = 1;
					$newRecord.children('td').each(function(){
						var $cell = $(this);
						if ( $cell.attr('data-value') !== null && cellMergeCount > 2) {
							$cell.remove();
						}
						cellMergeCount++;
					});
					$newRecord.children('td').eq(1).addClass(classes.merged).attr('colspan', cellMergeCount - 2).css('text-align', 'center');
				}
				
				// push new row object to array
				recordRows.push( $newRecord );
			});

			// append new rows to table
			$this.append( recordRows );
		},

		generateRecordCell : function( cellOptions, rowIndex, cellValue, rowData ) {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			var hiddenColumnClass;

			if ( cellOptions.hide === true && ( data.columnOrder.length === 0 || data.columnOrder[0] === "" ) ) {
				// col set as hidden
				hiddenColumnClass = classes.hiddenColumn;
			}
			else {
				hiddenColumnClass = '';
			}

			// save original value for data attribute before formatting
			if ( cellValue === null || cellValue === "" ) {
				cellValue = " ";
			}
			var dataValue = cellValue;

			// if dataAs is set, set cellValue as a return from the call of that dataAs function
			if ( typeof cellOptions.dataAs == "function" ) {
				cellValue = cellOptions.dataAs(cellValue);
			}

			// if linkAs is set, set cellValue as a return fromt he call of that linkAs function
			if ( cellOptions.linkAs ) {
				cellValue = cellOptions.linkAs(cellValue, rowIndex, rowData);
			}

			// set a default for dataFormatType if not set
			if ( !cellOptions.dataFormatType ) {
				cellOptions.dataFormatType = 'text';
			}

			// create cell and add class col-, row-, dataFormatType; data-value attr; set html as cellValue
			var $cell = $('<td>');

			$cell.addClass('col-' + cellOptions.name)
				.addClass('row-' + rowIndex)
				.addClass('data-' + cellOptions.dataFormatType)
				.addClass(hiddenColumnClass)
				.attr('data-value', dataValue)
				.css({'width' : cellOptions.width, })
				.html(cellValue);

			return $cell;
		},



	/*** INIT POST-BUILD STYLING/BINDING ***/

		initGridStyle : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// set row count for pagination if rowsPerPage is given
			if ( data.rowsPerPage ) {
				methods.paginateTable.call($this, data.$originalRecords, data.rowsPerPage);
			}

			// initialize column rearrangement
			if ( data.colArrangeMode ) {
				methods.initColArrange.call($this);
			}

			// initialize toPNG if toPNG given
			if ( data.toPNG ) {
				methods.generateToPNGBUtton.call($this);
			}

			// set group headers if groupHeaders given
			if ( data.groupHeaders ) {
				methods.generateGroupHeaders.call($this);
			}

			// if inner < outer, add difference to width of first column
			var tableSizeDifference = $this.closest('.'+classes.outer).outerWidth() - $this.outerWidth();
			if ( tableSizeDifference > 0 ) {
				var $firstCol = $this.find('.'+classes.labelValue).eq(0).parent();
				var firstColWidth = $firstCol.outerWidth();
				$firstCol.css('width', firstColWidth + tableSizeDifference);
				$this.find('td').css('width','auto');
			}

			// refresh table with new styling
			methods.refreshTable.call($this);

			// set zebra striping if there are merged/frozen rows
			var $mergedRows = $('.' + classes.merged);
			if ( $mergedRows.length > 0 ) {
				var $firstMergedRow = $mergedRows.first();

				var prevRowIndex = $firstMergedRow.prev('tbody').find('tr:last-child').index();
				if ( prevRowIndex % 2 == 1 ) {
					$firstMergedRow.before('<tr></tr>');
				}
			}
		},
		

	/*** REFRESH GRID ***/

		refreshTable : function() {
			$this = $(this);
			data = $this.data(pluginName);

			// unbind everything
			$this.find('th').unbind();
			$this.find('td').unbind();

			// re-bind column header cell events
			methods.bindColHeaderEvents.call($this);

			// re-bind table cell events
			methods.bindCellEvents.call($this);

			// freeze columns
			methods.freezeColumns.call($this);

			// update first column
			$('tr').not('.'+classes.labels).each(function(){
				$(this).find('td:first').addClass(classes.firstColumn);
			});

			// move totals to bottom of grid
			if ( data.$totalsRow) {
				data.$totalsRow.insertAfter($this.find('tbody'));
			}

			// remove any items that should be hidden
			$this.find('.'+classes.hiddenColumn).hide();
		},

		bindColHeaderEvents : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// sort columns on click
			methods.bindSortColumns.call($this);

			// show tooltips on hover
			methods.bindTooltipColumns.call($this);

			// arrange columns when clicking control buttons/checkbox
			$this.find('.'+classes.colControlsLeft).unbind('click').click(function(e){
				methods.moveColumnLeft.call($this, $(this).closest('th').attr('id'));
				// rebuild columnOrder array
				methods.buildColumnOrderArray.call($this);
			});
			$this.find('.'+classes.colControlsRight).unbind('click').click(function(e){
				methods.moveColumnRight.call($this, $(this).closest('th').attr('id'));
				// rebuild columnOrder array
				methods.buildColumnOrderArray.call($this);
			});
			$this.find('.'+classes.colControlsHide).unbind('click').click(function(){
				methods.hideColumn.call($this, $(this).closest('th').attr('id'));
				// rebuild columnOrder array
				methods.buildColumnOrderArray.call($this);
			});

		},

		bindSortColumns : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }
			
			// sort columns on click
			$this.find('th.' + classes.sortableLabel).bind({
				click: function(e) {
					methods.sortColumn.call($this, $(this).attr('id'));
				}
			});
		},
		
		bindTooltipColumns : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			$this.find('th').bind({
				mouseenter: function(e) {
					var $cell = $(this);
					var $tooltip = $(this).find('.' + classes.tooltipClass).clone().addClass('tooltip-grid');
					$('body').append($tooltip);
					var position = $cell[0].getBoundingClientRect();
					var leftPos = position.left + $cell.width()/2 - $tooltip.width()/2;
					var topPos = position.top - 10;

					$tooltip.fadeIn('fast').css({
						'left' : leftPos + 'px',
						'top' : topPos - $tooltip.outerHeight() + 'px',
					});
				},

				mouseleave : function(e) {
					var toolTipClones = $('body').find('.tooltip-grid').remove();
				}
			});
		},

		bindCellEvents : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }
		
			// only add crosshover if not turned off and > 2 row (1 data + 1 header)
			if ( !data.crossHoverOff && $this.find('tr').length > 2 ) {
				// cross hover cells
				$this.find('td').bind({
					mouseenter: function() {
						var cellClasses = $(this).attr('class').split(' ');
						// only do vertical if not first column
						$this.find('.' + cellClasses[0]).not('th').not('.'+classes.merged).not('.'+classes.firstColumn).addClass(classes.crosshover);
						$this.find('.' + cellClasses[1]).not('th').addClass(classes.crosshover);
					},
					mouseleave: function() {
						$this.find('.' + classes.crosshover).removeClass(classes.crosshover);
					}
				});
			}
		},



	/*** PAGINATION ***/

		paginateTable : function( records, rowsPerPage ) {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }
			
			// add pagination info to grid object data
			data.pageNumber = 1;

			// get records - may be original or sorted
			var recordsToPaginate = records;

			// placeholder for paginated rows
			var paginatedRecords = [];

			// add first #rowsPerPage 
			for ( var i = 0; i < rowsPerPage; i++) {
				if ( recordsToPaginate[i] ) {
					paginatedRecords.push(recordsToPaginate[i]);
				}
			}

			// remove records if they exist
			if ( recordsToPaginate ) {
				recordsToPaginate.remove();
			}

			// add first page
			$this.append(paginatedRecords);

			// add tool to footer and update with current shown rows' info
			firstRowNum = 1;
			lastRowNum = paginatedRecords.length;

			if ( data.$totalsRow.length >=1 ) {
				lastRowNum -= 1;
			}
			
			if ( paginatedRecords < 1 ) {
				data.pageFirstRowNum = 0;
			}
			else {
				data.pageFirstRowNum = firstRowNum;
			}
			data.pageLastRowNum = lastRowNum;

			data.numberOfPages = Math.ceil(data.$records.length / rowsPerPage);
			data.rowsPerPage = rowsPerPage;

			// set pagination status
			if ( rowsPerPage == data.rowsPerPage ) {
				data.gridIsPaginated = true;
			}
			else {
				data.gridIsPaginated = false;
			}

			$this.data(pluginName, data);

			// set up and update new pagination controls
			methods.setPaginationControls.call($this);
			methods.updatePaginationControls.call($this);

			// refresh table
			methods.refreshTable.call($this);

			// callback 
			if ( typeof $.pageChanged == 'function' && !data.disableCallback ) {
				$.pageChanged( data.pageNumber, rowsPerPage );
			}
		},

		setPaginationControls : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			data.$pageNumberChoices = $('<div class="' + classes.pageNumberControls + '">');

			// remove pagination controls if they exist
			if (data.$paginationControls) {
				data.$paginationControls.remove();
			}
			// append pagination controls to footer
			data.$footer.append('<div class="' + classes.footerPagination + '">');
			var $paginationControls = data.$footer.find('.'+classes.footerPagination);

			// append info blocks to controller
			var $pageChangeNav = $('<div class="' + classes.footerPaginationChangePages + '">');
			$firstPage = $('<a>').attr('class', classes.footerPaginationFirst).addClass(classes.footerPaginationArrows).html(copy.firstPageArrow);
			$prevPage = $('<a>').attr('class', classes.footerPaginationPrev).addClass(classes.footerPaginationArrows).html(copy.prevPageArrow);
			$nextPage = $('<a>').attr('class', classes.footerPaginationNext).addClass(classes.footerPaginationArrows).html(copy.nextPageArrow);
			$lastPage = $('<a>').attr('class', classes.footerPaginationLast).addClass(classes.footerPaginationArrows).html(copy.lastPageArrow);
			
			$pageChangeNav.append($firstPage, $prevPage, data.$pageNumberChoices, $nextPage, $lastPage);

			$paginationControls.append($pageChangeNav);

			// set pagination arrows
			methods.setPaginationArrows.call($this);

			// save pagination controls to data
			data.$paginationControls = $paginationControls;
			$this.data(pluginName, data);

			// set page number choices
			methods.setPaginationControlsPageNumbers.call($this);

			// append item count unless turned off
			if ( data.paginationItems ) {
				methods.createPaginationControlsItems.call($this);
			}

			// append row count choice unless turned off
			if ( data.paginationRowCountChoice ) {
				methods.createPaginationRowCountChoice.call($this);
			}
		},

		createPaginationControlsItems : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// generation html for info part of controller
			var firstNumHTML = '<span class="' + classes.firstRowNum + '"></span>';
			var lastNumHTML = '<span class="' + classes.lastRowNum + '"></span>';
			var totalNumHTML = '<span class="' + classes.totalRows + '"></span>';
			$pageInfo = $('<div>').attr('class', classes.footerPaginationInfo).html(firstNumHTML + '-' + lastNumHTML + ' of ' + totalNumHTML + ' items' );

			// save pagination controls to data
			data.$paginationControls.append($pageInfo);
			$this.data(pluginName, data);
		},

		createPaginationRowCountChoice : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			var optionCount = data.paginationRowCountChoice.length;
			var arrayOfChoices = [];

			for ( var i = 0; i < optionCount; i++ ) {
				arrayOfChoices.push('<a class="' + data.paginationRowCountChoice[i] + '">' + data.paginationRowCountChoice[i] + '</a>');

				if ( i != optionCount - 1 ) {
					arrayOfChoices.push(' | ');
				}
			}

			data.$rowCountChoice = $('<div>').attr('class', classes.footerPaginationRowCountChoice).append(arrayOfChoices);
			
			data.$rowCountChoice.find('a').click(function(){
				var newRowCount = $(this).text();
				if ( newRowCount.toLowerCase() == 'all' ) {
					newRowCount = data.$records.length;
				}
				methods.paginateTable.call($this, data.$records, newRowCount);
			});

			// save pagination controls to data
			data.$paginationControls.append(data.$rowCountChoice);
			$this.data(pluginName, data);
		},

		updatePaginationControls : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			if ( data.paginationItems) {
				// update info in pagination controls
				data.$paginationControls.find('.'+classes.firstRowNum).text(data.pageFirstRowNum);
				data.$paginationControls.find('.'+classes.lastRowNum).text(data.pageLastRowNum);
				data.$paginationControls.find('.'+classes.totalRows).text(data.$records.length);

				if ( data.$totalsRow.length >= 1 ) {
					data.$paginationControls.find('.'+classes.totalRows).text(data.$records.length + data.$totalsRow.length - 1);
				}
			}

			// update row count choice
			if ( data.$rowCountChoice ) {
				data.$rowCountChoice.find('a').removeClass(classes.paginationCurrent);
				data.$rowCountChoice.find('a.'+data.rowsPerPage).addClass(classes.paginationCurrent);

				if ( data.rowsPerPage == data.$records.length ) {
					data.$rowCountChoice.find('a:last-child').addClass(classes.paginationCurrent);
				}
			}

			// update pagination arrows
			methods.setPaginationArrows.call($this);

			// update page number controls
			methods.setPaginationControlsPageNumbers.call($this);
		},

		setPaginationControlsPageNumbers : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			if ( data.numberOfPages <= 1 ) {
				return;
			}

			var pageNumbers = [];

			// show 4 page numbers at a time
			var maxNumbersToShow = 3; // shows this +1 number of page numbers
			var currentPageNum = parseInt(data.pageNumber, 10);
			var currentTotalPages = parseInt(data.numberOfPages, 10);
			var maxPageToShow = Math.min(currentTotalPages, currentPageNum + maxNumbersToShow);
			var minPageToShow = Math.min(currentPageNum - 1, maxPageToShow - maxNumbersToShow);

			if ( minPageToShow === 0 ) {
				minPageToShow = 1;
				maxPageToShow++;
			}

			if ( currentTotalPages <= maxNumbersToShow ) {
				minPageToShow = 1;
				maxPageToShow = currentTotalPages;
			}

			if ( currentPageNum >= currentTotalPages - maxNumbersToShow ) {
				minPageToShow = currentTotalPages - maxNumbersToShow - 1;
			}
	
			var current;
			for ( var i = minPageToShow; i <= maxPageToShow;  i++ ) {

				if ( i == currentPageNum ) {
					current = " " + classes.paginationCurrent;
				}
				else {
					current = "";
				}

				if ( i > 0 ) {
					pageNumbers.push(' <a class="' + i + current + '">' + i + '</a> ');
				}
			}

			data.$pageNumberChoices.html(pageNumbers);
			methods.bindPageNumbers.call($this);
		},

		bindPageNumbers : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			var pageNumberLinks = data.$footer.find('.'+classes.footerPaginationChangePages+' a');
			pageNumberLinks.unbind('click').click(function(){


				var newPageNumber = $(this).text();
				if ( !isNaN(newPageNumber) ){
					methods.goToPage.call($this, newPageNumber);
				}
				else {

					switch(newPageNumber) {
						case copy.firstPageArrow:
							methods.firstPage.call($this, $this);
							break;
						
						case copy.lastPageArrow:
							methods.lastPage.call($this, $this);
							break;
						
						case copy.prevPageArrow:
							methods.prevPage.call($this, $this);
							break;
						
						case copy.nextPageArrow:
							methods.nextPage.call($this, $this);
							break;
					}
				}
			});
		},

		setPaginationArrows : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			data.$footer.find('.'+classes.footerPaginationArrows).show();

			if ( data.pageLastRowNum >= data.$records.length ) {
				data.$footer.find('.'+classes.footerPaginationNext).hide();
				data.$footer.find('.'+classes.footerPaginationLast).hide();
			}

			if ( data.pageFirstRowNum <= 1 ) {
				data.$footer.find('.'+classes.footerPaginationPrev).hide();
				data.$footer.find('.'+classes.footerPaginationFirst).hide();
			}
		},

		firstPage : function(jsgridTable) {
			$this = jsgridTable;
			data = $this.data(pluginName);

			if ( data.pageNumber <= 1 ) {
				return false;
			}
			
			methods.goToPage.call($this, 1);
		},

		lastPage : function(jsgridTable) {
			$this = jsgridTable;
			data = $this.data(pluginName);

			if ( data.pageNumber >= data.numberOfPages ) {
				return false;
			}
			
			methods.goToPage.call($this, data.numberOfPages);
		},

		nextPage : function(jsgridTable) {
			$this = jsgridTable;
			data = $this.data(pluginName);

			if ( data.pageNumber >= data.numberOfPages ) {
				return false;
			}

			data.pageNumber++;
			methods.goToPage.call($this, data.pageNumber );
		},

		prevPage : function(jsgridTable) {
			$this = jsgridTable;
			data = $this.data(pluginName);

			if ( data.pageNumber <= 1 ) {
				return false;
			}
			
			data.pageNumber--;
			methods.goToPage.call($this, data.pageNumber);
		},

		goToPage : function(pageNumber) {
			$this = $(this);
			data = $this.data(pluginName);
			
			// move to next page
			data.pageNumber = pageNumber;

			// only continue if pageNumber is valid
			if ( pageNumber < 1 || pageNumber > data.numberOfPages ) {
				return;
			}

			$this.find('tr').not('.'+classes.notRecord).remove();
			var paginatedRows = [];

			var newFirstRowNum = (pageNumber - 1) * (data.rowsPerPage) + 1;

			var newLastRowNum = pageNumber * data.rowsPerPage;

			if ( data.$totalsRow.length >= 1 ) {
				newLastRowNum -= 1;
			}

			if (newLastRowNum > data.$records.length) {
				newLastRowNum = data.$records.length;
			}

			// get new page's records
			for ( var i = newFirstRowNum - 1; i < newLastRowNum; i++) {
				if ( data.$records[i] ) {
					paginatedRows.push(data.$records[i]);
				}
			}

			// add rows to table
			data.$colHeaderRow.after(paginatedRows);

			// increase row numbers, then update data
			data.pageFirstRowNum = newFirstRowNum;
			data.pageLastRowNum = newLastRowNum;

			// update data
			$this.data(pluginName, data);

			// update pagination controls
			methods.updatePaginationControls.call($this);
			
			// refresh table
			methods.refreshTable.call($this);

			// callback 
			if ( typeof $.pageChanged == 'function' && !data.disableCallback ) {
				$.pageChanged( data.pageNumber, data.rowsPerPage );
			}
		},



	/*** SORTING ***/
		sortColumn : function( sortableHeaderName, order ) {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }


			// parameter is the header of the column being sorted
			var $colHeader = $this.find('#'+sortableHeaderName);
			var cellSortingClass = 'col-' + $colHeader.attr('id');

			// if column name or valid order values do not exist, return
			if (!$colHeader && ( order != copy.asc && order != copy.desc ) ) {
				return;
			}

			var recordsToSort = data.$records;
			var sortedRecords, sortOrder;

			if ( $colHeader.hasClass(classes.sortedDESC) || order == copy.asc)  {
				// sorted by DESC or told to order by ASC => sort by ASC
				$this.find('th').removeClass(classes.sortedDESC).removeClass(classes.sortedASC);
				$colHeader.addClass(classes.sortedASC);
				sortedRecords = methods.generateSortedRecords.call($this, recordsToSort, cellSortingClass, classes.sortedASC);
				sortOrder = copy.asc;
			}
			else {
					// sorted by ASC or told to order by DESC => sort by DESC
					$this.find('th').removeClass(classes.sortedDESC).removeClass(classes.sortedASC);
					$colHeader.addClass(classes.sortedDESC);
					sortedRecords = methods.generateSortedRecords.call($this, recordsToSort, cellSortingClass, classes.sortedDESC);
					sortOrder = copy.desc;
				}

			// remove current records and append sorted ones
			if ( recordsToSort ) {
				recordsToSort.remove();
			}

			// update column headers to reflect which one the table is sorted by
			$('.' + classes.sortedByThis).removeClass(classes.sortedByThis);
			$colHeader.addClass(classes.sortedByThis);
			

			// set records to be newly sorted records
			data.$records = sortedRecords;

			// set sortedBy and sortOrder info
			data.$sortedByColumnHeader = $colHeader;
			data.sortOrder = sortOrder;
			$this.data(pluginName, data);

			// re-paginate table
			if ( data.gridIsPaginated === true ) {
				methods.paginateTable.call($this, data.$records, data.rowsPerPage);
			}
			else {
				methods.paginateTable.call($this, data.$records, data.$records.length);
			}

			// refresh table
			methods.refreshTable.call($this);

			// callback 
			if ( typeof $.columnSorted == 'function' && !data.disableCallback ) {
				$.columnSorted( sortableHeaderName, sortOrder );
			}
		},

		generateSortedRecords : function( records, sortClass, order ) {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			var alpha, beta;

			if ( !records ) {
				return;
			}

			var	sortedRecords = records.sort( function(a,b) {
				alpha = $(a).find('td.' + sortClass).data('value');
				beta = $(b).find('td.' + sortClass).data('value');

				if ( order == classes.sortedASC) {
					// sort ascending
					return (alpha > beta || !alpha) ? 1 : -1;
				}
				else {
					// sort descending					
					return (beta > alpha || !alpha) ? 1 : -1;
				}
			});

			return sortedRecords;
		},



	/*** COLUMN ARRANGEMENT ***/
		
		initColArrange : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }
			
			// create or bind event to existing button
			methods.generateColArrangeButton.call($this);
			
			// set colarrangemode to be off
			data.colArrangeMode = false;
			data.moreColumnsMode = false;
			$this.data(pluginName, data);

			// html for controls
			var left = '<div class="' + classes.colControlsLeft + '"> &lt; </div>';
			var right = '<div class="' + classes.colControlsRight + '"> &gt; </div>';
			//var hide = '<input type="checkbox" class="' + classes.colControlsHide + '" checked />';
			var hide = '<div class="' + classes.colControlsHide + '"> X </div>';
			var thisControl = '<div class="' + classes.colControls + '">' + left + hide + right + '</div>';

			// add controls to each column headers and hide
			$this.find('th').each(function() {
				$(this).prepend(thisControl);
			});
		},

		bindColArrangeButtonEvents : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			data.$colArrangeButton.click(function(){
				if ( !data.colArrangeMode ) {
					methods.colArrangeModeOn.call($this);
				}
				else {
					methods.colArrangeModeOff.call($this);
				}
			});

			data.$colArrangeResetButton.click(function(){
				methods.resetColumns.call($this);
			});

			data.$colArrangeMoreColumnsButton.click(function(){
				methods.showCustomHiddenColumns.call($this);
			});
		},

		generateColArrangeButton : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// check for custom button
			var moreColumnsButtonHTML;
			if ( data.addMoreColumnsLabel &&  ( data.columnOrder.length === 0 || data.columnOrder[0] === "" )  ) {
				moreColumnsButtonHTML = '<input type="submit" class="' + classes.colArrangeMoreColumnsButton + '" id="' + classes.colArrangeMoreColumnsButton + '-' + $this.attr('id') + '" value="' + data.addMoreColumnsLabel + '" />';
			}
			else {
				moreColumnsButtonHTML = '';
			}

			// create button and save to data
			data.$header.prepend('<input type="submit" class="' + classes.colArrangeButton + '" id="' + classes.colArrangeButton + '-' + $this.attr('id') + '" value="' + copy.colArrangeModeOn + '" />' +
								'<input type="submit" class="' + classes.colArrangeResetButton + '" id="' + classes.colArrangeResetButton + '-' + $this.attr('id') + '"value="' + copy.colArrangeReset + '" />' +
								moreColumnsButtonHTML);

			var $button = $('#' + classes.colArrangeButton + '-' + $this.attr('id'));
			var $reset = $('#' + classes.colArrangeResetButton + '-' + $this.attr('id'));
			var $moreColumns = $('#' + classes.colArrangeMoreColumnsButton + '-' + $this.attr('id'));
			
			// save button to data
			data.$colArrangeModeButtonID = $button.attr('id');
			data.$colArrangeResetButtonID = $reset.attr('id');
			data.$colArrangeMoreColumnsButtonID = $moreColumns.attr('id');
			data.$colArrangeButton = $button;
			data.$colArrangeResetButton = $reset;
			data.$colArrangeMoreColumnsButton = $moreColumns;
			$this.data(pluginName, data);

			// bind events
			methods.bindColArrangeButtonEvents.call($this);
		},

		colArrangeModeOff : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// change header state
			data.$header.removeClass(classes.colArrangeMode);

			// hide controls and hidden columns for both this page and other page columns
			$this.find('.' + classes.colControls).hide();
			data.$records.find('.' + classes.hiddenColumn).hide();
			$this.find('.' + classes.hiddenColumn).hide();

			// change colArrangeMode button value
			data.$colArrangeButton.val(copy.colArrangeModeOn);

			data.colArrangeMode = false;

			methods.freezeColumns.call($this);

			// save data
			$this.data(pluginName, data);

			// rebind default column headers
			methods.bindSortColumns.call($this);
			methods.bindTooltipColumns.call($this);

			methods.refreshTable.call($this);

			// set scrollersAnywhere if set up
			methods.setScrollersAnywere.call($this);
		},

		colArrangeModeOn : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// change header state
			data.$header.addClass(classes.colArrangeMode);

			// unbind column headers
			data.$colHeaderRow.find('th').unbind();

			// show controls and hidden columns for both this page and other page columns
			$this.find('.' + classes.colControls).show();

			// change colArrangeMode button value
			data.$colArrangeButton.val(copy.colArrangeModeOff);

			data.colArrangeMode = true;

			// hide controls on any frozen headers
			$('th.'+classes.frozen).find('.'+classes.colControls).hide();

			methods.freezeColumns.call($this);
			
			// save data
			$this.data(pluginName, data);
		},

		showCustomHiddenColumns : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// hide button 
			data.$colArrangeMoreColumnsButton.hide();

			// for each custom hidden column, show them
			var hiddenColumns = $this.find('.'+classes.customHiddenColumn);
			hiddenColumns.each(function(){
				var colHeaderName = $(this).closest('.'+classes.hiddenColumn).attr('id');
				methods.showColumn.call($this, colHeaderName);
			});

			// set scrollersAnywhere if set up
			methods.setScrollersAnywere.call($this);

			// rebind events
			methods.refreshTable.call($this);
		},

		moveColumnLeft : function( colHeaderName ) {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// get this header's position
			var $colHeader = $this.find('#'+colHeaderName);
			var position = $colHeader.index();

			// can't move first item further left
			if ( position <= data.freezeColumnCount ) {
				return;
			}
			
			var moveColumnCellsLeft = function() {
				data.$allRows.each(function() {
					// save array of this row's cells
					var $thisRowCells = $(this).children();

					// create a temporary array to hold new cell order
					var arrangedRowCells = [];

					// rearrange cells
					$thisRowCells.each(function(i){

						if ( i == position - 1 ) {
							// if cell is before the column moving left
							arrangedRowCells.push($(this).next());
						}
						else if ( i == position ) {
								// if cell is column moving left
								arrangedRowCells.push($(this).prev());
							}
							else {
								arrangedRowCells.push($(this));
							}
					});

					// remove old cells and replace with rearranged ones
					$(this).children().remove();
					$(this).append(arrangedRowCells);
				});
			};

			if ( $colHeader.prev('th').hasClass(classes.hiddenColumn) ) {
				moveColumnCellsLeft();

				methods.moveColumnLeft.call($this, colHeaderName);
			}
			else {
				moveColumnCellsLeft();

				// rebind events
				methods.refreshTable.call($this);

				// unbind column headers
				data.$colHeaderRow.find('th').unbind();
			}
		},

		moveColumnRight : function( colHeaderName ) {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// get this header's position
			var $colHeader = $this.find('#'+colHeaderName);
			var position = $colHeader.index();

			// can't move last item further right
			if ( position >= $this.find('th').length - 1 ) {
				return;
			}
			
			var moveColumnCellsRight = function() {
				data.$allRows.each(function() {

					// save array of this row's cells
					var $thisRowCells = $(this).children();

					// create a temporary array to hold new cell order
					var arrangedRowCells = [];

					// rearrange cells
					$thisRowCells.each(function(i){

						if ( i == position ) {
							arrangedRowCells.push($(this).next());
						}
						else if ( i == position + 1 ) {
								arrangedRowCells.push($(this).prev());
							}
							else {
								arrangedRowCells.push($(this));
							}
					});

					// remove old cells and replace with rearranged ones
					$(this).children().remove();
					$(this).append(arrangedRowCells);
				});
			};

			if ( $colHeader.next('th').hasClass(classes.hiddenColumn) ) {
				moveColumnCellsRight();

				methods.moveColumnRight.call($this, colHeaderName);
			}
			else {
				moveColumnCellsRight();

				// rebind events
				methods.refreshTable.call($this);

				// unbind column headers
				data.$colHeaderRow.find('th').unbind();
			}
		},

		hideColumn : function( colHeaderName ) {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// get this header's position
			var $colHeader = $this.find('#'+colHeaderName);
			var cellClasses = $colHeader.attr('class').split(' ');

			// set hidden class to all cells in column
			data.$records.find('.' + cellClasses[0]).addClass(classes.hiddenColumn).hide();
			$this.find('.' + cellClasses[0]).addClass(classes.hiddenColumn).addClass(classes.hiddenColumn).hide();

			// set up scrollersanywhere if set up
			methods.setScrollersAnywere.call($this);
		},

		showColumn : function( colHeaderName ) {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// get this header's position
			var $colHeader = $this.find('#'+colHeaderName);
			var cellClasses = $colHeader.attr('class').split(' ');

			// remove add column +
			$colHeader.find('.'+classes.addColumnPlus).remove();

			// remove hidden class to all cells in column
			data.$records.find('.' + cellClasses[0]).removeClass(classes.hiddenColumn).show();
			$this.find('.' + cellClasses[0]).removeClass(classes.hiddenColumn).show();

			// rebuild columnOrder array
			methods.buildColumnOrderArray.call($this);
		},

		resetColumns : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			var $columns = data.$colHeaderRow.find('th');

			// show all columns
			data.columnOrder.length = 0;
			$this.data(pluginName, data);

									
			// callback 
			if ( typeof $.columnArranged == 'function' && !data.disableCallback ) {
				$.columnArranged( data.columnOrder );
			}
	
			methods.resetGrid.call($this);

			// turn col arrange back on
			methods.colArrangeModeOn.call($this);

			// make all input for show/hide columns checked
			$this.find('input:checkbox').attr('checked',true);

			// rebuild columnOrder array
			methods.buildColumnOrderArray.call($this);

			// set scrollersAnywhere if set up
			methods.setScrollersAnywere.call($this);
		},

		setColumnOrder : function( columnOrder ) {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			if ( columnOrder.length < 1 || columnOrder[0] === null || columnOrder[0] === "" ) {
				return;
			}

			// for each column not in columnOrder, hide it
			var $visibleColumns = data.$colHeaderRow.find('th').not('.'+classes.hiddenColumn);

			$visibleColumns.each(function(i){
				var colID = $(this).attr('id');
				var colIndex = columnOrder.indexOf(colID);

				if ( colIndex == -1 ) {
					methods.hideColumn.call($this, colID);
				}
			});

			// rearrange columns
			$visibleColumns = data.$colHeaderRow.find('th').not('.'+classes.hiddenColumn);

			$visibleColumns.each(function(i){
				var colID = $(this).attr('id');
				var colIndex = columnOrder.indexOf(colID);
				var colArray = data.$colHeaderRow.find('th').not('.'+classes.hiddenColumn).get();
				var currentIndex = colArray.indexOf($(this)[0]);

				if ( colIndex != i || colIndex != currentIndex) {
					methods.sortColumns.call($this, currentIndex, colIndex, colID);
				}
			});

			// rebind events
			methods.refreshTable.call($this);

			// rebuild columnOrder array
			methods.buildColumnOrderArray.call($this);
		},

		sortColumns : function(fromIndex, toIndex, columnID) {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			if ( fromIndex == toIndex ) {
				// we done here
				return;
			}
			else if ( fromIndex < toIndex ) {
					methods.moveColumnRight.call($this, columnID);
					if ( toIndex != fromIndex+1 ) {
						methods.sortColumns.call($this, fromIndex+1, toIndex, columnID);
					}
				}
				else if ( fromIndex > toIndex ) {
						methods.moveColumnLeft.call($this, columnID);
						if ( toIndex != fromIndex-1 ) {
							methods.sortColumns.call($this, fromIndex-1, toIndex, columnID);
						}
					}
		},

		buildColumnOrderArray : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// update columnOrder
			if ( data.columnOrder ) {
				data.columnOrder.length = 0;
			}
			else {
				data.columnOrder = [];
			}

			data.$colHeaderRow.find('th').not('.'+classes.hiddenColumn).each(function(){
				data.columnOrder.push($(this).attr('id'));
			});
			$this.data(pluginName, data);

			// callback 
			if ( typeof $.columnArranged == 'function' && !data.disableCallback ) {
				$.columnArranged( data.columnOrder );
			}
		},



	/*** TO PNG ***/

		generateToPNGBUtton : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }
			
			// create button and save to data
			data.$header.prepend('<input type="submit" class="' + classes.toPNGButton + '" id="' + classes.toPNGButton + '-' + $this.attr('id') + '" value="' + copy.toPNGButton + '" />');
			var $button = $('#' + classes.toPNGButton + '-' + $this.attr('id'));
			
			// save button to data
			data.$toPNGButton = $button;
			data.toPNGButtonID = $button.attr('id');
			$this.data(pluginName, data);

			// bind events
			methods.bindToPNGButtonEvents.call($this);
		},

		bindToPNGButtonEvents : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			data.$toPNGButton.click(function(){
				if ( typeof $.downloadPNG == 'function' ) {
					$.downloadPNG($this.attr('id'));
				}
			});
		},



	/*** CONDITIONAL FORMATTING ***/

		addConditionalFormatting : function(value) {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			console.log("init value",value);

			// test value
			value = 'FGA*>=*20*yellow';

			var valueSplit = value.split('*');
			var valueObject = {
				column: valueSplit[0],
				conditional: valueSplit[1],
				comparisonNumber: valueSplit[2],
				color: valueSplit[3]
			};

			var $cells = $('td.col-'+valueObject.column);

			switch ( valueObject.conditional ) {
				case '>':
					conditionalGreaterThan();
					break;
				case '<':
					conditionalLessThan();
					break;
				case '>=':
					conditionalGreaterThan();
					conditionalEqualTo();
					break;
				case '<=':
					conditionalLessThan();
					conditionalEqualTo();
					break;
				case '=':
					conditionalEqualTo();
					break;
				case '!=':
					conditionalNotEqualTo();
			}

			function conditionalGreaterThan() {
				$cells.each(function(){
					var $cell = $(this);
					var cellData = $cell.attr('data-value');

					if ( cellData > valueObject.comparisonNumber ) {
						$cell.css('background', valueObject.color);
					}
				});
			}

			function conditionalLessThan() {
				$cells.each(function(){
					var $cell = $(this);
					var cellData = $cell.attr('data-value');

					if ( cellData < valueObject.comparisonNumber ) {
						$cell.css('background', valueObject.color);
					}
				});
			}

			function conditionalEqualTo() {
				$cells.each(function(){
					var $cell = $(this);
					var cellData = $cell.attr('data-value');

					if ( cellData == valueObject.comparisonNumber ) {
						$cell.css('background', valueObject.color);
					}
				});
			}

			function conditionalNotEqualTo() {
				$cells.each(function(){
					var $cell = $(this);
					var cellData = $cell.attr('data-value');

					if ( cellData != valueObject.comparisonNumber ) {
						$cell.css('background', valueObject.color);
					}
				});
			}
		},

		resetConditionalFormatting : function(value) {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// remove background-color attributes
			$this.find('td').each(function(){
				$(this).removeAttr('background-color');
			});
		},

	/*** MISC GRID OPTIONS ***/

		freezeColumns : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			if ( data.freezeColumnCount < 1 ) {
				return;
			}

			// set frozen-cell class to the frozen columns
			for (var i = 0; i < data.freezeColumnCount; i++ ) {
				$this.find('tr').each(function(){
					var cell = $(this).children().eq(i);
					cell.addClass(classes.frozen);
				});
			}

			// if firefox, we need to block the cells and not allow more than one frozen column
			if( data.freezeColumnCount <= 1 ){
				var $frozenColumns = $this.find('.' + classes.frozen);
				$frozenColumns.css({'display' : 'block', 'height' : 'auto' });

				// set 
				var maxHeaderHeight = methods.getHeightForFrozenColumnHeader.call($this);
				$frozenColumns.not('td').outerHeight(maxHeaderHeight - 1);

				$frozenColumns.not('th').each(function(){
					var frozenCell = $(this);

					frozenCell.outerHeight( Math.max(frozenCell.parent().height()) );
				});
			}

			// set scroll functions
			$this.parent().scroll( function(){
				var leftPos = $(this).scrollLeft();
				var topPos = $(this).scrollTop();

				var frozenColumns = $this.find('.' + classes.frozen);

				if ( leftPos < 1 ) {
					$this.find('.' + classes.frozen).css({
						'position' : 'static',
					});
				}
				else {
					frozenColumns.css({
						'position' : 'relative',
						'left' : leftPos - 1 + 'px',
					});
				}
					
			});
			
			// scroll a bit to make sure every frozen cell shows
			var currentPos = $this.parent().scrollLeft();
			$this.parent().scrollLeft(currentPos+1).scrollLeft(currentPos-1).scrollLeft(currentPos);
		},

		getHeightForFrozenColumnHeader : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			var maxHeight = 0;
			// get max height of all table headers
			$this.find('th').each(function(){
				maxHeight = Math.max(maxHeight, $(this).outerHeight());
			});

			return maxHeight;
		},

		generateGroupHeaders : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }
			
			var skipColumns = data.groupHeaders.skip;
			var columnSpan = data.groupHeaders.colspan;
			var columnNames = data.groupHeaders.labels;

			// prepend th to table
			$this.prepend('<tr class="' + classes.groups + ' ' +  classes.notRecord + '">').css({
				//'position' : 'relative',
				'top' : '0'
			});
			var $groupHeadersRow = $this.find('.' + classes.groups);

			// see if we need to skip columns
			if ( skipColumns > 0 ) {
				$groupHeadersRow.append('<th colspan="' + skipColumns + '">');
			}

			// create group column for each name
			$.each( columnNames, function(index, value){
				$groupHeadersRow.append('<th colspan="' + columnSpan + '">' + value + '</th>');
			});
		},



	/*** GETTERS, SETTERS, HELPERS, KILLERS ***/

		setScrollersAnywere : function() {
			var $this = $(this);
			var data = $this.data(pluginName);

			$('.scroller-outer').remove();
			if( !IS_MOBILE && $this.width() > defaults.pageSize && $this.hasClass(classes.hasOuterscroller) ){
				// remove any outerscroller
				var $outerScroller = $this.closest('.inner');
				$this.scrollersAnywhere({
					scrollerLocation : {
						element : $outerScroller.parent(),
						placeWhere : 'before',
					},
					scrollerID : 'top-scroll-' + $this.attr('id'),
					innerWidth : $this.width(),
					outerWidth : '100%',
					nativeScrollerLocation : $outerScroller,
				});
			}
		},

		getGrid : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// simply returns the entire data object
			return data;
		},

		destroyGrid : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			data.$outerScroller = data.$header.siblings('.'+classes.outerscroller);

			var $grid = $this;
			var $gridFooter = data.$footer;
			var $gridHeader = data.$header;

			if($grid) {
				$grid.empty();
				$grid.unwrap();
				$grid.unwrap();
			}
			if($gridFooter) {
				$gridFooter.remove();
			}
			if($gridHeader) {
				$gridHeader.empty().remove();
			}

			if(data.$outerScroller) {
				data.$outerScroller.empty().remove();
			}
		},

		resetGrid : function() {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// get original options
			var options = data.originalOptions;

			// empty original options columnOrder so all columns show
			options.columnOrder = [];

			// kill and rebuild grid with original options
			methods.destroyGrid.call($this);
			methods.init.call($this, options);

			// call back to video annotation text
			if ( typeof $.jsGridReset == 'function') {
				$.jsGridReset();
			}

			// set scrollersAnywhere if set up
			methods.setScrollersAnywere.call($this);
		},

		buildFilteredGrid : function( filteredData ) {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) { return; }

			// get original options
			var options = data.originalOptions;

			// set options data to be filteredData
			options.datastr = filteredData;
			
			if ( data.$sortedByColumnHeader ) {
				options.sortBy = data.$sortedByColumnHeader.attr('id');
			}
			if ( data.sortOrder ) {
				options.sortOrder = data.sortOrder;
			}
			if ( data.columnOrder ) {
				options.columnOrder = data.columnOrder;
			}

			// kill and rebuild grid with original options
			methods.destroyGrid.call($this);
			methods.init.call($this, options);
		}


	};


    /*** MODULE DEFINITION ***/
    $.fn[pluginName] = function (method) {

        if ( methods[method] ) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this,arguments);
        } else {
            $.error('Method ' + method + ' does not exist');
        }
    };

})( jQuery );