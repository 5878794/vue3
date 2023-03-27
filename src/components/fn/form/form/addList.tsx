import { defineComponent, inject, ref, reactive, toRefs } from 'vue'
import formStyle from './css/formStyle.module.scss'
import { formItemType } from '../input/input.type'
import formDom from './index'
import button from '../input/index'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
import handlerData from './fn/addList_handlerData'
import guid from './fn/guid'
import { cloneDeep } from 'lodash'
import { Delete } from '@element-plus/icons-vue'
import boxStyle from '../input/css/box.module.scss'

export default defineComponent({
  name: 'add-list',
  components: { ElTableColumn, ElTable },
  props: {
    canMdf: { type: Boolean, default: true },
    labelWidth: { type: String, default: '120px' },
    serverData: {
      type: Object, default: () => ({})
    },
    formSetting: {
      type: Array, default: () => ([])
    },
    id: { type: String, default: '' },
    pagination: { type: Boolean, default: true },
    submitData: { type: Object, default: () => ({}) },
    rowIndex: { type: Array, default: () => ([]) },
    pageSize: { type: Number, default: 10 },
    height: { type: Number, default: 200 }
  },
  setup (props, { expose }) {
    const root = inject('root')
    const fns = inject('fns')
    const cache = reactive<{ data: any, show: any, delIds: string[], nowShow: any }>({
      data: [],
      show: [],
      nowShow: [],
      delIds: []
    })
    const createShowData = handlerData(
      props.serverData,
      props.formSetting as formItemType[],
      cache
    )

    const addListMainRef = ref(null)
    const getAndCheckFormData = () => {
      return (addListMainRef.value as any).checkAndGetData()
    }
    const add = (data: any) => {
      const back: any = {}
      const form = addListMainRef.value as any
      for (const [key, val] of Object.entries(data)) {
        const info = form.find(key).getParam()
        const options = info.options
        const label = options
          ? options.find((item: any) => item.value.toString() === (val as any).toString())?.label
          : val
        back[key] = { label, value: val }
        back.__guid__ = guid()
      }
      cache.data.push(back)
      refreshTotal()
    }
    const del = (guid?: string) => {
      const delIds = guid ? [guid] : cache.delIds
      const newData: any = []
      cache.data.map((rs: any) => {
        if (!delIds.includes(rs.__guid__)) {
          newData.push(rs)
        }
        return null
      })
      cache.data = newData
      refreshTotal()
    }
    const refreshTotal = () => {
      totalPage.value = cache.data.length
      const start = (currentPage.value - 1) * props.pageSize
      const end = start + props.pageSize
      createShowData()
      if (props.pagination) {
        cache.nowShow = cache.show.slice(start, end)
      } else {
        cache.nowShow = cache.show
      }
    }

    const currentPage = ref(1)
    const totalPage = ref(1)
    refreshTotal()

    const getData = () => {
      const backData = cloneDeep(cache.data)
      backData.map((rs: any) => {
        delete rs.__guid__
        return null
      })
      return backData
    }

    const checkFiled = () => {
      return true
    }

    const find = (key: string) => {
      const formDom = addListMainRef.value as any
      return formDom.find(key)
    }

    const checkAndGetData = () => {
      const pass = checkFiled()
      const data = getData()

      return {
        pass: pass,
        data: data

      }
    }

    const refreshFormData = (data: any) => {
      // cache.formData = data
    }
    const selectionChangeFn = (ids: any) => {
      const back: string[] = []
      ids.map((obj: any) => {
        back.push(obj.__guid__)
        return null
      })
      cache.delIds = back
    }
    const handlerCurrentChangeFn = () => {
      refreshTotal()
    }

    expose({ getData, checkFiled, find, checkAndGetData })
    return {
      getData,
      checkFiled,
      find,
      checkAndGetData,
      fns,
      add,
      del,
      addListMainRef,
      getAndCheckFormData,
      refreshFormData,
      selectionChangeFn,
      handlerCurrentChangeFn,
      currentPage,
      totalPage,
      ...toRefs(cache)
    }
  },
  render () {
    const renderAddInputs = () => {
      const tag = formDom
      return <tag
        uploadFn={(this.fns as any).uploadFn}
        showBigImageFn={(this.fns as any).showBigImageFn}
        ref="addListMainRef"
        key="addListMainRef"
        formSetting={this.formSetting}
        labelWidth={this.labelWidth}
        rule={(this.fns as any).rule}
        onChange={(obj: any) => {
          this.refreshFormData(obj.formData)
        }}
      />
    }

    const renderButton = () => {
      const tag = button
      const addBtnParam = {
        type: 'button',
        label: '增加',
        buttonIcon: 'CirclePlusFilled',
        style: 'width:auto;',
        clickFn: () => {
          const rs = this.getAndCheckFormData()
          if (rs.pass) {
            this.add(rs.data)
          }
        }
      }
      const delBtnParam = {
        type: 'button',
        label: '删除',
        style: 'margin-left:20px;width:auto;',
        buttonIcon: 'RemoveFilled',
        buttonType: 'danger',
        clickFn: () => {
          this.del()
        }
      }
      return <div class={[boxStyle.box_hrc, boxStyle.box_lines]}>
        <tag propData={addBtnParam}/>
        <tag propData={delBtnParam}/>
      </div>
    }

    const renderTable = () => {
      return <el-table
        height={this.height}
        data={this.nowShow}
        tableLayout='fixed'
        onSelectionChange={this.selectionChangeFn}
      >
        <el-table-column type='selection' width='55px'/>
        <el-table-column label='序号' property='__index__'/>
        {
          this.formSetting.map((item: any) => {
            return <el-table-column
              property={item.key}
              label={item.label}
            />
          })
        }
        <el-table-column
          width='80px'
          label='操作'
          v-slots={
            {
              default: (scope: any) => {
                const fn = () => {
                  this.del(scope.row.__guid__)
                }
                const tag = Delete
                return <tag style='color:red;width:1.2em;cursor:pointer;'/>
                // return <div onClick={fn}>del</div>
              }
            }
          }
        />
      </el-table>
    }

    const renderPagination = () => {
      return <ElPagination
        v-model:currentPage={this.currentPage}
        page-size={this.pageSize}
        small={false}
        total={this.totalPage}
        layout='total,prev,pager,next'
        onCurrent-change={this.handlerCurrentChangeFn}
      />
    }

    return <div class={[formStyle.form_item, '__add_list__']}>
      {renderAddInputs()}
      {renderButton()}
      {renderTable()}
      {this.pagination && this.data.length > 0 && renderPagination()}
    </div>
  }
})
