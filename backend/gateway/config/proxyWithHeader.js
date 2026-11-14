import proxy from "express-http-proxy";

export const proxyWithHeader = (serviceUrl) => {
    return proxy(serviceUrl, {
        proxyReqPathResolver: (req) => {
            return req.originalUrl;
        },

        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            proxyReqOpts.headers = proxyReqOpts.headers || {};

            // Remove any client-supplied identity headers.
            delete proxyReqOpts.headers["x-user-id"];
            delete proxyReqOpts.headers["x-user-type"];

            const user = srcReq.user;

            if (user?.userId) {
                proxyReqOpts.headers["x-user-id"] = String(user.userId);
            }

            if (user?.type) {
                proxyReqOpts.headers["x-user-type"] = String(user.type);
            }

            // console.log("Gateway user:", user);
            // console.log("Forwarded headers:", {
            //     userId: proxyReqOpts.headers["x-user-id"],
            //     userType: proxyReqOpts.headers["x-user-type"],
            // });

            return proxyReqOpts;
        },
    });
};
