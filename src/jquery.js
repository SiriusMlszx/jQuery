window.$ = window.jQuery = function (selectorOrArrayOrTemplate) {
    let elements
    if (typeof selectorOrArrayOrTemplate === 'string') {
        if (selectorOrArrayOrTemplate[0] === '<') {
            // 创建div
            elements = [createElement(selectorOrArrayOrTemplate)]
        } else {
            // 查找div
            elements = document.querySelectorAll(selectorOrArrayOrTemplate)
        }
    } else if (selectorOrArrayOrTemplate instanceof Array) {
        elements = selectorOrArrayOrTemplate
    }

    function createElement(string) {
        const container = document.createElement("template")
        container.innerHTML = string.trim()
        return container.content.firstChild
    }
    const api = Object.create(jQuery.prototype) // 创建一个对象，这个对象的__proto__为括号里面的东西
    // api.elements = elements
    // api.oldApi = selectorOrArrayOrTemplate.oldApi
    Object.assign(api, {
        elements: elements,
        oldApi: selectorOrArrayOrTemplate.oldApi
    })
    return api
}

jQuery.fn = jQuery.prototype = {
    jquery: true,
    constructor: jQuery,
    parent() {
        const array = []
        this.each((node) => {
            if (array.indexOf(node.parentNode) === -1){
                array.push(node.parentNode)
                }
            
        })
        return jQuery(array)
    },
    get(index) {
        return this.elements[index]
    },
    appendTo(node) {
        if (node instanceof Element) {
            this.each(el => node.appendChild(el)) // 遍历elements，对每个el进行node.appendChild
        } else if (node.jquery === true) {
            this.each(el => node.get(0).appendChild(el)) // 遍历elements，对每个el进行node.get(0).appendChild
        }
    },
    append(children) {
        if (children instanceof Element) {
            this.get(0).appendChild(children)
        } else if (children instanceof HTMLCollection) {
            for (let i = 0; i < children.length; i++){
                this.get(0).appendChild(children[i])
            }
        } else if (children.jquery === true) {
            children.each(node => this.get(0).appendChild(node))
        }
    },
    children() {
        const array = []
        this.each((node) => {
                array.push(...node.children) // 可以把元素铺开
            })
        return jQuery(array)
    },
    each(fn) {
        for (let i = 0; i < elements.length; i++){
            fn.call(null, elements[i], i)
        } 
        return this
    },
    print() {
        console.log(elements)
    },
    // 闭包：函数访问外部的变量
    addClass(className) {
        for (let i = 0; i < elements.length; i++){
            elements[i].classList.add(className)
        }
        return this
    },
    find(selector) {
        let array = []
        for (let i = 0; i < elements.length; i++){
            array = array.concat(Array.from(elements[i].querySelectorAll(selector)))
        }
        array.oldApi = this // this是旧api
        console.log(array)
        console.log(jQuery(array))
        return jQuery(array)
    },
    end() {
        return this.oldApi // this就是新api
    },
}