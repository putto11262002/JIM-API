import Router = require("koa-router");
export interface IAppRouterContext extends Router.IRouterContext {
    state: {
        auth: {
            id: string;
            role: string;
        };
    };
}
