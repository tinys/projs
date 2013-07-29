var path = require('path');
var express = require('express');
var fs = require('fs');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var projectHTML = require('./iProject');
var getConfig = require('../config');
var getRrojectConfig = require('../projects').getRrojectConfig;
var projects = require('./projects');
path.existsSync = fs.existsSync ? function(uri){
  return fs.existsSync.call(fs,uri);
} : path.existsSync;

process.on('uncaughtException', function(err) {
  if(err.errno == "EADDRINUSE") return; // 
  console.error(err.errno);
  console.error('Caught exception: ', err);
});

var pidPath = path.join(__dirname,'.pid');
fs.writeFile(pidPath, process.pid);

process.on('SIGTERM', function() {
  //SIGTERM是kill的信号
  fs.unlink(pidPath,function(){
    console.log('deploy server killed');
    process.exit(0);
  });
});

(function startServer() {
  var app = express.createServer();
  app.use(express.bodyParser());//解析post params
  app.use(app.router);
  getConfig(function(config){
    deploy(app, config);

    app.use(express['static'](__dirname));
    app.use(express.directory(__dirname));

    app.listen(config.deploy_port);
  });
})();

function deploy(app, config) {
  app.get('/', function(req, res) {
    res.redirect('/projects.html');
  });

  // 添加数据
  app.post('/update-projects', function(req, res) {
    projects.update(req,res);
  });

  //部署工程
  app.get('/project-online', function(req, res) {
    res.writeHead(200, {
        'Content-Type' : 'text/html;charset=utf-8'
    });
    getConfig(function(config){
      getRrojectConfig(function(pConfig){
        config.online = true;
        config.pConfig = pConfig;
        Task.svnExport(req, res, config);
      },req.param('id',null));
    });
  });

  //部署工程
  app.get('/project-dev', function(req, res) {
    res.writeHead(200, {
        'Content-Type' : 'text/html;charset=utf-8'
    });
    getConfig(function(config){
      getRrojectConfig(function(pConfig){
        config.online = false;
        config.pConfig = pConfig;
        Task.svnExport(req, res, config);
      },req.param('id',null));
    });
  });
  
  // 输出
  function outPutByScript(res,text,encode,isOver,isError){
    isOver = isOver ? 1 : 0;
    isError = isError ? 1 : 0;
    var re = "<script>try{";
    re +='parent.projectStepCallback(\"';
    re += text.replace('\n','');
    re +='\"\,'+isOver+'\,'+isError+')\;\n';
    re +='}catch(e){}\n';
    re +='<\/script>\n';
    res.write(re);
  }

  var Task = {
    source:'',
    target:'',
    /**
     * 检出svn,使用svn svnExport
     * */
    svnExport:function(req, res,config){
      var id = req.param('id', null),
        name,
        passwd,
        url,
        projectParam,
        target;

      if(!id && id != 0){
        outPutByScript(res,"project_id is null.");
        res.end();
      }
      console.log(config);
      projectParam = config.pConfig;
      username = req.param('username',null);
      passwd = req.param('password',null);
      url = projectParam.url;
      target = projectParam.exports;



      if(!url || !target){
        outPutByScript(res,'Configuration parameter is not complete.')
        res.end();
      }

      // 目标路径
      this.target = path.join(config.workSpacePath, target);
      fs.writeFileSync("/tmp/_deploy_.txt", [username,url,target,(new Date().toLocaleString())].join('\n'));
  
      var arr = url.split('/');
      var source = this.source = path.join('/tmp/',username,target);
      
      Task.execute('rm',['-rf',source],req,res,function(req, res){//先清空临时输入目录
        Task.execute('mkdir',['-p',source],req,res,function(req, res){
          var params = ['clone',url,source],
            type = 'git';
          
          // 如果不是github,则用SVN打开
          if(req.url.split('https://github').length == 1){
            type = 'svn';
            params = ['export','--non-interactive','--force','--username',username,'--password',passwd,url,source];
          }

          Task.execute(type,params,req,res,function(req, res){
            Task.clear(req, res,config);
          });
        });
      });
    },
    /**
     * clear
     * */
    clear:function(req, res,config){
      var target = this.target;
      Task.execute('rm',['-rf', target],req,res,function(req,res,code){
        if(!config.online){
          var sep = path.sep || '/';
          var list  = Task.target.split(sep).filter(function(item) {
            return item !== '';
          });
          list.pop();
          target = path.join(sep,list.join(sep));
        }
        Task.execute('mkdir',['-p', target],req,res,function(req,res,code){
          if(config.online){
            Task.compress(req, res,config);
          }else{
            Task.move(req,res);
          }
        });
      });
    },
    /**
     * 打包工程,压缩合并文件
     * */
    compress:function(req, res,config){
      var jsPackager,
        projectPath,
        cssPackager,
        isJS = false;
      
      jsPackager = path.resolve(path.join(__dirname,'../../js/main.js'));
      cssPackager = path.resolve(path.join(__dirname,'../../css/main.js'));
      projectPath = Task.target.replace(config.workSpacePath,'');

      if(path.existsSync(this.source + '/js/')){
        isJS = true;
        var params = [jsPackager, Task.source,Task.target,projectPath,'-confspecial','-mangle','-squeeze','-verbose','-noMD5'];
      }else{
        var params = [cssPackager, Task.source,Task.target,projectPath,'-verbose','-noMD5'];
      }

      var node = process.execPath || 'node';
      var _this = this;
      _this.execute(node,params,req,res,function(req,res,code){
        outPutByScript(res,"Determine any CSS directory:"+(isJS && path.existsSync(_this.source + '/css/')));
        if(isJS && path.existsSync(_this.source + '/css/')){
          // 判断css
          outPutByScript(res,'Determine any CSS directory:');
          
          params = [cssPackager, Task.source,Task.target,projectPath,'-verbose','-noMD5'];
          _this.execute(node,params,req,res,function(reqs,ress,codes){
            Task.end(res,codes);
          })
        }else{
          Task.end(res,code);
        }
      });
    },
    move:function(req,res){
      var sep = path.sep || '/';
      var list  = Task.target.split(sep).filter(function(item) {
        return item !== '';
      });
      list.pop();
      var target = path.join(sep,list.join(sep));
      Task.execute('mv',[Task.source, target],req,res,function(req,res,code){
        Task.end(res,code);
      });
    },
    execute:function(cmd,params, req,res,callback){
      var spawnedProcess = spawn(cmd,params);
      outPutByScript(res,'exec ' + cmd + ' ' + params.join(' ') , 'utf-8');
      spawnedProcess.stdout.on('data', function(data) {
        data.toString().split('\n').forEach(function(line) {
          line && outPutByScript(res,line, 'utf-8');
        });
      });
      spawnedProcess.stderr.on('data', function(data) {
        console.error('stderr: ' + data);
        outPutByScript(res,data , 'utf-8');
      });
      spawnedProcess.on('exit', function(code) {
        console.log(cmd + ' process exited with code ' + code);
        var status = code == 1 ? 'Failed to perform the command!' : 'Command execution success!';
        outPutByScript(res,status, 'utf-8');
        if(code == 0){
          callback && callback(req,res,code);
        }else{
          outPutByScript(res,'','',true,true);
          res.end();
        }
      });
    },
    end:function(res,code){
      var status = code == 0 ? 'success!' : 'fail!';
      outPutByScript(res,'','',true,code == 0 ? false : true);
      res.end();
    }
  };
}