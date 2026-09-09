import proxy from "express-http-proxy";

export const proxyWithHeader = (serviceUrl) => {
     
    return proxy(serviceUrl, {
        proxyReqPathResolver: (req) => {
            return req.originalUrl;
        },
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            proxyReqOpts.headers = proxyReqOpts.headers || {};
            if (srcReq.user) {
                proxyReqOpts.headers["x-user-id"] = srcReq?.user?.userId;
                proxyReqOpts.headers["x-user-type"] = srcReq?.user?.type;
            }
            return proxyReqOpts;
        }
    })
}