// JavaScript Document
function GetRePlayerLayerWidthHeight() {
        var MinHeight = 430;
        var MinWidth = 700;

		width = document.documentElement.clientWidth - parseInt($("#ReplaySearchListLayer").outerWidth(true)) ;	
		width -=(width*0.2 + width*0.02);
		
		$("#ReplayPlayerLayer").css("margin-left", (width*0.2)+"px");
		$("#ReplayPlayerLayer").css("margin-right", (width*0.02)+"px");
				
       height = document.documentElement.clientHeight -47 -30 ;

        if (height < MinHeight) height = MinHeight;
        if (width < MinWidth) width = MinWidth;

        return {
            w: width,
            h: height
        };
}