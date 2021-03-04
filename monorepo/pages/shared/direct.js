import Vue from 'vue'


let index = 1
const dftBinding = (binding={}) => {
    return {
        index: index++,
        max: 3,
        ...binding
    }
}

Vue.directive('tab', {
    bind(el, binding={}){
        if(!el instanceof HTMLInputElement) throw 'v-tab只能用于input标签!'
        binding = dftBinding(binding)
        console.log(binding)
        el.setAttribute('tabindex', binding.index)
        el.addEventListener('input', e=>{
            console.log(e.target.value)
            if(e.target.value.length>=binding.max) {
                el.blur()
                const next = document.querySelector(`[tabindex="${binding.index+1}"]`)
                console.log(next)
                next && next.focus()
            }
        })
    }
})