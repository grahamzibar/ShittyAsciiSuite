function Blip(_row, _column) {
	var _value = Blip.EMPTY;
	
	this.set_value = function(val) {
		_value = val;
	};
	
	this.get_value = function() {
		return _value;
	};
	
	this.clear = function() {
		_value = Blip.EMPTY;
	};
	
	this.get_coordinates = function() {
		return {
			'row': _row,
			'col': _column
		};
	};
	
	this.toString = function() {
		var o = '[';
		o += _row;
		o += ', ';
		o += _column
		o += '] ';
		o += _value;
		return o;
	};
};
Blip.EMPTY = -1;

function Grid(_width, _height) {
	var _blips = Grid.new_grid(_width, _height);
	
	function __constructor__() {
		for (var i = 0, r = _blips, l = _width; i < l; i++) {
			var c = r[i] = new Array();
			for (var j = 0, m = _height; j < m; j++)
				c[j] = new Blip(i, j);
		}
	};
	
	this.get_blips = function() {
		return _blips;
	};
	
	this.get_blip = function(row, col) {
		return _blips[row][col];
	};
	
	__constructor__();
};
Grid.new_grid = function(rows_num, cols_num) {
	var rows = new Array(rows_num);
	
	for (var i = 0, len = rows.length; i < len; i++)
		rows[i] = new Array(cols_num);
	
	return rows;
};

function Entity(_num) {
	this.code = _num;
	this.toString = function(n) {
		return n;
	}.bind(this, _num > -1 ? '&#' + _num + ';' : 'DEL');
};

function Toolbar() {
	var RANGES = [
		[33, 126],
		[128, 128],
		[131, 131],
		[133, 140],
		[145, 156],
		[161, 172],
		[175, 887],
		[890, 894],
		[900, 906],
		[910, 929],
		[931, 1200],
		[1201, 1319],
		[1329, 1366],
		[1377, 1415],
		[1488, 1514],
		[1520, 1524],
		[1984, 2023],
		[4053, 4056],
		[5024, 5108],
		[5121, 5226],
		[5572, 5595],
		[5761, 5782],
		[8251, 8286],
		[8414, 8416],
		[8544, 8582],
		[8585, 8585],
		[8592, 8724],
		[8853, 8879],
		[8900, 8985],
		[9096, 9191],
		// **
		[9548, 9747],
		[9750, 9798],
		[9812, 9854],
		[9856, 9874],
		[9876, 9884],
		[9985, 9988],
		[9996, 10059],
		[10063, 10066],
		[10070, 10070],
		[10197, 10239],
		[10496, 10546],
		[10999, 11000],
		[11026, 11033],
		[11568, 11621],
		[19904, 19967],
		[63488, 63500],
		[63549, 63549],
		[63553, 63563],
		[119040, 119048],
		[119056, 119057],
		[119239, 119246],
		[119296, 119353],
		[119552, 119638],
		[119648, 119665],
		[120120, 120171],
		[120488, 120831]
	];
	this.tools = new Array();
	
	function __constructor__() {
		this.tools[0] = new Entity(-1);
		for (var i = 0, r = RANGES, l = r.length; i < l; i++) {
			for (var j = r[i][0], m = r[i][1] + 1; j < m; j++) {
				var entity = new Entity(j);
				this.tools[this.tools.length] = entity;
			}
		}
	};
	
	this.toString = function() {
		var o = '';
		for (var i = 0, t = this.tools, l = t.length; i < l; i++) {
			o += t[i].code;
			o += ': ';
			o += t[i];
			o += '\n';
		}
		return o;
	}.bind(this);
	
	__constructor__.call(this);
};

function ToolbarController(_view, _model) {
	var _selected = null;
	
	function __constructor__() {
		var entities = _model.tools;
		for (var i = 0, l = entities.length; i < l; i++) {
			var btn = document.createElement('button');
			var e = entities[i];
			btn.title = 'code: ' + e.code;
			btn.setAttribute('rel', e.code);
			btn.innerHTML = e;
			_view.appendChild(btn);
			
			if (i === 0) {
				_selected = btn;
				btn.disabled = true;
			}
		}
		_view.addEventListener('click', onclick, false);
	};
	
	function onclick(e) {
		_selected.disabled = false;
		var t = _selected = e.target;
		t.disabled = true;
	};
	
	this.get_selected_code = function() {
		return Number(_selected.getAttribute('rel'));
	};
	
	__constructor__.call(this);
};

function GridController(_view, _export_btn, _model, _toolbar_controller) {
	var BLIP_HEIGHT = 15;
	var BLIP_WIDTH = 16;
	
	function __constructor__() {
		var w = BLIP_WIDTH;
		var h = BLIP_HEIGHT;
		var rows = _model.get_blips();
		
		_view.style.width = ((w + 1) * rows[0].length) + 'px';
		_view.style.height = ((h + 1) * rows.length) + 'px';
		
		for (var i = 0, l = rows.length; i < l; i++) {
			for (var cols = rows[i], j = 0, s = cols.length; j < s; j++) {
				var a = document.createElement('div');
				a.className = 'Blip';
				a.style.width = w + 'px';
				a.style.height = h + 'px';
				a.setAttribute('rel', i + '_' + j);
				
				_view.appendChild(a);
			}
		}
		
		_view.addEventListener('click', onclick, false);
		_export_btn.addEventListener('click', onexport, false);
	};
	
	function onclick(e) {
		var code = _toolbar_controller.get_selected_code();
		var coord = e.target.getAttribute('rel').split('_');
		
		var blip = _model.get_blip(coord[0], coord[1]);
		if (code == -1) {
			blip.clear();
			e.target.innerHTML = '';
		} else {
			blip.set_value(code); // Here, should I store entities?
			e.target.innerHTML = '&#' + code + ';';
		}
	};
	
	function onexport(e) {
		var data = new Exporter(_model.get_blips());
		window.open(URL.createObjectURL(data.get_html()), '_blank');
	};
	
	__constructor__();
};

function Exporter(_blips) {
	var HTML_FILE = '<!DOCTYPE html><html><head><meta charset="utf-8"><style type="text/css">body {font-size:13px;font-family:monospace;line-height:13px;} span {display:inline-block;width:13px;height:13px;}</style></head><body>[]</body></html>';
	var _html;
	var _raw;
	
	function __constructor__() {
		var html = '';
		var raw = '';
		for (var rows = _blips, rl = rows.length, i = 0; i < rl; i++) {
			for (var cols = rows[i], cl = cols.length, j = 0; j < cl; j++) {
				var code = cols[j].get_value();
				raw += code;
				raw += ' ';
				html += '<span>';
				if (code === -1)
					html += '&nbsp;';
				else {
					html += '&#';
					html += code;
					html += ';';
				}
				html += '</span>';
			}
			html += '<br />';
			raw += '\n';
		}
		html = HTML_FILE.replace('[]', html);
		_html = html;
		_raw = raw;
	};
	
	this.get_html = function() {
		return new Blob([_html], { type: 'text/html' });
	};
	
	this.get_grid = function() {
		return new Blob([_raw], { type: 'text/plain' });
	};
	
	__constructor__();
};

/*

	THE APPLICATION

*/
// SETTINGS
var WIDTH = 32;
var HEIGHT = 32;

// MODELS
var grid = new Grid(WIDTH, HEIGHT);
var toolbar = new Toolbar();

// CONTROLLERS
var toolbar_controller = new ToolbarController(document.getElementById('toolbar'), toolbar);
var grid_controller = new GridController(
	document.getElementById('grid'),
	document.getElementById('export_btn'),
	grid,
	toolbar_controller
);