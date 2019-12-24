// JavaScript Document

var bMouseDown;
var bDraw;
var arearow, areacol;
var areaselectId;//控件的ID
var arearcellwidth;//格子的宽
var areacellheigh;//格子的高
var drawcolor="#ff0000";
var selectedcolor="#ff0000";//选中时格子的颜色
var boder="1px solid #ff0000";//边框的样式

function AreaSelectOnMouseDown(evt)
{
	bMouseDown = 1;

	evt = evt||window.event;
	
	var obj = (evt.srcElement ? (evt.srcElement) : evt.target);
	
	/*这次拖动以鼠标按下的第一个格子的颜色 为准，即格子颜色为红色，则这次手动全部把格式变成透明*/
	if((obj)&&(obj.tagName == "DIV")&&(obj.id))
	{
		var spanobj = document.getElementById(obj.id);

		/*兼容 firefox chrome*/
		if(spanobj.style.backgroundColor.split('rgb'))
				var sHexColor = spanobj.style.backgroundColor.colorHex();
		else
				var sHexColor = spanobj.style.backgroundColor;

		/*反选颜色*/		
		if(sHexColor == selectedcolor)
		{
			drawcolor="transparent";	
		}
		else
		{
			drawcolor= selectedcolor;
		}
	}
}

function AreaSelectOnMouseUp(evt)
{
	bMouseDown = 0;	
}
 
 
function AreaSelectOnMouseMove(evt)
{
	if((bMouseDown)&&(!bDraw))//为避免重复画，bDraw控制方框只画一次
	{
		/*兼容firefox*/
		evt = evt||window.event;
		var obj = (evt.srcElement ? (evt.srcElement) : evt.target);
		
		if((obj)&&(obj.tagName == "DIV")&&(obj.id))
		{
			var spanobj = document.getElementById(obj.id);
			/*反选颜色*/		
			spanobj.style.backgroundColor=drawcolor;	
			bDraw = 1;	
		}
		
	}
}

function AreaSelectOnMouseOut(evt)
{
	bDraw = 0;	
}

function AreaSelectOndblclick(evt)
{
	/*兼容firefox*/
	evt = evt||window.event;
	var obj = (evt.srcElement ? (evt.srcElement) : evt.target);
	
	if((obj)&&(obj.tagName == "DIV")&&(obj.id))
	{
		var spanobj = document.getElementById(obj.id);
		
		/*兼容 firefox chrome*/
		if(spanobj.style.backgroundColor.split('rgb'))
		{
				var sHexColor = spanobj.style.backgroundColor.colorHex();
		}
		else
		{
				var sHexColor = spanobj.style.backgroundColor;
		}

		/*反选颜色*/		
		if(sHexColor==selectedcolor)
		{
			spanobj.style.backgroundColor = "transparent";	
		}
		else
			spanobj.style.backgroundColor = selectedcolor;	
	}
}
   
function AreaselectSelectall()
{
	for(i=0; i<arearow; i++)//行
	{
		for(j=0;j<areacol;j++)//列
		{
				spanid='Row'+i+'Col'+j;	
				var spanobj = document.getElementById(spanid);
				if(spanobj)
					spanobj.style.backgroundColor=selectedcolor;
		}
	}	
}

function AreaselectClearall()
{
	for(i=0; i<arearow; i++)//行
	{
		for(j=0;j<areacol;j++)//列
		{
				spanid='Row'+i+'Col'+j;	
				var spanobj = document.getElementById(spanid);
				if(spanobj)
					spanobj.style.backgroundColor="transparent";
		}
	}	
}

function AlearselectDraw(col, row, LayerWidth, LayerHeigh, id)
{
	arearow = row;
	areacol =col;
	areaselectId = id;
	cellwidth = arearcellwidth = parseInt(LayerWidth/col) ;
	cellheigh = areacellheigh = parseInt(LayerHeigh/row);

	document.open();

	document.write('<div id="' +areaselectId+'" >');

	for(i=0; i<arearow; i++)//行
	{
		rowid = 'Row' + i;
		document.write('<div id="' +rowid+'" >');//一行开始
		document.getElementById(rowid).style.width = (cellwidth*areacol)+'px';
	
		for(j=0;j<areacol;j++)//列
		{
			spanid='Row'+i+'Col'+j;	
		
			/*针对方框在不同位置，它四周的边框不一样，如第一行第一列，它的边框就要4个，
			第一行其它列，它的边框就只要3个，上，右，下*/
			if((i==0)&&(j==0))
			{
				document.write('<div id='+spanid+'></div>');//第一行第一列
				document.getElementById(spanid).style.border = boder;
				document.getElementById(spanid).style.width = arearcellwidth-2+'px';
				document.getElementById(spanid).style.height = areacellheigh-2+'px';
			}
			else if((i==0)&&(j>0))	
			{
				document.write('<div id='+spanid+'></div>');//第一行其它列
				document.getElementById(spanid).style.borderTop= boder;
				document.getElementById(spanid).style.borderBottom= boder;
				document.getElementById(spanid).style.borderRight=boder;
				document.getElementById(spanid).style.width = arearcellwidth-1+'px';
				document.getElementById(spanid).style.height = areacellheigh-2+'px';
			}
			else if((i>0)&&(j==0))		
			{
				document.write('<div id='+spanid+'></div>');//其它行第一列
				document.getElementById(spanid).style.borderLeft= boder;
				document.getElementById(spanid).style.borderBottom= boder;
				document.getElementById(spanid).style.borderRight=boder;
				document.getElementById(spanid).style.width = arearcellwidth-2+'px';
				document.getElementById(spanid).style.height = areacellheigh-1+'px';
			}
			else
			{
				document.write('<div id='+spanid+'></div>');//其它行其它列
				document.getElementById(spanid).style.borderBottom= boder;
				document.getElementById(spanid).style.borderRight=boder;
				document.getElementById(spanid).style.width = arearcellwidth-1+'px';
				document.getElementById(spanid).style.height = areacellheigh-1+'px';
			}
			document.getElementById(spanid).style.cssFloat = "left";
			document.getElementById(spanid).style.styleFloat = "left";
			document.getElementById(spanid).style.margin = "0px";
			$("#"+spanid).css("font-size", "0px");
			$("#"+spanid).css("background", "url(../images/AlearselectBg.png)");

		}
		document.write('</div>');//一行结束
		
	}
	document.write('</div>');//end draw
	document.close();

	/*********************注册消息函数*********************/
	document.getElementById(areaselectId).onmousemove=AreaSelectOnMouseMove;
	document.getElementById(areaselectId).onmousedown=AreaSelectOnMouseDown;
	document.getElementById(areaselectId).onmouseup=AreaSelectOnMouseUp;
	document.getElementById(areaselectId).onmouseout=AreaSelectOnMouseOut;
	document.getElementById(areaselectId).ondblclick = AreaSelectOndblclick;
	
}

/****************设置某行某列的值**************/
function SetAlearselect(rowno, colno, colbit)   
{
	if((rowno > arearow)||(colno > areacol))
		return false;
		
	spanid='Row'+rowno+'Col'+colno;	
	var spanobj = document.getElementById(spanid);
	if(spanobj)
	{
		if( colbit & 1)
			spanobj.style.backgroundColor=selectedcolor;
		else
			spanobj.style.backgroundColor="transparent";	
	}
	
}
/****************获取某行某列的值**************/
function GetAlearselect(rowno, colno)   
{
	if((rowno > arearow)||(colno > areacol))
		return false;
			
	spanid='Row'+rowno+'Col'+colno;	
	var spanobj = document.getElementById(spanid);
	if(spanobj)
	{
		/*兼容 firefox chrome*/
		if(spanobj.style.backgroundColor.split('rgb'))
				var sHexColor = spanobj.style.backgroundColor.colorHex();
		else
				var sHexColor = spanobj.style.backgroundColor;
					
		if( sHexColor== selectedcolor)
			return 1;
		else
			return 0;
	}
	
	return 0;
}  