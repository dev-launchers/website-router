addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
    const requestURL = new URL(request.url);
    var resp;
    if (requestURL.pathname.startsWith("/content")) {
        resp = await fetchWordpress(request, requestURL)
    } else {
        resp = await fetch(request);
    }
    if (resp.status == 404 || resp.status > 500) {
        requestURL.pathname = "/";
        // const rootRequest = new Request(requestURL, request)
        // console.log("new request url", rootRequest)
        return await fetch(requestURL, request);
    } else if (resp.status == 500) {
        return await fetch(request);
    }
    return resp
}

async function fetchWordpress(request, requestURL) {
    var wpHostname;
    if (requestURL.hostname == "staging.devlaunchers.com") {
        wpHostname = "wordpress-staging.devlaunchers.com";
    } else {
        wpHostname = "wordpress.devlaunchers.com";
    }
    // Remove /content from beginning of path
    const wpPath = requestURL.pathname.replace("^/content", "");
    const wpURL = new URL(`https://${wpHostname}${wpPath}`);
    const wpReq = new Request(wpURL, request);
    return await fetch(wpReq)
}
