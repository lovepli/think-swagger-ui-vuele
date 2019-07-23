import store from '@/store'
/*
*{name:name,desc:desc,children:[{path:'/login',reqMethod:[]}]}
*/

const resolveMenu = function() {
  var menus = []
  const swaggerInfo = store.getters.swaggerInfo
  console.log(swaggerInfo, 'swaggerInfo')

  const paths = swaggerInfo.paths
  var tagMap = {}
  Array.from(Object.keys(paths)).forEach(path => {
    const reqMethod = paths[path]
    const firstTag = reqMethod[Object.keys(reqMethod)[0]].tags[0]

    var children = []
    children.push({path: path.substr(1, path.length - 1), key: path, reqMethod: reqMethod, meta: {icon: '', title: path}, routeParam: {firstTag: firstTag, path: path}})

    tagMap[firstTag] = (tagMap[firstTag] || []).concat(children)
  })

  Array.from(swaggerInfo.tags).forEach((tag, pindex) => {
    const hidden = tag.name === 'basic-error-controller'
    const children = tagMap[tag.name]
    children.forEach((child, index) => {
      child.routeParam.pindex = pindex
      child.routeParam.index = index
    })
    const menu = Object.assign({meta: {icon: '', title: tag.name }, path: '/swagger', key: tag.name, hidden: hidden}, tag, {children: children, routeParam: {}})
    menus.push(menu)
  })
  store.commit('menus', menus)

  return menus
}

export { resolveMenu }