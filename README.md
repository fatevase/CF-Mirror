# CF-Mirror
由于部分文件直接在github中下载缓慢，个人使用cloudflare做一下中转再下载。

CF文件：https://workers.cloudflare.com

## 初始化
注册，登陆，`Workers & Pages`->`Overview`，`Create application`,`Create a Worker`。

复制 index.js 到代码框，`Save and deploy`。或者之后使用Quick edit 编辑。

代码的最前面两行是配置文件
```javascript
let whiteList = []; // setting white list, empty means no use white list

let cache_times = 86400 / 24 // 1 hours cache times
```
> 白名单主要是控制那些需要那些不需要 可以直接指定用户名和项目或者关键词， eg：['Loyalsoldier/clash-rules', 'nvidia']
> 前者表示只会镜像下载clash-rules的文件，后者表示路径中包含nvidia的都可以。

## 使用
使用简单，假设workers默认域名或者绑定的域名。`https://devgithub.com`, 

需要下载的文件为https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/icloud.txt,  

则改为 https://`devgithub.com`/Loyalsoldier/clash-rules/release/icloud.txt 

需要下载的 https://github.com/Fndroid/clash_for_windows_pkg/releases/download/0.20.28/Clash.for.Windows.Setup.0.20.28.exe，
则改为 https://`devgithub.com`/Fndroid/clash_for_windows_pkg/releases/download/0.20.28/Clash.for.Windows.Setup.0.20.28.exe

