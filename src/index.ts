/**
 * 用户传递的数据state为一个对象
 * @param state
 */
interface State {
    [index: string]: any;
}
/**
 * 用户传递的行为
 * @param action
 */
interface Action {
    type: string;
    val: any;
}
/**
 * 用户传递的修改数据的方法
 * @param changeState
 */
type ChangeState = <T>(getSate: T, action: Action) => void
/**
 * 用户传递渲染函数
 * @param listener RenderFun
 */
type RenderFun = <T>() => void;
/**
 * 事件收集容器,listeners必须是数组，里面只能存放函数
 * @param listeners
 */
interface Listeners {
    [index: number]: RenderFun
}
/**
 * dispatch
 * 修改state数据
 * @param dispatch
 */
type Dispatch = (action: Action) => void;
type Subscribe = (listener: RenderFun) => void;
/**
 * createStore的返回值
 * @param store
 */
interface Store {
    getState: State;
    dispatch: Dispatch;
    subscribe: Subscribe;
}
type GetState = <T>() => State;
/**
 * 
 * @param state 初始数据
 * @param changeState 修改的方法
 * 
 * 返回subscribe添加渲染函数,dispatch修改行为,getState初始化数据
 */
function createStore<T>(state: T, changeState: ChangeState): Store {
    let listeners: RenderFun[] = []
    let getState: GetState = () => state
    let dispatch = (action: Action) => {
        changeState(getState(), action)
        listeners.forEach((listener) => {
            listener()
        })
    }
    let subscribe = (listener: RenderFun) => listeners.push(listener)
    return {
        getState,
        dispatch,
        subscribe
    }
}

/*
const state = {
        msg:0
    }
    const render = function () {
        app.innerHTML = state.msg
    }
    const changeState = function (state,action) {
        switch (action.type) {
            case 'add':
                state.msg = action.val
                break;
            case 'del':
                state.msg = action.val
                break;
            default:
                break;
        }
    }
    let store = createStore(state,changeState)
    store.subscribe(render)
    render(store.getState())
    store.dispatch({
        type:'add',
        val:'1'
    })
    store.dispatch({
        type: 'add',
        val: '2'
    })
*/