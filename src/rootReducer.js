class RootReducer {
    constructor(initial) {
        this.reducers = {};
        this.callMap = {};
        this.listens = [];
        this.initial = initial;

        const rebuildMap = () => {
            const newMap = {};
            const mapAsArray = Object.values(this.reducers).map(r => r.listens.map(l => ({ msg: l, reducer: r}))).flat();
            mapAsArray.map(el => {
                if (newMap[el.msg] === undefined) {
                    newMap[el.msg] = [];
                }
                newMap[el.msg].push(el.reducer);
                return el;
            })
            this.callMap = newMap;
            this.listens = Object.keys(this.callMap);
        }

        const func = (state = this.initial, action) => {
            if(this.callMap[action.type] !== undefined) {
                const call = this.callMap[action.type]
                    .map(name => ({name, newState: this.reducers[name](state[name], action, () => state)}))
                    .reduce((acc, el) => {
                        acc[el.name] = el.newState;
                        return acc
                    }, {});
                const r = {
                    ...state,
                    ...call
                };
                return r;
            }
            return state;
        };

        func.add = (name, reducer) => {
            if(this.reducers[name] !== undefined) {
                throw new Error(`${name} reducer is already defined`);
            }
            reducer.listen.map(l => {
                if(this.listens.indexOf(l) === -1) {
                    this.callMap[l] = [name];
                } else {
                    this.callMap[l].push(name);
                }
                return l;
            });
            this.reducers[name] = reducer;
            reducer.notifyOnChange(this);
            this.initial[name] = {
                ...this.initial[name],
                ...reducer()
            }
        };

        func.onUpdate = () => {
            rebuildMap();
        };

        return func;
    }
}

export default RootReducer;
