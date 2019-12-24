// JavaScript Document
$(function() {

    $(document).ready(function(e) {

	/*找出对应的网页字句*/
    pathname = window.location.pathname;
    htmlname = pathname.substr(pathname.lastIndexOf("/") + 1, pathname.length) ;

	if(htmlname.split('.')[0] == "display"){//只有在display页面才加载
	 
		
	}

		/******************创建滑动条*************************/
        $("#HueSlider, #BriSlider, #ConSlider, #SatSlider").slider({
            range: "min",
            min: 0,
            max: 100,
			stop:function(event, ui){SendCsCValue(event, ui)}
        })

        var cgiurl = "cgi-bin/hi3510/getvdisplayattr.cgi?&-ircutmode=&-awbswitch=&-powerfreq=&-flip=&-mirror=&-scene=&-hue=&-brightness&-saturation&-contrast";
        cgiurl += "&-time=" + new Date().getTime();

        $.get(cgiurl,

        function(data) {
            eval(data);

            $("#HueText").html(hue);
            $("#HueSlider").slider("option", "value", hue);
            $("#HueSlider").on("slide",
            function(event, ui) {
                $("#HueText").html(ui.value)
            });

            $("#BriSliderText").html(brightness);
            $("#BriSlider").slider("option", "value", brightness);
            $("#BriSlider").on("slide",
            function(event, ui) {
                $("#BriSliderText").html(ui.value)
            });

            $("#ConSliderText").html(contrast);
            $("#ConSlider").slider("option", "value", contrast);
            $("#ConSlider").on("slide",
            function(event, ui) {
                $("#ConSliderText").html(ui.value)
            });

            $("#SatSliderText").html(saturation);
            $("#SatSlider").slider("option", "value", saturation);
            $("#SatSlider").on("slide",
            function(event, ui) {
                $("#SatSliderText").html(ui.value)
            });

			 /******************flip*************************/
            if (flip == "off") $('input:radio[name="flipgrp"]').get(1).checked = true;
            else $('input:radio[name="flipgrp"]').get(0).checked = true;

			 /******************mirro*************************/
            if (mirror == "off") $('input:radio[name="mirrorgrp"]').get(1).checked = true;
            else $('input:radio[name="mirrorgrp"]').get(0).checked = true;

			 /******************powerfreq*************************/
            if (powerfreq == "60") $('input:radio[name="Powerfreqgrp"]').get(1).checked = true;
            else $('input:radio[name="Powerfreqgrp"]').get(0).checked = true;

			 /******************场景模式*************************/
            if (scene == "indoor") $("#SceneSelect option[value=1]").attr("selected", true);
            else if (scene == "outdoor") $("#SceneSelect option[value=2]").attr("selected", true);
            else $("#SceneSelect option[value=0]").attr("selected", true);

			var s = "#IRSelect option[value="+ircutmode+"]";
			$(s).attr("selected" ,true);
        }

        );
	
        SendCsCValue = function(event, ui) {
            /*一定要4个同时设置下去不然会报错*/
            cgicmd = '/cgi-bin/hi3510/setvdisplayattr.cgi?';
            cgicmd += '&-hue=' + $("#HueSlider").slider("option", "value");
            cgicmd += '&-brightness=' + $("#BriSlider").slider("option", "value");
            cgicmd += '&-saturation=' + $("#SatSlider").slider("option", "value");
            cgicmd += '&-contrast=' + $("#ConSlider").slider("option", "value");
            $.get(cgicmd);
        }
		
 		/******************默认恢复按钮*************************/
        $('#flipOn, #flipOff, #mirrorOn, #mirrorOff, #powerfreq50, #powerfreq60').click(function() {

            cgicmd = '/cgi-bin/hi3510/setvdisplayattr.cgi?'

            if ($('input:radio[name="flipgrp"]:checked').val() == "on") cgicmd += '&-flip=on';
            else cgicmd += '&-flip=off';

            if ($('input:radio[name="mirrorgrp"]:checked').val() == "on") cgicmd += '&-mirror=on';
            else cgicmd += '&-mirror=off';

            if ($('input:radio[name="Powerfreqgrp"]:checked').val() == "50") cgicmd += '&-powerfreq=50';
            else cgicmd += '&-powerfreq=60';

            $.get(cgicmd);
        });

    });

    /******************默认恢复按钮*************************/
    $('a#UpdateSpan, a#DefaultSpan, #DefaultBtn, #UpdateBtn').click(function() {
        /***********************恢复默认值*****************************/
        if (($(this).attr('id') == "DefaultBtn") ||($(this).attr('id') == "DefaultSpan")) {
            var cgiurl = 'cgi-bin/hi3510/setvdisplayattr.cgi?&-setcscdefault&-setdirdefault';
            $.get(cgiurl);
        }

        /***********************重新获取参数值*****************************/
        cgiurl = "cgi-bin/hi3510/getvdisplayattr.cgi?&-ircutmode=&-awbswitch=&-powerfreq=&-flip=&-mirror=&-scene=&-hue=&-brightness&-saturation&-contrast";
        cgiurl += "&-time=" + new Date().getTime();

        $.get(cgiurl,
        function(data) {
            eval(data);

            $('#HueText').html(parseInt(hue));
            $('#BriSliderText').html(parseInt(brightness));
            $('#SatSliderText').html(parseInt(saturation));
            $('#ConSliderText').html(parseInt(contrast));

            $("#HueSlider").slider("option", "value", parseInt(hue));
            $("#BriSlider").slider("option", "value", parseInt(brightness));
            $("#SatSlider").slider("option", "value", parseInt(saturation));
            $("#ConSlider").slider("option", "value", parseInt(contrast));

            if (flip == "off") $('input:radio[name="flipgrp"]').get(1).checked = true;
            else $('input:radio[name="flipgrp"]').get(0).checked = true;

            if (mirror == "off") $('input:radio[name="mirrorgrp"]').get(1).checked = true;
            else $('input:radio[name="mirrorgrp"]').get(0).checked = true;

            if (powerfreq == "60") $('input:radio[name="Powerfreqgrp"]').get(1).checked = true;
            else $('input:radio[name="Powerfreqgrp"]').get(0).checked = true;

            if (scene == "indoor") $("#SceneSelect option[value=1]").attr("selected", true);
            else if (scene == "outdoor") $("#SceneSelect option[value=2]").attr("selected", true);
            else $("#SceneSelect option[value=0]").attr("selected", true);

			var s = "#IRSelect option[value="+ircutmode+"]";
			$(s).attr("selected" ,true);
        });
    });

    /******************场景模式选择*************************/
    $("#SceneSelect").change(function() {
        cgiurl = '/cgi-bin/hi3510/setvdisplayattr.cgi?';
        if ($("#SceneSelect option:selected").val() == 1) cgiurl += '&-scene=' + "indoor"
        else if ($("#SceneSelect option:selected").val() == 2) cgiurl += '&-scene=' + "outdoor"
        else cgiurl += '&-scene=' + "auto";
        $.get(cgiurl);
    })
	
    /******************IRCUT选择*************************/
    $("#IRSelect").change(function() {
        cgiurl = '/cgi-bin/hi3510/setvdisplayattr.cgi?';
		cgiurl += '&-ircutmode=' + $("#IRSelect option:selected").val();
        $.get(cgiurl);
    })

})