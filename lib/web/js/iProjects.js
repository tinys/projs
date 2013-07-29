/**
 * i-project manage page
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-05-27 18:50:48
 * @version $Id$
 */
;(function($){
  var tpl = {},
    localCache = {},
    formObj,
    box;
  box = $('#project-list');
  tpl.project = $('#tpl_project_list').html();
  tpl.a2mForm = $('#tpl_a2m_project').html();

  localCache.projects = $.parseJSON(localStorage.getItem('projects') || null);

  // 转换成Array
  localCache.projects = $.makeArray(localCache.projects);

  createProjectList(localCache);

  // 添加
  $(document.body).delegate('[action-type=pack]','click',function(evt){
    var data = $.queryToJson($(evt.currentTarget).attr('action-data')),
      url = data.type == "dev" ? '/project-dev' : 'project-online';
    var iframe = $('<iframe>').css('display','none'),
    projectData = getProjectDataById(data.id);
    $('body').append(iframe);
    $('.cmd-box').show();
    box.hide();
    projectStepCallback('开始打包...');
    setTimeout(function(){
      iframe.attr('src',url+'?'+$.param({
        id: projectData.id,
        username: projectData.username,
        password: projectData.password
      }));
    },1000);
    evt.preventDefault();
  });

  // 返回
  $(document.body).delegate('[action-type=pack-success-back]','click',function(evt){
    $('.cmd-box').hide();
    box.show();
    evt.preventDefault();
  });

  // 添加
  $(box).delegate('[action-type=add_project]','click',function(evt){
    var target = evt.currentTarget,
      parentNode = $(target).parents()[0],
      parentWidgetNode = $(target).parents('.pro-widget-base');

    createA2MProjectForm(parentWidgetNode,
      localCache.projects.length == 0 ? 'replaceWith' : 'after',
      null,
      parentNode
    );

    evt.preventDefault();
  });

  // 更新
  $(box).delegate('[action-type=update_project]','click',function(evt){
    var target = evt.currentTarget,
      id = $(target).attr('node-value'),
      parentWidgetNode = $(target).parents('.pro-widget-base'),
      projectData = getProjectDataById(id);

    createA2MProjectForm(parentWidgetNode,'after',projectData).val(projectData);
    evt.preventDefault();
  });

  /*
   * 生成project_list
   * @param data {Object} 数据
   */
  function createProjectList(data){
    box.html($.easyTemplate(tpl.project,data).toString());
  }

  /*
   * @param data {Object} 数据
   */
  function createA2MProjectForm(target,name,data,parentNode){
    if(formObj){
      formObj.destroy();
    }

    formObj = createProjectFormObj({
      data: data,
      create: function(){
        try{
          $(parentNode).hide();
        }catch(e){}
      },
      destroy: function(){
        try{
          $(parentNode).show();
        }catch(e){}
      }
    });

    if(target && name){
      target[name](formObj.getBox());
    }

    return formObj;
  }

  /** 
   * 获取数据
   */
  function getProjectDataById(id){
    var re = {};
    $.map(localCache.projects,function(project){
      if(project.id == id){
        re = project;
      }
    });
    return re;
  }

  /*
   * 创建一个表单对象
   * @param Opts {Object}
   */
  function createProjectFormObj(Opts){
    var that = {},
      init,
      box,
      Opts = Opts || {},
      evt = $.Callbacks(),
      destroy,
      bindEvent;


    // 事件
    bindEvent = function(){
      $(box).delegate('[action-type="save_project"]','click',callbackSaveEvt);
      $(box).delegate('[action-type="remove_project"]','click',callbackRemoveEvt);

      // 保存成功后
      evt.add(function(data){
        localStorage.setItem('projects',JSON.stringify(data));
        createProjectList(localCache);
      });
    };

    // 保存
    function callbackSaveEvt(evt){
      var data = getFormData();
      if(data.url && data.name && data.exports && data.username && data.password){
        data.id = data.id || new Date().getTime();
        saveDataToServer(data);
      }else{
        alert("内容不能空");
      }
      evt.preventDefault();
    }

    // 移除
    function callbackRemoveEvt(evt){
      var target = evt.currentTarget,
        id = $(target).attr('node-value');

      if(id){
        $.each(localCache.projects,function(key,project){
          if(project.id == id){
            localCache.projects.splice(key,1);
          }
        });
        that.evt.fire(localCache.projects);
      }
      evt.preventDefault();
    }

    /*
     * 获取表单数据
     * 
     */
    function getFormData(){
      var data = {};
      $.each($(":input",$(box)),function(key,node){
        var name;
        if(name = $(node).attr('name')){
          data[name] = $(node).val().trim();
        }
      });
      return data;
    }

     /*
     * 保存表单数据
     */
    function saveDataToServer(data){
      var requestData = {},
        isHave;

      // 如果存在
      $.each(localCache.projects,function(key,value){
        if(data.id == value.id){
          localCache.projects[key] = data;
          isHave = true;
        }
      });

      // 如果不存在
      if(!isHave){
        localCache.projects.push(data);
      }

      // 删除重要数据
      requestData = $.map(localCache.projects,function(project){
        var _project = {};
        _project = $.extend(_project,project);
        delete _project.username;
        delete _project.password
        return _project;
      });

      // 保存到本地
      $.ajax({
        url: 'update-projects',
        data: {
          content:JSON.stringify(requestData)
        },
        type: 'post',
        success: function(res){
          evt.fire(localCache.projects);
        }
      });
    }

    /*
     * mergeData
     */
    function mergeData(data){
      return {
        id: data ? data.id : new Date().getTime(),
        name: data ? 1 : 0,
        data: data
      }
    };

    /*
     * 获取结点
     */
     function getBox(){
      return box;
     }

    /** 
     * 设置值
     */
    function val(data){
      $.each(data,function(key,value){
        $(box).find(':input[name='+key+']').val(value);
      });
    }

    /* 
     * 销毁组件
     */ 
    destroy = function(){
      try{
        Opts.destroy.apply(that);
      }catch(e){}
      try{
        $(box).remove();
        evt.remove();
      }catch(e){}
    };

    // init
    init = function(){
      box = $($.easyTemplate(tpl.a2mForm,mergeData(Opts.data)).toString())
      bindEvent();
      try{
        Opts.create.apply(that);
      }catch(e){}
    };

    // 执行init
    init();

    that.val = val;
    that.evt = evt;
    that.destroy = destroy;
    that.getBox = getBox;
    return that;
  }

})(jQuery);;

// cmd
;(function($){
  var box = $('.cmd-box .cmd-box-list'),
    cmdTitle = $('.cmd-box .cmd-box-title');
  window.projectStepCallback = function(text,isOver,isError){
    cmdTitle.html('正在打包中...');
    box[0].innerHTML += '<div class="cmd-line">'+decodeURIComponent(text)+'</div>';
    if(isOver == true){
      cmdTitle.html('打包完成，<a href="javascript:;" action-type="pack-success-back">返回</a>');
      box[0].innerHTML +='<div class="cmd-line">结束,<a href="javascript:;" action-type="pack-success-back">返回</a></div>';
    }

    if(isError){
      cmdTitle.html('出错了，<a href="javascript:;" action-type="pack-success-back">返回</a>');
    }
    box.find('.cmd-line').last()[0].scrollIntoView();
  }
})(jQuery);