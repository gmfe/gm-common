需要基于 gm-react-app 的项目，用了全局变量

```
__PRODUCTION__
__BRANCH__
__COMMIT__
__NAME__
__VERSION__
```

configHeaders()
配置请求头 X-Guanmai-Client and X-Guanmai-Request-Id

configTrace()
首次调用上报一次，后面每个请求都上报

configProgress(startCallback, doneCallback)

configError(errorCallback)
参数为错误 message

额外请求头带了
X-Guanmai-Timeout
X-Guanmai-Success-Code
