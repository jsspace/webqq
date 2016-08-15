/**
 * Created by ym on 2016/4/19.
 */
//
$(function(){
    //全局变量
    function chageImage(){
        var imageContainer = $("#bgAllImage img");
        var wp_pre_ctrl = $("#wp-ctrl-pre");
        var wp_next_ctrl = $("#wp-ctrl-next");

        var bgImages = ["0.jpg","1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg"];

        var index = 0;
        var current = 0;

        function clickCtrl(dir){
            if(dir=="pre"){
                if(index>0){
                    index--;
                }else{// if 0, go to the last
                    index = bgImages.length-1;
                }
            }else if(dir=="next"){
                if(index<bgImages.length-1){
                    index++;
                }else{//idext == bg.length-1 , index = 0;
                    index=0;
                }
            }
            imageContainer.attr("src","images/"+bgImages[index]);
         }
        wp_pre_ctrl.click(function(){
            clickCtrl("pre");
        });
        wp_next_ctrl.click(function(){
            clickCtrl("next");
        })
    }
    chageImage();
    //bottom menu
    (function(){
        var list = $("footer li");

        var panel_1 = $("#panel-1");
        var panel_2 = $("#panel-2");
        var panel_3 = $("#panel-3");
        var panel_4 = $("#panel-4");
        list.eq(0).click(function(){
            list.each(function(){
                $(this).removeClass("selected");
            });
            $(this).addClass("selected");
            removeAllClass();
            panel_1.addClass("selected");

        });
        //第二个菜单按钮
        list.eq(1).click(function(){
            list.each(function(){
                $(this).removeClass("selected");
            });
            $(this).addClass("selected");
            removeAllClass();

            panel_2.addClass("selected");

            $("#groupBodyUl-0").children('li').remove();
            $.ajax({
                url:'getData',
                type:'post',
                data:'friendList',
                dataType:'json',
                success:function(data, textStatus){
                    var length = data.length;
                    for(var i=0;i<length;i++){
                        if(data[i].isOnline){
                            is_online = "在线"
                        }else{
                            is_online = "离线"
                        }
                        $("#groupBodyUl-0").append("<li class='list_item' _uin="+data[i].user.userId+" _type='friend' > <a href='javascript:void(0);' class='avatar'  _uin="+data[i].user.userId+" _type='friend'><img src='/Bonjours/static/images/getface.jpg'> </a> <p class='member_nick'>"+data[i].nickname+"<span>("+data[i].user.age+")</span> </p> <p class='member_msg text_ellipsis'> <span class='member_state'>["+is_online+"]</span> </p> </li>")
                    }
                }
            });
            pageScroll($("#panelBodyWrapper-2"),$("#friend_groupList"));

        });
        list.eq(2).click(function(){
            list.each(function(){
                $(this).removeClass("selected");
            });
            $(this).addClass("selected");
            removeAllClass();
            panel_3.addClass("selected");

            $("#add_list").children('li').remove();
            $.ajax({
                url:'getUserConfirmes',
                type:'get',
                dataType:'json',
                success:function(data,status){
                    var length= data.length;
                    for(var i=0;i<length;i++){
                        $("#add_list").append("<li  class='list_item' > <a href='javascript:void(0);' class='avatar' cmd='clickMemberAvatar' _uin='1482588226' _type='group'><img src='/Bonjours/static/images/getface.jpg' > </a> <p class='member_nick'>"+data[i].confirme_user.username+" </p> <p class='member_msg text_ellipsis'> </p> <div  class='addFriend' _uin="+data[i].confirme_user.userId+">添加</div> </li>");
                    }
                    //点击添加
                    $("#add_list .addFriend").click(function(){
                        $(this).text("已添加");
                        var userId = $(this).attr("_uin");
                        $.ajax({
                            url:"addItem?userId="+userId,
                            type:'get'
                        })
                    });
                }
            });


            pageScroll($("#panelBodyWrapper-3"),$("#add_list"));

        });
        list.eq(3).click(function(){
            list.each(function(){
                $(this).removeClass("selected");
            });
            $(this).addClass("selected");
            removeAllClass();
            panel_4.addClass("selected");

        });
        function removeAllClass(){
            panel_1.removeClass("selected");
            panel_2.removeClass("selected");
            panel_3.removeClass("selected");
            panel_4.removeClass("selected");
        }
    })();
    //右侧滚动条和自适应高度
    (function(){
        var chatWraper = $("#panelBodyWrapper-5");
        var chatContainer = $("#panelBody-5");
        var scrollBar = $("#scrollBar");
        var wrapperHeight = chatWraper.height();
        var scrollBarHeight;
        var scrollTrans;
        var k;
        var lowerBar,lowerChat;

        //页面开始时初始化
        //initialScrollBarHeight();
       // changeScrollBarForm(scrollBarHeight);

        initialChatHeight();
        initialScrollHeight();
        chatContainer.resize(function(){
            initialChatHeight();
        });

        function initialChatHeight(){
            var chatTrans = chatContainer.height()-chatWraper.height();
            transChatHeight(chatTrans);
        }
        function transChatHeight(chatTrans){
            chatContainer.css("transform","translate(0px,"+chatTrans*(-1)+"px)");
        }
        function initialScrollHeight(){
            scrollBarHeight = chatWraper.height()*chatWraper.height()/chatContainer.height();
            scrollBar.height(scrollBarHeight);
            scrollTrans = chatWraper.height()-scrollBarHeight-6;
            transScrollHeight(scrollTrans);
        }
        function transScrollHeight(scrollTrans){
            scrollBar.css("transform","translate(0px,"+scrollTrans+"px)");
        }


        var index =0;
        chatWraper.on('mousewheel', function(event) {
            //console.log(event.deltaX, event.deltaY, event.deltaFactor);
            k=lowerBar/lowerChat;
            lowerBar = chatWraper.height()-scrollBar.height()-6;
            lowerChat = chatContainer.height()-chatWraper.height();
            var speed = event.deltaFactor/2;
            var wrapperHeight = chatWraper.height();
            var chatHeight = chatContainer.height();
            var scrollHeight = scrollBar.height();
            var scrollTrans = wrapperHeight-scrollHeight-6;
            var chatLower = chatHeight - wrapperHeight;

            if(event.deltaY==1) {
                if ((index + 1) * speed + wrapperHeight > chatHeight) {
                    transChatHeight(chatHeight - wrapperHeight);
                    transScrollHeight(scrollTrans - k * chatLower);
                } else {
                    index++;
                    transChatHeight(speed * index);
                    transScrollHeight(scrollTrans - k * index * speed);
                }
            }else if(event.deltaY==-1){
                    if(index==0){
                        return;
                    }else{
                        index--;
                        transChatHeight(speed*index);
                        transScrollHeight(scrollTrans-k*speed*index);
                        //console.log(chatContainer.css("top"));
                    }

                }
        });


        function isScroll(){
            if(chatContainer.height()>chatWraper.height()){
                scrollBar.show();
            }
        }


        //发送消息
        var current_chat_list = $("#main_container .list_item");
        //好友点击聊天事件
        current_chat_list.click(function(){

            var member_nick = $(this).find(".member_nick");
            var containerHeader = member_nick.eq(0).text();
            var userId = $(this).attr("_uin");
            //alert(userId);
            var otherOne;

            $("#panelTitle-5").text(containerHeader);
            hideAllPanel();
            $("#panel-5").show();

            //轮询
            setInterval(function(){
                $.ajax({
                    url:'getMessage',
                    type:'get',
                    dataType:'text',
                    success:function(data){
                        if(data != ''){
                            index=0;
                            chatContainer.append("<div class='chat_content_group buddy'> <img class='chat_content_avatar' src='/Bonjours/static/images/getface.jpg' height='40px' width='40px'> <p class='chat_nick'>"+containerHeader+"</p> <p class='chat_content' >"+data+"</p> </div>");
                            isScroll();
                            initialChatHeight();
                            initialScrollHeight();
                            $("#chat_textarea").val('');
                        }
                    }
                })
            },300);




        });
        //发送
        var sendBtn = $("#send_chat_btn");
        var text;

        sendBtn.click(function(){
            text= $("#chat_textarea").val();

            if(text != ""){
                sendMessage(text);
            }
            });
        $(document).keydown(function(event){
            var text= $("#chat_textarea").val();
            if(text.length<20){
                text= text.replace(/\r\n/g,'');
            }
            if(text != ""&& event.keyCode == 13){
                sendMessage(text);
            }
        });
        function sendMessage(sendData){
            index=0;
            $.ajax({
                url:"send?message="+sendData,
                type:'get'
            })
            chatContainer.append("<div class='chat_content_group self'> <img class='chat_content_avatar' src='/Bonjours/static/images/getface.jpg' height='40px' width='40px'> <p class='chat_nick'>"+myself.username+"</p> <p class='chat_content' >"+sendData+"</p> </div>");
            isScroll();
            initialChatHeight();
            initialScrollHeight();
            $("#chat_textarea").val('');
        }

    }());
    //textarea 高度自适应
    (function(){
        var autoTextarea = function (elem, extra, maxHeight) {
            extra = extra || 0;
            var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
                isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
                addEvent = function (type, callback) {
                    elem.addEventListener ?
                        elem.addEventListener(type, callback, false) :
                        elem.attachEvent('on' + type, callback);
                },
                getStyle = elem.currentStyle ? function (name) {
                    var val = elem.currentStyle[name];

                    if (name === 'height' && val.search(/px/i) !== 1) {
                        var rect = elem.getBoundingClientRect();
                        return rect.bottom - rect.top -
                            parseFloat(getStyle('paddingTop')) -
                            parseFloat(getStyle('paddingBottom')) + 'px';
                    };

                    return val;
                } : function (name) {
                    return getComputedStyle(elem, null)[name];
                },
                minHeight = parseFloat(getStyle('height'));

            elem.style.resize = 'none';

            var change = function () {
                var scrollTop, height,
                    padding = 0,
                    style = elem.style;

                if (elem._length === elem.value.length) return;
                elem._length = elem.value.length;

                if (!isFirefox && !isOpera) {
                    padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
                };
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                elem.style.height = minHeight + 'px';
                if (elem.scrollHeight > minHeight) {
                    if (maxHeight && elem.scrollHeight > maxHeight) {
                        height = maxHeight - padding;
                        style.overflowY = 'auto';
                    } else {
                        height = elem.scrollHeight - padding;
                        style.overflowY = 'hidden';
                    };
                    style.height = height + extra + 'px';
                    scrollTop += parseInt(style.height) - elem.currHeight;
                    document.body.scrollTop = scrollTop;
                    document.documentElement.scrollTop = scrollTop;
                    elem.currHeight = parseInt(style.height);
                };
            };

            addEvent('propertychange', change);
            addEvent('input', change);
            addEvent('focus', change);
            change();
        };
        var text = document.getElementById("chat_textarea");
        autoTextarea(text);// ����
    }());
    //关闭按钮
    (function(){
        var panelRightButtonText_5 = $("#panelRightButton-5");
        var panel_5 = $("#panel-5");
        panelRightButtonText_5.click(function(){
            panel_5.hide();
        });
    }());
    //点击出现右边的界面
    (function(){
        var panel_5 = $("#panel-5");
        var panel_6 = $("#panel-6");
        var panel_7 = $("#panel-7");
        var panel_8 = $("#panel-8");
        var panel_9 = $("#panel-9");


        //查询好友时出现的右侧界面
        var searchFriends = $("#search_result_list .list_item");
        searchFriends.click(function(){
            var member_nick = $(this).find(".member_nick");
            var containerHeader = member_nick.eq(0).text();
            $("#panelTitle-5").text(containerHeader);
            hideAllPanel();
            panel_5.show();
        })
        $("#panelRightButton-2").click(function(){

            hideAllPanel()
            $("#panel-6").show();
        })
        var flag =0;
        $("#panelLeftButton-2").click(function(){

            if(flag==0){
                $("#btn_list").show()
                flag=1
                $("#panelBodyWrapper-2").css("top","85px");
            }else if(flag==1){
                $("#btn_list").hide()
                flag=0
                $("#panelBodyWrapper-2").css("top","45px");
            }

            /*hideAllPanel()
            $("#panel-7").show();*/
        })
        $("#add_friends").click(function(){
            hideAllPanel()
            $("#panel-7").show();
        })
        $("#createroup").click(function(){
            hideAllPanel()
            $("#panel-9").show();
        })
        function hideAllPanel(){
            panel_5.hide()
            panel_6.hide()
            panel_7.hide()
            panel_8.hide()
            panel_9.hide()
        }
        window.hideAllPanel = hideAllPanel;
        //查看资料
        $("#viewInfo").click(function(){
            hideAllPanel();
            panel_8.show();
            pageScroll($("#panelBodyWrapper-8"),$("#panelBody-8"));

        })
        //朋友和群的切换
        var memberTab_list = $("#memberTab li");
        memberTab_list.click(function(){
            memberTab_list.each(function(){
                $(this).removeClass("active")
            })
            $(this).addClass("active")
            if($(this).attr("param")=="friend"){
                $("#memberTabBody-friend").addClass("active");
                $("#memberTabBody-group").removeClass("active")
            }else if($(this).attr("param")=="group"){
                $("#memberTabBody-friend").removeClass("active");
                $("#memberTabBody-group").addClass("active");
                //获取群列表的ajax请求
                $("#g_list").children('li').remove();
                $.ajax({
                    url:'../group/getGroupItemList',
                    type:'post',
                    dataType:'json',
                    success:function(data,status){
                        var length = data.length;
                        for(var i = 0;i<length;i++){
                            $("#g_list").append("<li  class='list_item' _uin="+data[i].groupId+" _type='group' cmd='clickMemberItem'> <a href='javascript:void(0);' class='avatar' cmd='clickMemberAvatar' _uin="+data[i].groupId+" _type='group'><img class='lazyLoadImg loaded' src='/Bonjours/static/images/getface.jpg'></a><p class='member_nick' >"+data[i].groupname+"</p><p class='member_msg text_ellipsis'></p></li>");
                        }
                    }

                });
                pageScroll($("#panelBodyWrapper-2"),$("#g_list"));
            }
        });
    }());
    //页面滚动
    (function(){
        function pageScroll(wrapper, container){
            var wrapper = wrapper;
            var container = container;
            var wrapperHeight = wrapper.height();
            var containerHeight = container.height();
            var index = 0;
            wrapper.on("mousewheel",function(event){
                if(containerHeight<=wrapperHeight){
                    return;
                }else{
                    var scrollSpeed = 24;
                    if(event.deltaY == 1){
                        if(index==0){
                            return;
                        }else{
                            index--;
                            transContainerHeight(index*scrollSpeed);
                        }
                    }else if(event.deltaY == -1){
                        if((index+1)*scrollSpeed + wrapperHeight>containerHeight){
                            transContainerHeight(containerHeight-wrapperHeight);
                        }else{
                            index++;
                            transContainerHeight(index*scrollSpeed);
                        }

                    }
                }
            })
            function transContainerHeight(height){
                container.css("transform","translate(0px,"+height*(-1)+"px)");
            }
        }

        window.pageScroll = pageScroll;
    }());

    pageScroll($("#current_chat_scroll_area"),$("#current_chat_list"));
    (function(){
        var flag =1;
        $("#panelLeftButton-5").click(function () {
            if(flag==1){
                $("#pannelMenuList-5").show();
                flag=0;
            }else if(flag==0){
                $("#pannelMenuList-5").hide();
                flag=1;
            }

        })

    }());
   //添加好友

    (function(){
        $("#add_result_list").children('li').remove();
        $("#addClear").click(function(){
            $("#add_result_list").children('li').remove();
            var friendName = $("#addInput").val();
            if(friendName != ""){
                $.ajax({
                    url:"getUserListByUsername?friendName="+friendName,
                    type:'get',
                    dataType:'json',
                    success:function(data,status){
                        var length = data.length;
                        for(var i = 0;i<length;i++){
                            $("#add_result_list").append("<li  class='list_item' _uin="+data[i].userId+" > <a href='javascript:void(0);' class='avatar' cmd='clickMemberAvatar' _uin="+data[i].userId+" _type='friend'><img class='lazyLoadImg loaded' src='/Bonjours/static/images/getface.jpg'></a><p class='member_nick' id='userNick-246685822'>"+data[i].username+"<span></span></p><div class='addRequst' _uin="+data[i].userId+">添加好友</div></li>");
                        }
                        $("#add_result_list .addRequst").click(function(){
                            $(this).css("background","#ccc");
                            var userId = $(this).attr("_uin");
                            $.ajax({
                                url:"addConfirme?userId="+userId,
                                type:'get'
                            })
                        })
                    }
                })
            }
        });




    }())


})