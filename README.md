# PublishSubscribe-Monitor
    发布订阅模式与监听着模式
## ts环境处理
1. 初始化
`npm init -y`
2. 根目录配置tsconfig.json文件
```
    # tsconfig.json
    {
        "compileOnSave": true,
        "compilerOptions": {
            "module": "es6",
            "outDir": "./dist",
            "sourceMap": true,//生成map文件(可以自动追踪到ts文件的代码错误)
            "target": "es6",
            "removeComments": true,//删除注释
            "declaration": false,//没有描述
            "moduleResolution": "node",//node模块
            "noImplicitAny": true,
            "experimentalDecorators": true
        },
        "exclude": [
            "dist",
            "node_modules",
            "**/*.spec.ts"
        ],
        "include": [
            "src/**/*"
        ]
    }
```
3. 根目录配置tslint.json检查代码规则文件
```
#tslint.json
{
    "defaultSeverity": "error",
    "extends": "tslint:recommended",
    "jsRules": {},
    "rules": {
        "interface-name": false,
        "trailing-comma": false,
        "max-classes-per-file": false,
        "ordered-imports": false,
        "variable-name": false,
        "prefer-const": false,
        "member-ordering": false,
        "no-bitwise": false,
        "forin": false,
        "object-literal-sort-keys": false,
        "one-line": [
            false
        ],
        "object-literal-key-quotes": [
            false
        ],
        "no-string-literal": false,
        "no-angle-bracket-type-assertion": false,
        "only-arrow-functions": false,
        "no-namespace": false,
        "no-internal-module": false,
        "unified-signatures": false,
        "ban-types": false,
        "no-conditional-assignment": false,
        "radix": false,
        "no-console":false,
        "semicolon":false,
        "eofline":false,
        "quotemark":false,
        "no-unused-variable":false,
        "no-trailing-whitespace":false,
        "no-unused-expression":false,
        "no-empty":false
    },
    "rulesDirectory": []
}
```
4. package.json中scripts字段配置
```
"dev": "tsc -w",  //开发时根据tsconfig.json自动将src下的所有ts文件编译为dist下的js文件
"build": "tsc",   //编译所有ts文件
"lint": "tslint --project tslint.json"//根据tslint.json文件匹配出src下文件中的格式错误
```
## 监听者模式
    例如事件addEventListerner,当每次触发行为时，页面自动更新
    当数据变化时，自动渲染页面

    观察者(Observer)相当于事件监听者（监听器），被观察者(Observable)相当于事件源和事件，执行逻辑时通知observer即可触发oberver的update,同时可传被观察者和参数。
```
button.addEventListener('click',()=>{
    //dosomething
})
```

* redux中的dispatch
```
<script>
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
</script>
```
## 发布订阅模式
```
interface IClientList {
    [key: string]: any[];
}
interface IEvents {
    clientList: IClientList;
    listen: <T>(key: string, fn: T) => boolean;
    trigger: (key: string) => boolean;
}
class Events implements IEvents {
    public clientList: IClientList = {}
    public listen<T>(key: string, fn: T): boolean {
        if (!this.clientList[key]) {
            this.clientList[key] = []
        }
        this.clientList[key].push(fn)
        return true
    }
    public trigger(key: string): boolean {
        const fns: any[] = this.clientList[key]
        if (!fns || fns.length === 0) {
            return false
        }
        for (let fn of fns) {
            fn.call(undefined,key)
        }
        return true
    }
}

let events = new Events()
events.listen('add', (str: string) => {
    console.log(str + '这是加法函数')
})
events.listen('add', (str: string) => {
    console.log(str + '这是减法函数')
})
events.trigger('add')
```