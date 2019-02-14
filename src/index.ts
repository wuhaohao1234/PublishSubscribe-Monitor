/**
 * 用户传递的数据state为一个对象
 * @param state
 */
interface IState  {
    [index: string]: any;
}
/**
 * 用户传递的行为
 * @param action
 */
type iAction = {
    type: string;
    val: any;
}
/**
 * 用户传递的修改数据的方法
 * @param changeState
 */
type iChangeState = (appSate: IState, action: iAction) => void

type irenderFun = () => void;
/**
 * 事件收集容器
 * @param listeners
 */
type ilisteners = {
    [index: number]: Function
}
/**
 * dispatch
 * 修改state数据
 * @param dispatch
 */
type idispatch = (action: iAction) => void;
type isubscribe = (listener: irenderFun) => void;
/**
 * createStore的返回值
 * @param store
 */ 
type iStore = {
    getState: IState;
    dispatch: idispatch;
    subscribe: isubscribe;
}

/**
 * 
 * @param state 初始数据
 * @param changeState 修改的方法
 * 
 * 返回subscribe添加渲染函数,dispatch修改行为,getState初始化数据
 */
function createStore(state: IState, changeState: iChangeState): iStore {
    let listeners: irenderFun[] = []
    let getState = () => state
    let dispatch = (action: iAction) => {
        changeState(getState(), action)
        listeners.forEach(listener => {
            listener()
        })
    }
    let subscribe = (listener: irenderFun) => listeners.push(listener)
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