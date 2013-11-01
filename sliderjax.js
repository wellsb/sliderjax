            //Globals
            var handler = 'handler.php';
            var servomin = 200;
            var servomax = 535;
            
            // loop manager (loopstart, loopit, loopstop)
            var currentout =''; // the status of the current output in botleft output div
            var instruction = 0; // just to add the instruction number to the botleft output div
            var loopintid = ''; // set interval id for clearinterval
            var loopstack = []; // the current lines of open .rec
            var loopstackpos = 0; // used in loopit() to track progress on each call through setIntval
            var loopstatus = 0; // is the loop running

            // start positions at init
            //var fl1startpos = Math.round((servomin+servomax)/2);
            var speedsliderstartpos = 300;
            var fl1startpos = 362;
            var fl2startpos = 368;
            var fr1startpos = 393;
            var fr2startpos = 380;
            var bl1startpos = 345;
            var bl2startpos = 309;
            var br1startpos = 374;
            var br2startpos = 391;

            //Track current positions
            var fl1 = '';
            var fl2 = '';
            var fr1 = '';
            var fr2 = '';
            var bl1 = '';
            var bl2 = '';
            var br1 = '';
            var br2 = '';

            var fileasval = $("#filebox").val() + '.rec';
            var loopspeed = $("#loopspeed").val()
            var flag_alreadylisted = 0;

            function controller(action) {
                fl1 = $("#sliderfl1").slider("option", "value");
                fl2 = $("#sliderfl2").slider("option", "value");
                fr1 = $("#sliderfr1").slider("option", "value");
                fr2 = $("#sliderfr2").slider("option", "value");
                bl1 = $("#sliderbl1").slider("option", "value");
                bl2 = $("#sliderbl2").slider("option", "value");
                br1 = $("#sliderbr1").slider("option", "value");
                br2 = $("#sliderbr2").slider("option", "value");

                var fileasval = $("#filebox").val() + '.rec';
                if (action == 'move') {
                    updateOut(fl1, fl2, fr1, fr2, bl1, bl2, br1, br2, fileasval);
                    notify('notify', fl1, fl2, fr1, fr2, bl1, bl2, br1, br2, fileasval);
                } else {
                    if (action == 'save') {
                        notify('save', fl1, fl2, fr1, fr2, bl1, bl2, br1, br2, fileasval);
                        setTimeout('load()', 1000);
                        
                } else {
                    if (action == 'reset') {
                        //controller('move');
                    }
                }
                }
            }

            function updateOut(fl1, fl2, fr1, fr2, bl1, bl2, br1, br2, fileas) {
                $('#dialog').html('fl1: ' + fl1 + ' | fr1: ' + fr1 + ' | bl1: ' + bl1 + ' | br1: ' + br1 + ' <br/> fl2: ' + fl2 + ' | fr2: ' + fr2 + ' | bl2: ' + bl2 + ' | br2: ' + br2);
                $('#dialogright').html(fileas);
                $('#labelfl1').text("fl1: " + fl1);
                $('#labelfl2').text("fl2: " + fl2);
                $('#labelfr1').text("fr1: " + fr1);
                $('#labelfr2').text("fr2: " + fr2);
                $('#labelbl1').text("bl1: " + bl1);
                $('#labelbl2').text("bl2: " + bl2);
                $('#labelbr1').text("br1: " + br1);
                $('#labelbr2').text("br2: " + br2);
            }

            function notify(action, fl1, fl2, fr1, fr2, bl1, bl2, br1, br2, fileas) {
                //msg = "notify: " + action + x + "-" + fl2 + "-" + fr1 + " file: " + fileas;
                //alert(msg);
                $.ajax({
                    type: "POST",
                    url: handler,
                    data: { action: action,
                            file: fileas,
                            fl1: fl1,
                            fl2: fl2,
                            fr1: fr1,
                            fr2: fr2,
                            bl1: bl1,
                            bl2: bl2,
                            br1: br1,
                            br2: br2
                          }
                })
            }
            
            function load(filename) {
                if (null == filename) {
                    fileasval = $("#filebox").val() + '.rec';
                } else {
                    fileasval = filename;
                }
                
                $('#listingcont').html('');
                $("#holder").load(handler, {action: 'get', file: fileasval}, function() {
                    var entries = '';
                    entries = $('#holder').text();
                    var parsedentries = JSON.parse(entries);
                    for (var i=0,len=parsedentries.length; i<len; i++) {
                        $( "#listingcont" ).append("<div id =\"" + i + "\"class=\"readline\">" + parsedentries[i] + "</div>");
                    }
                });
            }

            function emptyfile() {
                fileasval = $("#filebox").val() + '.rec';
                if(confirm("Empty " + fileasval + "?")) {
                    $.ajax({
                        type: "POST",
                        url: handler,
                        data: { action: 'emptyfile',
                                file: fileasval
                              }
                    })
                } else {
                    e.preventDefault();
                }
                load();
            }

            function loopstart() {
                loopstatus = 1;
                loopspeed = $("#loopspeed").val();
                if (loopspeed < 200) {
                    loopspeed = 200;
                }

                loopstack = [];
                $(".readline").each(function(){
                    loopstack.push ($(this).text());
                });
                loopintid = setInterval('loopit()', loopspeed);
            }

            function loopit() {
                currentout = currentout + "<br/>" + instruction + " " + loopspeed + " loopstack: " + loopstack[loopstackpos];
                moveto(loopstack[loopstackpos]  );
                $("#botleft").html(currentout);
                if (loopstackpos < loopstack.length - 1) {
                    loopstackpos++;
                } else {
                    loopstackpos = 0;
                }
                instruction++;
                var height = $("#botleft")[0].scrollHeight;
                $("#botleft").scrollTop(height);
            }

            function loopstop(loopintid) {
                loopstatus = 0;
                clearInterval(loopintid);
            }

            function moveto(setstr){
                var thisset = setstr.split(',');
                $("#sliderfl1").slider({value: thisset[0]});
                $("#sliderfl2").slider({value: thisset[1]});
                $("#sliderfr1").slider({value: thisset[2]});
                $("#sliderfr2").slider({value: thisset[3]});
                $("#sliderbl1").slider({value: thisset[4]});
                $("#sliderbl2").slider({value: thisset[5]});
                $("#sliderbr1").slider({value: thisset[6]});
                $("#sliderbr2").slider({value: thisset[7]});
                controller('move');
            }

            function resetit() {
                moveto(fl1startpos + "," + fl2startpos + "," + fr1startpos + "," + fr2startpos + "," + bl1startpos + "," + bl2startpos + "," + br1startpos + "," + br2startpos)
            }

            function listit() {
                $("#holderforfilelist").load(handler, {action: 'list', file: fileasval}, function() {
                    var filelist = '';
                    filelist = $('#holderforfilelist').text();
                    var parsedfilelist = JSON.parse(filelist);
                    if (flag_alreadylisted == 0) {
                        for (var i=0,len=parsedfilelist.length; i<len; i++) {
                            $( "#holderforparsedfilelist" ).append("<div id =\"filelist" + i + "\"class=\"filelisting\">" + parsedfilelist[i] + "</div>");
                        }
                        flag_alreadylisted = 1;
                    }
                });
                $(function() {
                    $( "#holderforparsedfilelist" ).dialog();
                });
            }

            $("#filebox").on('input', function(){
                controller('move');
            })

            $("#loopspeed").on('input', function(){
                loopspeed = $("#loopspeed").val();
                $("#speedslider").slider({value: loopspeed});
                if (loopstatus == 1) {
                    loopstop(loopintid)
                    loopstart();
                }
            })

            // load pos from right - delegated (.on() as these class's are injected
            $(listingcont).on('click','.readline',function(){
                var thisid = $(this).attr('id');
                var contains = $('#'+thisid).text();
                moveto(contains);
            });
            
            // open from open file dialog - delegated (.on() as these class's are injected
            $(holderforparsedfilelist).on('click','.filelisting',function(){
                var thisid = $(this).attr('id');
                var contains = $('#'+thisid).text();
                load(contains);
                $('#dialogright').html(contains);
                contains = contains.substring(0, contains.length - 4);
                $("#filebox").val(contains);
            });
            
            $("#butsave").click(function(){
                controller('save');
            });

            $("#butreset").click(function(){
                resetit();
            });

            $("#butlist").click(function(){
                listit();
            });

            $("#butopen").click(function(){
                load();
            });

            $("#butempty").click(function(){
                emptyfile();
            });

            $("#butloopstart").click(function(){
                loopstart();
            });
            
            $("#butloopstop").click(function(){
                loopstop(loopintid);
            });

            $( "#speedslider" ).slider({
                value: speedsliderstartpos,
                min: 200,
                max: 1000,
                slide: function( event, ui ) {
                    loopspeed = $("#speedslider").slider("option", "value");
                    $("#loopspeed").val(loopspeed);
                    if (loopstatus == 1) {
                        loopstop(loopintid)
                        loopstart();
                    }
                }
            });

            $( "#sliderfl1" ).slider({
                value: fl1startpos,
                min: servomin,
                max: servomax,
                slide: function( event, ui ) {
                    controller('move');
                }
            });

            $( "#sliderfl2" ).slider({
                value: fl2startpos,
                min: servomin,
                max: servomax,
                slide: function( event, ui ) {
                    controller('move');
                }
            });

            $( "#sliderfr1" ).slider({
                value: fr1startpos,
                min: servomin,
                max: servomax,
                slide: function( event, ui ) {
                    controller('move');
                }
            });
            
            $( "#sliderfr2" ).slider({
                value: fr2startpos,
                min: servomin,
                max: servomax,
                slide: function( event, ui ) {
                    controller('move');
                }
            });

            $( "#sliderbl1" ).slider({
                value: bl1startpos,
                min: servomin,
                max: servomax,
                slide: function( event, ui ) {
                    controller('move');
                }
            });

            $( "#sliderbl2" ).slider({
                value: bl2startpos,
                min: servomin,
                max: servomax,
                slide: function( event, ui ) {
                    controller('move');
                }
            });

            $( "#sliderbr1" ).slider({
                value: br1startpos,
                min: servomin,
                max: servomax,
                slide: function( event, ui ) {
                    controller('move');
                }
            });

            $( "#sliderbr2" ).slider({
                value: br2startpos,
                min: servomin,
                max: servomax,
                slide: function( event, ui ) {
                    controller('move');
                }
            });

            window.onload=function(){
                controller('move');
                load();
            };