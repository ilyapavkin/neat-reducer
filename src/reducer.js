export default class Reducer {
    constructor(initial) {
        this.callMap = {};
        this.parent = null;
        this.listen = [];
        this.default = null;
        const func = (state = initial, action, getState) => {
            if(action === undefined) {
                return state;
            }
            const handler = this.callMap[action.type];
            if(handler !== undefined) {
                return handler(state, action, getState);
            }
            if(this.default === false) {
                throw new Error(`${action.type} missfire (reducer handler is not defined)`);
            }
            if(typeof this.default === 'function') {
                return this.default(state, action, getState);
            }
            return state;
        }
        func.on = (message, execute) => {
            if(typeof message !== 'string') {
                throw new Error(`message must be string, got ${typeof message}`);
            }
            if(this.callMap[message] !== undefined) {
                throw new Error(`${message} already defined (reducer handler redefinition is not allowed)`);
            }
            if(typeof execute !== 'function') {
                throw new Error(`${message} handler is not a function`);
            }
            this.callMap[message] = execute;
            this.listen.push(message);
            if(this.parent !== null) {
                this.parent.onUpdate(this);
            }
            return func;
        };
        func.notifyOnChange = (parent) => {
            this.parent = parent;
        };
        func.default = (handler) => {
            if(handler === false || handler === null || typeof handler === 'function') {
                this.default = handler;
            }
            throw new Error('default handler can only be function, null of false');
        }
        Object.defineProperty(func, 'listen', {
            get: () => this.listen
        });
        return func;
    }
};
