var bg = chrome.extension.getBackgroundPage();
var uuid;
$(function () {
  //密钥验证部分
  chrome.storage.local.get(['uuid', "token", 'state', 'timer', "condition"], (param) => {
    // if (param.uuid) {
      // uuid = param.uuid;
      // if (param.token) {
        token_check(param.token, (state) => {
          $('.other').html(`
                    <p>${state.Type}</p>
                    <p>到期时间：${state.Expiration}</p>
                    <div class="controlregion">
                        <label style="display:block">
                            <span >运行时间:</span>
                            <input type="text" id="timequantumS" value="10:00" class="srui_input" placeholder="HH:mm"
                                style="display:inline-block;width:64px;">
                            <span style="display:inline-block;margin:3px;width:30px;text-align:center;">至</span>
                            <input type="text" id="timequantumE" value="19:00" class="srui_input" placeholder="HH:mm" style="display:inline-block;width:64px;">
                        </label>
                        <label style="display:block">
		                    <span >间隔时间:(分)</span>
                            <input type="number" id="Timer" value="5" class="srui_input">
                        </label>
                        <label style="display:block">
                            <span >名称筛选：</span>
                            <input type="text" id="namecondition"  class="srui_input" placeholder="多个关键词逗号分隔">
                        </label>
                        <label style="display:block">
                            <span>候补公司名:</span>
                            <button class="srui_button houbuname">查看</button>
                        </label>
                        <label style="display:block">
                            <span >成熟度筛选：</span>
                            <input type="text" id="screeningconditions" placeholder="多个用逗号分隔"  class="srui_input">
                        </label>
                        <label style="display:block">
                            <span >翻页页码数：</span>
                            <input type="number" id="pageturningnum" value="5" placeholder="翻页页码数"  class="srui_input">
                        </label>
		                <button class="srui_button" id="Start">开启</button>
                    <button class="srui_button" id="openoption">查看记录</button>
	                </div>
                        `)
          console.log(param)
          if (param.state == undefined) {
            chrome.storage.local.set({
              state: 'close'
            })
          } else if (param.state == 'open') {
            $("#Start").html('关闭');
            $('.tips').text(`下次更新时间${new Date(param.timer.time).toLocaleString("zh", { hour12: false })}`);
            $("#Start").css('background', "#5DAC81");
          }
          param.timer ? $("#Timer").val(param.timer.step / 60000) : null;
          param.timer ? $("#timequantumS").val(param.timer.start) : null;
          param.timer ? $("#timequantumE").val(param.timer.end) : null;
          if (param.condition) {
            $("#namecondition").val(param.condition.namecondition);
            $("#screeningconditions").val(param.condition.screeningconditions);
            $("#pageturningnum").val(param.condition.pageturningnum);
          }
          // if (state.Type == "已过期") {
          //   NotActivated()
          // }
        });
      // } else {
      //   NotActivated();
      // }
    // } else {
    //   uuid = generateUUID();
    //   chrome.storage.local.set({
    //     uuid: uuid
    //   }, () => {
    //     NotActivated();
    //   })
    // }
  })


  $("body").on("click", "#Start", function () {
    chrome.storage.local.get(['state'], (par) => {
      if (par.state == 'open') {
        $('#Start').html('开启');
        $("#Start").css('background', "#3089dc");
        $('.tips').text('已关闭');

        let obj = {
          state: 'close',
          timer: {
            time: new Date().getTime() + Number($('#Timer').val()) * 60000,
            step: Number($('#Timer').val()) * 60000,
            start: $("#timequantumS").val() || "00:00",
            end: $("#timequantumE").val() || "24:00"
          },
          condition: {
            namecondition: $("#namecondition").val().replace(/\，/g, ",").split(","),
            screeningconditions: $("#screeningconditions").val().replace(/\，/g, ",").split(","),
            pageturningnum: Number($("#pageturningnum").val())
          }
        }
        //下一次时间
        obj.timer.time = timecount(obj.timer.time, obj.timer.start, obj.timer.end)
        chrome.storage.local.set(obj, () => {

        })
      } else if (par.state == 'close') {
        let obj = {
          state: 'open',
          timer: {
            time: new Date().getTime() + Number($('#Timer').val()) * 60000,
            step: Number($('#Timer').val()) * 60000,
            start: $("#timequantumS").val() || "00:00",
            end: $("#timequantumE").val() || "24:00"
          },
          condition: {
            namecondition: $("#namecondition").val().replace(/\，/g, ",").split(","),
            screeningconditions: $("#screeningconditions").val().replace(/\，/g, ",").split(","),
            pageturningnum: Number($("#pageturningnum").val())
          }
        }
        obj.timer.time = timecount(obj.timer.time, obj.timer.start, obj.timer.end)

        chrome.storage.local.set(obj, () => {
          $('#Start').html('关闭');
          $('.tips').text(`已开启自动更新,下次更新时间${new Date(obj.timer.time).toLocaleString("zh", { hour12: false })}`);
          $("#Start").css('background', "#5DAC81");
        })
      }
    })
  });


  $("body").on("click", "#openoption", function () {
    open("options.html")
  });

  $(".copyuuid").click(function (e) {
    e.preventDefault();
    copyToClip(uuid);
  });

  $("body").on("click", ".houbuname", function () {
    open('reserve.html');
  });

  $(".token_check").click(function (e) {
    e.preventDefault();
    let token = $(".token_contains").val();
    token_check(token, (state) => {
      if (state.CanUse) {
        chrome.storage.local.set({
          token: token
        }, () => {
          location.reload();
        })
      } else {
        tip("密钥无效")
      }
    });
  });

  //操作控制部分
})



//获取UUID 
function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};


//复制到剪贴板
function copyToClip(content, message) {
  var aux = document.createElement("input");
  aux.setAttribute("value", content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  if (message == null) {
    tip("复制成功");
  } else if (message) {
    tip(message);
  }
}

//未激活状态
function NotActivated() {
  $(".tips").text(uuid);
  $(".copyuuid").show();
  $(".token_contains").show();
  $(".token_check").show();
}





//计算下次时间
function timecount(time, start, end) {
  // time:毫秒时间戳
  // start:HH:mm
  // end:HH:mm

  let backnextTime = time;
  let dc = Number(new Date(time).toLocaleTimeString("zh", {
    hour12: false
  }).replace(/\:/g, ""));
  console.log(dc)
  let numend = Number(end.replace(/\:/g, "").replace(/\：/g, "")) * 100;
  console.log(numend)
  let numstart = Number(start.replace(/\:/g, "").replace(/\：/g, "")) * 100;
  console.log(numstart)
  if (dc > numend) {
    // 切换到明天的开始时间
    let mingt = new Date(new Date().getTime() + 86400000).toLocaleDateString("zh", {
      hour12: false
    }) + " " + start;
    backnextTime = new Date(mingt).getTime();
  } else if (dc < numstart) {
    //切换到今天的开始时间
    let jint = new Date().toLocaleDateString("zh", {
      hour12: false
    }) + " " + start;
    backnextTime = new Date(jint).getTime()
  }
  return backnextTime
};