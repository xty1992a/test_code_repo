/**
 * Created by TY-xie on 2018/11/26.
 */
import axios from 'axios'
import {getParams} from 'libs/libs'
import Vue from '@vue'
import AttentionAction from 'components/attention-action'

const AttentionConstructor = Vue.extend(AttentionAction)

const params = getParams()
let imagePath = ''

;(function () {})()

export function isNeedAttention(text = '') {
  if (imagePath) {
    showAttention(text, imagePath)
    return true
  }
  return false
}

function showAttention(text = '', imagePath = '') {
  // const instance = new AttentionConstructor({data: {text, imagePath}})
  // instance.vm = instance.$mount()
  // instance.vm.visibility = true
  // document.body.appendChild(instance.vm.$el)
}

export default showAttention
