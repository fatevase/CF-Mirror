// 白名单列表
let whiteList = ['Loyalsoldier/clash-rules', 'clash'];
let cache_times = 86400 / 24 // 1 hours
let github_dns = "https://raw.githubusercontent.com"
/**
 * @param {any} body
 * @param {number} status
 * @param {Object<string, string>} headers
 */
function makeRes(body, status = 200, headers = {}) {
    headers['access-control-allow-origin'] = '*'
    return new Response(body, {status, headers})
}

/**
 * @param {string} urlStr
 */
function newUrl(urlStr) {
    try {
        return new URL(urlStr)
    } catch (err) {
        return null
    }
}



addEventListener('fetch', event => {
  const ret = handleRequest(event).catch(err => makeRes('cfworker error:\n' + err.stack, 502))
  event.respondWith(ret)
})

async function handleRequest(event) {
  const req = event.request 
  const url = newUrl(req.url)
  const path = url.pathname

  // 当白名单不为空时，进行过滤
  if (whiteList.length > 0 && !whiteList.some(whitelisted => url.pathname.includes(whitelisted))) {
    return new Response('Blocked', {status: 403})
  }

  // 构建新的GitHub请求URL
    // 判断是否为 Github 的 release
    const is_release = url.pathname.includes('/releases/');

    // 根据是否为 release 来构建新的 GitHub 请求 URL
    let github_url = new URL(
      `https://${is_release ? 'github.com' : 'raw.githubusercontent.com'}${path}`
    );
    if (is_release) {
      github_url.pathname = github_url.pathname.replace('/releases/download', '/releases/download');
    } else {
      github_url.pathname = github_url.pathname.replace('/blob', '');
    }


  // 检查缓存中是否存在此请求
  let response = await caches.default.match(req)

  if (!response) {
    // 如果不在缓存中，则从GitHub获取
    response = await fetch(github_url.toString(), {
      headers: req.headers,
    })

    // 如果响应是ok的，将其缓存
    if (response.ok) {
      let responseClone = response.clone()

      // 转化主体为二进制数据，以确保主体被完全读取
      let body = await responseClone.arrayBuffer()

      // 创建新的响应，它有新的头部和旧的主体
      response = new Response(body, {
        headers: {
          ...Object.fromEntries(response.headers),
          'Cache-Control': `public, max-age=${cache_times}`,
        },
        status: response.status,
        statusText: response.statusText,
      })

      // 把新的响应放到缓存中
      event.waitUntil(caches.default.put(req, response.clone()))
    }
  }

  return response
}