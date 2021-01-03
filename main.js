const log = console.log.bind(console)
const clear = console.clear.bind(console)

test()

function test() {
    clear()
    log(`-----------------------------------${ new Date().toLocaleTimeString() }`)
    const wfb = makeObject()
    setProperty(wfb, 'name', 'weifubao')
    setProperty(wfb, 'sayHello', function(that) {
        log(`hello, i'm ${ getProperty(that, 'name') }`)
    })
    getProperty(wfb, 'sayHello')()
    setProperty(wfb, 'name', 'baobao')
    getProperty(wfb, 'sayHello')()
}

/* TODO: 实现一个 logObject(wfb)
 *  {
 *       name: 'weifubao',
 *       sayHello: function() {},
 *  }
 *  提示: 先实现一个 getKeys 函数
 * */
function logObject(o) {
    //
    log('o')
}

/* TODO: 扩展 makeObject 可以通过字面量设置属性
 *   makeObject(`{
 *        name: 'weifubao',
 *        sayHello: function() {},
 *   }`)
 * */
function makeObject() {
    var o = makeList()
    function getProperty(p) {
        // 等价于 var target = o.find(item => item[0] === p)
        var target = findList(o, item => refList(item, 0) === p)
        // 等价于 var value = target[1]
        var value = refList(target, 1)
        return typeof value === 'function'
            // ? value.bind(null, z)
            ? bind(value, z)
            : value
    }
    function setProperty(p, v) {
        // 等价于 o.find(item => item[0] === p)
        var target = findList(o, item => refList(item, 0) === p)
        if (target) {
            // 这里用新数组替换了老数组, 目的是替换其中一个元素
            o = mapList(
                o,
                (item, index) => {
                    // 生成 [p, v]
                    var newValue = makeList()
                    newValue = pushList(newValue, refList(item, 0))
                    newValue = pushList(newValue, v)
                    // 如果有这个 p 就替换新的 [p, v]
                    return (refList(item, 0) === p ? newValue : item)
                },
            )
        } else {
            // [p, v]
            var newValue = makeList()
            newValue = pushList(newValue, p)
            newValue = pushList(newValue, v)
            o = pushList(o, newValue)
        }
    }
    function z(m) {
        if (m === 'setProperty') {
            return setProperty
        } else if (m === 'getProperty') {
            return getProperty
        } else {
            throw new Error('对不起没有这个方法')
        }
    }
    return z
}

/*
 * TODO: 添加属性描述, 实现 defineProperty 功能
 * */
function setProperty(o, p, v) {
    //
    return o('setProperty')(p, v)
}

/*
 * TODO: 添加一个 setPrototype 函数
 *  支持设置 object 的原型
 *  扩展 getProperty 提供原型功能
 * */
function getProperty(o, p) {
    //
    return o('getProperty')(p)
}

function makeList() {
    // 开始于无 -- 也是操作结束的标志
    return null
}

function pushList(list, v) {
    // 有东西吗
    if (!list) {
        // 没有东西, 那就直接添加
        return cons(v, null)
    } else {
        // 有东西就取出一个, 添加到剩余部分中 (缩小问题规模)
        // 再把取出来的和添加之后的合并起来
        // --------- 注意下面都是这个思路的反复使用
        return cons(car(list), pushList(cdr(list), v))
    }
}

function findList(list, condition) {
    // 有东西吗
    if (!list) {
        return null
    } else if (condition(car(list))) {
        // 是他
        return car(list)
    } else {
        // 非他, 就到剩余的部分中寻找
        return findList(cdr(list), condition)
    }
}

function refList(list, index) {
    // 有东西吗
    if (!list) {
        return null
    } else if (index === 0) {
        // 是第一个东西吗
        return car(list)
    } else {
        // 去掉第一个东西, 同时让 index 缩小 1
        return refList(cdr(list), index - 1)
    }
}

function mapList(list, proc) {
    if (list === null) {
        return proc(list)
    } else {
        // 取出第一个, 处理一下, 然后和其它的处理完的合并起来
        return cons(proc(car(list)), mapList(cdr(list), proc))
    }
}

// 这个世界只有 "他", "非他"
function cons(a, b) {
    return function(i) {
        return i === 0 ? a : b
    }
}

// 他
function car(z) {
    //
    return z(0)
}

// 非他
function cdr(z) {
    //
    return z(1)
}

function bind(fn, value) {
    // 这里用到了展开运算符, 有些作弊, 考虑用 curry 改写
    return function(...args) {
        return fn(value, ...args)
    }
}

