import { remove } from '../utils'

let uid = 0

class Dep {
  constructor () {
    this.subs = []
    this.id = uid++
  }

  addSub (sub) {
    this.subs.push(sub) // 订阅
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this) // 让Watcher添加自己
    }
  }

  notify () {
    for (let i = 0; i < this.subs.length; i++) {
      this.subs[i].update() // 发布
    }
  }

  removeSub (sub) {
    remove(this.subs, sub)
  }

  static target = null
}

export default Dep

// 收集依赖：发布订阅模式
