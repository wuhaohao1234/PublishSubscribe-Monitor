/*
    <div id="add">
        <input v-model="msg"/>
        <span v-bind="msg" ></span>
    </div>
    new Vue({
        el:'#app',
        data:{
            msg:0
        }
    })
*/
interface Ioptions {
    [index: string]: any;
}
interface Idata {
    [key: string]: any;
}
type Icallback = <T>() => T | void;
interface Imethods {
    [index: string]: Icallback
}
class Vue {
    public options: Ioptions;
    public el: HTMLElement;
    public data: Idata;
    public methods: Imethods;
    constructor(options: Ioptions) {
        this.data = options.data || {}
        this.el = document.querySelector(options.el) || document.body
        this.methods = options.methods || {}
        this.observe(this.data)
        this.render(this.el)
    }
    private observe<T>(data: T): void | T {
        console.log(`这里要判断${JSON.stringify(data)}是对象还是数组,还是空值`)
        for (let key in data) {
            if (Object.prototype.toString.call(data[key]) === '[object Object]') {
                this.observe(data[key])
            } else if (!data[key]) {
                console.error('值不存在')
            }
            let value = data[key]
            let _this = this
            Object.defineProperty(data, key, {
                get() {
                    console.log('这里获取值')
                    return value
                },
                set(newValue: any) {
                    value = newValue
                    for (let methodkey in _this.methods) {
                        _this.methods[methodkey].call(_this, value)
                    }
                    return value
                }
            })
        }
    }
    private render<T extends HTMLElement>(el: T): void | T {
        /**
         * 假设用户传递过来的有input:v-model与span:v-bind
         */
        let inp: HTMLInputElement = el.querySelector('input')
        let keys: string = inp.getAttribute('v-model')
        inp.addEventListener('input', () => {
            this.data[keys] = inp.value
        })
    }
}
new Vue({
    el: '#app',
    data: {
        msg: '字符串'
    },
    methods: {
        rendSpan(msg: string) {
            this.el.querySelector('span').innerHTML = msg
        }
    }
})