
let _Vue;

class VueRouter{
    constructor({routes}){//传入路由配置
        //一个路由映射，用来匹配path获得当前路由选项current
        let routeMap = {};
        routes.forEach(route=>{
            let path = route.path;
            if(!routeMap[path]){}
            routeMap[path] = route;
        })
        this.routeMap = routeMap;
        this.current = {//当前路由选项
            path:'',
            component:{
                template:'<div>template</div>'
            }
        }
        this.listnener();
    }

    //监听url
    listnener(){
        let hash;
        window.addEventListener('load',()=>{//页面首次加载
            hash = window.location.hash;
            if(!hash){
                window.location.hash = '/';
            }
            let route = this.search(hash.slice(1));
            //因为current是响应式的，所以不能直接将普通对象给current赋值
            this.current.path = route?route.path:'/'
            this.current.component = route?route.component:{}
            
        })
        window.addEventListener('hashchange',()=>{//hash改变
             hash = window.location.hash;
             let route = this.search(hash.slice(1));
             this.current.path = route?route.path:'/'
            this.current.component = route?route.component:{}
        })

    }
    search(path){
        if(this.routeMap[path]){
            return this.routeMap[path]
        }else{
            return null;
        }
    }
}

VueRouter.install = (Vue)=>{
    //混入两个钩子函数
    //实现两个组件
    _Vue = Vue;
    _Vue.mixin({
        beforeCreate(){
            let vm = this;
            if(vm.$options.router){//router实例已经初始化
                //标记在哪个实例挂载了_router
                vm._routerRoot = this;
                //给vue实例加_router属性：router实例
                vm._router = vm.$options.router;
                //把路由选项变成响应式的，当路由变化时改变路由选项，更新视图
                _Vue.util.defineReactive(vm,'_route',vm._router.current)
            }else{
                vm._routerRoot = vm.$parent&&vm.$parent._routerRoot
            }
        },
        destroyed() {
            
        }

    })
    //注册两个组件
    _Vue.component('router-link',{
        render(h){ //h=>createElement
           return  h('a',{attrs:{href:'#'+this.to}},this.$slots.default)
        },
        props:['to']
    })
    _Vue.component('router-view',{
        render(h){ //h=>createElement
            let component = this._routerRoot._route.component
            return  h(component)
         }
    })

}

if(Vue){
    Vue.use(VueRouter);
}