function Grid(_container) {
	var BLIP_HEIGHT = 10;
	var BLIP_WIDTH = 7;
	
	var _container_width;
	var _container_height;
	
	function __constructor__() {
		var w = _container_width = _container.offsetWidth;
		var h = _container_height = _container.offsetHeight;
		
		var h_amnt = w / BLIP_WIDTH + 1;
		var v_amnt = h / BLIP_HEIGHT + 1;
		
		for (var i = 0, len = Math.round(h_amnt * v_amnt); i < len; i++) {
			_container.appendChild(create_blip());
		}
	};
	
	function create_blip() {
		var span = document.createElement('span');
		span.className = 'Blip';
		span.style.width = BLIP_WIDTH + 'px';
		span.style.height = BLIP_HEIGHT + 'px';
		
		// span.innerHTML = '&heart;';
		
		return span;
	};
	
	__constructor__.call(this);
};

var grid = new Grid(document.getElementById('grid'));