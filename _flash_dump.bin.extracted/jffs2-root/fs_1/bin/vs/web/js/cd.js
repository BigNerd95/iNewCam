// JavaScript Document
$(function() {

    var IPCSrcWidth = 1280;
    var IPCSrcHeight = 720;
    var ImgWidth = parseInt($("#mdsnap").width());
    var ImgHeight = parseInt($("#mdsnap").height());
    /*
$("#mdsnap").load(function(e) {
    IPCSrcWidth = parseInt($(this).width());
	IPCSrcHeight = parseInt($(this).height());
	$(this).css("width", "100%");
	$(this).css("height", "100%");
});
*/

    $(document).ready(function(e) {

        LoadLanguage();
        //setTimeout(function(){$("body").css("display", "block");}, 100);
        $("#RegionLayer>div").draggable({
            containment: "#CdDisplayLayer",
            scroll: false
        });

        $("#RegionLayer>div").resizable({
            containment: "#CdDisplayLayer",
            maxHeight: IPCSrcHeight,
            maxWidth: IPCSrcWidth,
            minHeight: 16,
            minWidth: 16,
            scroll: false
        });

        LoadAdjustRegionRect();

        $("#RegionShowLayer input").each(function(index, element) {
            var show = eval("show_" + index);
            if (show == 0) $(this).prop("checked", false);
            else $(this).prop("checked", true);
        });
    });

    function LoadAdjustRegionRect() {

        $("#RegionLayer>div").each(function(index, element) {
            var RegionWidth = eval("w_" + index);
            var RegionHeight = eval("h_" + index);
/*
            var BorderLeft = parseInt($(this).css("border-left-width"));
            var BorderRight = parseInt($(this).css("border-right-width"));
            var BorderTop = parseInt($(this).css("border-top-width"));
            var BorderBottom = parseInt($(this).css("border-bottom-width"));
*/
		var BorderLeft = 0;
            var BorderRight = 0;
            var BorderTop = 0;
            var BorderBottom = 0;






            $(this).width(parseInt((ImgWidth * parseInt(RegionWidth)) / IPCSrcWidth) - BorderLeft - BorderRight);

            $(this).height(parseInt((ImgHeight * parseInt(RegionHeight)) / IPCSrcHeight) - BorderTop - BorderBottom);

            var x = eval("x_" + index);
            var y = eval("y_" + index);

            if (mirror == "on") {
                $(this).css("left", ImgWidth - $(this).width() - parseInt((ImgWidth * parseInt(x)) / IPCSrcWidth) - BorderLeft + "px");
            } else {
                $(this).css("left", parseInt((ImgWidth * parseInt(x)) / IPCSrcWidth) + "px");
            }

            if (flip == "on") {
                $(this).css("top", ImgHeight - $(this).height() - parseInt((ImgHeight * parseInt(y)) / IPCSrcHeight) - BorderTop - BorderBottom + "px");

            } else {
                $(this).css("top", parseInt((ImgHeight * parseInt(y)) / IPCSrcHeight) + "px");
            }

            if (parseInt(eval("show_" + index)) == 0) {
                $(this).css("display", "none");
            } else {
                $(this).css("display", "block");
            }

        });

        return 0;
    }

    function SubmitAdjustRegionRect() {
        var ImgWidth = parseInt($("#mdsnap").width());
        var ImgHeight = parseInt($("#mdsnap").height());

        $("#RegionLayer>div").each(function(index, element) {
            var RegionX = parseInt($(this).css("left"));
            var RegionY = parseInt($(this).css("top"));
            var RegionWidth = parseInt($(this).outerWidth(true));
            var RegionHeight = parseInt($(this).outerHeight(true));

            var BorderLeft = parseInt($(this).css("border-left-width"));
            var BorderRight = parseInt($(this).css("border-right-width"));
            var BorderTop = parseInt($(this).css("border-top-width"));
            var BorderBottom = parseInt($(this).css("border-bottom-width"));

            $("#Form2RegionX" + index).attr("name", "-x");

            $("#Form2RegionY" + index).attr("name", "-y");

            if (mirror == "on") {
                var x = (ImgWidth - RegionX - RegionWidth) * IPCSrcWidth / ImgWidth;
            } else {
                var x = RegionX * IPCSrcWidth / ImgWidth;
            }

            if (x < 0) x = 0;
            if (x > IPCSrcWidth) x = IPCSrcWidth;

            $("#Form2RegionX" + index).val(x);

            if (flip == "on") {
                var y = (ImgHeight - RegionY - RegionHeight) * IPCSrcHeight / ImgHeight;
            } else {
                var y = RegionY * IPCSrcHeight / ImgHeight;
            }

            if (y < 0) y = 0;
            if (y > IPCSrcHeight) y = IPCSrcHeight;

            $("#Form2RegionY" + index).val(y);

            var w = RegionWidth * IPCSrcWidth / ImgWidth;
            $("#Form2RegionW" + index).attr("name", "-w");
            $("#Form2RegionW" + index).val(w);

            var h = RegionHeight * IPCSrcHeight / ImgHeight;
            $("#Form2RegionH" + index).attr("name", "-h");
            $("#Form2RegionH" + index).val(h);

            $("#Form2RegionShow" + index).attr("name", "-show");
            if ($("#ShowRegion" + index).prop("checked") == true) {
                $("#Form2RegionShow" + index).val(1);
            } else {
                $("#Form2RegionShow" + index).val(0);
            }

            $("#Form2Region" + index).attr("name", "-region");
            $("#Form2Region" + index).val(index);
        });

        return 0;
    }

    $("#apply").click(function(e) {

        SubmitAdjustRegionRect();

        var form = document.form2;
        form.cururl.value = document.URL;

        form.action = "cgi-bin/hi3510/param.cgi";
        form.submit();
    });

    $("#RegionShowLayer input").click(function(e) {
        var index = ($(this).index("#RegionShowLayer input"));
        if ($(this).prop("checked") == true) $("#region" + index).css("display", "block");
        else $("#region" + index).css("display", "none");

    });

});
