1. 开头：

   ```javascript
   #!/usr/bin/env node
   
   'use strict';
   
   
   /*
   	Taken from https://github.com/tapio/live-server for modification
   */
   ```

   

2. **依赖模块导入**：

   - 文件开始处导入了多个模块，包括文件系统操作（`fs`）、HTTP服务器（`http`）、静态文件服务器（`serve-index`）、日志记录（`morgan`）、WebSocket（`faye-websocket`）等。

     ```javascript
     var fs = require('fs'),
     	connect = require('connect'),
     	serveIndex = require('serve-index'),
     	logger = require('morgan'),
     	WebSocket = require('faye-websocket'),
     	path = require('path'),
     	url = require('url'),
     	http = require('http'),
     	send = require('send'),
     	open = require('opn'),
     	es = require("event-stream"),
     	os = require('os'),
     	chokidar = require('chokidar'),
     	httpProxy = require('http-proxy');
     require('colors');
     ```

     

3. **全局变量**：

   - 定义了`useBrowserExtension`变量，表示是否使用浏览器扩展。

   - 定义了`GET_INJECTED_CODE`函数，用于获取注入到HTML页面中的代码。

   - 定义了`LiveServer`对象，包含了服务器实例（`server`）、文件监控器（`watcher`）和日志级别（`logLevel`）。

     ```javascript
     let useBrowserExtension = false;
     let GET_INJECTED_CODE = () => {
     	if (!GET_INJECTED_CODE.cache){
     		GET_INJECTED_CODE.cache = fs.readFileSync(path.join(__dirname, "injected.html"), "utf8");
     	}
     
     	return useBrowserExtension === true ? '' : GET_INJECTED_CODE.cache;
     }
     
     var LiveServer = {
     	server: null,
     	watcher: null,
     	logLevel: 2
     };
     ```

4. **对HTML字符串进行转义**

   - 定义了一个名为`escape`的函数，其目的是对HTML字符串进行转义，以确保安全地嵌入HTML文档之中。转义是一种编码过程，用于防止HTML中的特殊字符（如`<`、`>`、`&`、`"`等）被浏览器误解为HTML标签。

     ```javascript
     function escape(html) {
     	return String(html)
         // .replace(...)方法使用正则表达式替换匹配的&字符为&amp;，这是&的实体编码。
         // /&(?!\w+;)/g是一个正则表达式，它匹配任何不跟随字母数字或下划线的&字符。
     		.replace(/&(?!\w+;)/g, '&amp;')
         // /</g匹配任何<字符。
         // .replace(...)方法将所有匹配的<字符替换为&lt;，这是<的实体编码。
     		.replace(/</g, '&lt;')
     		.replace(/>/g, '&gt;')
     		.replace(/"/g, '&quot;');
     }
     ```

     

5. **静态文件服务器**：

   - `staticServer`函数用于创建一个静态文件服务器，它处理GET和HEAD请求，并可以注入特定的代码到HTML文件中。

     ```javascript
     // // Based on connect.static(), but streamlined and with added code injecter
     function staticServer(root, onTagMissedCallback) {
     	var isFile = false;
     	try { // For supporting mounting files instead of just directories
     		isFile = fs.statSync(root).isFile();
     	} catch (e) {
     		if (e.code !== "ENOENT") throw e;
     	}
     	return function (req, res, next) {
     		if (req.method !== "GET" && req.method !== "HEAD") return next();
     		var reqpath = isFile ? "" : url.parse(req.url).pathname;
     		var hasNoOrigin = !req.headers.origin;
     		var injectCandidates = [
     			new RegExp("</body>", "i"),
     			new RegExp("</svg>"),
     			new RegExp("</head>", "i")
     		];
     
     		// extraInjectCandidates = extraInjectCandidates || [];
     		// extraInjectCandidates.forEach(item => {
     		// 	injectCandidates.push(new RegExp(`</${item}>`, "i"))
     		// });
     
     		var injectTag = null;
     
     		function directory() {
     			var pathname = url.parse(req.originalUrl).pathname;
     			res.statusCode = 301;
     			res.setHeader('Location', pathname + '/');
     			res.end('Redirecting to ' + escape(pathname) + '/');
     		}
     
     		function file(filepath /*, stat*/) {
     			var x = path.extname(filepath).toLocaleLowerCase(),
     				match,
     				possibleExtensions = ["", ".html", ".htm", ".xhtml", ".php", ".svg"];
     			if (hasNoOrigin && (possibleExtensions.indexOf(x) > -1)) {
     				// TODO: Sync file read here is not nice, but we need to determine if the html should be injected or not
     				var contents = fs.readFileSync(filepath, "utf8");
     				for (var i = 0; i < injectCandidates.length; ++i) {
     					match = injectCandidates[i].exec(contents);
     					if (match) {
     						injectTag = match[0];
     						break;
     					}
     				}
     
     				if (!injectTag && onTagMissedCallback) {
     					onTagMissedCallback();
     				}
     
     				if (injectTag === null && LiveServer.logLevel >= 3) {
     					console.warn("Failed to inject refresh script!".yellow,
     						"Couldn't find any of the tags ", injectCandidates, "from", filepath);
     				}
     			}
     		}
     
     		function error(err) {
     			if (err.status === 404) return next();
     			next(err);
     		}
     
     		function inject(stream) {
     			if (injectTag) {
     				// We need to modify the length given to browser
     				var len = GET_INJECTED_CODE().length + res.getHeader('Content-Length');
     				res.setHeader('Content-Length', len);
     				var originalPipe = stream.pipe;
     				stream.pipe = function (resp) {
     					originalPipe.call(stream, es.replace(new RegExp(injectTag, "i"), GET_INJECTED_CODE() + injectTag))
     					.pipe(resp);
     				};
     			}
     		}
     
     		send(req, reqpath, {
     			root: root
     		})
     			.on('error', error)
     			.on('directory', directory)
     			.on('file', file)
     			.on('stream', inject)
     			.pipe(res);
     	};
     }
     ```

     

6. **路由重写和入口点**：

   - `entryPoint`函数用于重写请求URL并将其传递给静态文件服务器。

     ```javascript
     /**
      * Rewrite request URL and pass it back to the static handler.
      * @param staticHandler {function} Next handler
      * @param file {string} Path to the entry point file
      */
     function entryPoint(staticHandler, file) {
     	if (!file) return function (req, res, next) {
     		next();
     	};
     
     	return function (req, res, next) {
     		req.url = "/" + file;
     		staticHandler(req, res, next);
     	};
     }
     ```

     

7. **启动服务器**：

   - `LiveServer.start`函数用于启动Live Server，接受多个参数，如主机名、端口、根目录、要监视的路径、要忽略的路径、日志级别等。

   - 该函数创建一个Web服务器，设置日志记录，添加中间件，设置静态文件服务器，并监听文件变化。

     

8. **WebSocket连接**：

   - 服务器启动后，会监听WebSocket连接，并在连接建立时发送一个消息。

     

9. **文件监控器**：

   - 使用`chokidar`模块来监控文件系统，并在文件变化时执行特定的操作。

     

10. **服务器关闭**：

    - `LiveServer.shutdown`函数用于关闭服务器和文件监控器。

      ```javascript
      LiveServer.shutdown = function () {
      	var watcher = LiveServer.watcher;
      	if (watcher) {
      		watcher.close();
      	}
      	var server = LiveServer.server;
      	if (server)
      		server.close();
      };
      
      ```

      

11. **模块导出**：

    - 文件末尾导出了`LiveServer`对象。

      ```javascript
      module.exports = LiveServer;
      ```

      