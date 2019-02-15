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