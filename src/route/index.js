import m from "mithril";

let nodeApp = document.getElementById("app");



import main from '../views/main'

switch(0){
    case 0:
        m.route(document.body, "/future",{
            "/future": {
                render: function (vnode) {
                    return m(main,vnode.attrs)
                }
            }
        })
        break;
}
