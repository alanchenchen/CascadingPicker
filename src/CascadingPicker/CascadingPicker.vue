<template>
	<div class="Cascading-picker">
		<transition name="fade">
			<div class="mask" @click="clickModal" v-if="Boolean(value)"></div>
		</transition>
		<transition name="animate">
			<div class="picker" v-if="Boolean(value)">
				<div class="picker-head">
					<div>
						<span @click="cancel">
							<slot name="cancelText">取消</slot>
						</span>
					</div>
					<div>
						<span @click="ok">
							<slot name="okText">确定</slot>
						</span>
					</div>
				</div>
				<div class="picker-wrap">
					<div class="content">
						<div class="content-item" :class="{w50:hasTown}" v-picker.province="{set:set, get: get}" ref="province">
							<div class="picker-item">
								<div class="item" v-for="(val,index) of pickerData" :class="{color:index==pIndex}" :key="val.name">{{val.name}}</div>
							</div>
						</div>
						<div class="content-item" :class="{w50:hasTown}" v-picker.city="{set:set, get: get}" ref="city">
							<div class="picker-item">
								<div class="item" v-for="(val,index) of city" :class="{color:index==cIndex}" :key="index">{{val.name?val.name:val}}</div>
							</div>
						</div>
						<div class="content-item" :class="{w0:hasTown}" v-picker.town="{set:set, get: get}" ref="town">
							<div class="picker-item">
								<div class="item" v-for="(val,index) of town" :class="{color:index==tIndex}" :key="val">{{val}}</div>
							</div>
						</div>
					</div>
					<div class="line"></div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>

export default {
	/**
	 * comoponent: CascadingPicker 三级联动，默认提供地址三级联动数据
	 * author： Alan Chen
	 * contact：739709491@qq.com
	 * lastDate: 2018/10/12
	 * 使用：
	 *	props: 
	 *  	1. value， 布尔值，控制地址选择器显示与否,可以使用v-model绑定变量，默认为false
	 *		2. initial，对象，格式为{first:'', second: '', third: ''}，对应的value必须是data中的字符串，如果不是，则默认显示第一条 
	 *		3. data，数组，三级联动的数据。格式必须与address-data一致
	 *		4. closeOnClickModal，布尔值。是否能够点击遮罩层来关闭，默认为false
	 *	emit events：
	 *		1. ok，点击确定按钮触发。返回一个参数，格式为{first: '', second: '', third: ''}，为选中的值
	 *		2. cancel，点击取消按钮触发，如果开启closeOnClickModal也会触发，无参数返回值
	 *	slot:
	 *		[name] okText, 字符串，点击右侧确定按钮的文本
	 *		[name] cancelText, 字符串，点击左侧取消按钮的文本
	 */
	name: 'CascadingPicker',
	props:{
		/* v-model绑定 */
		value: {
			type: Boolean,
			default: false
		},
		/* 默认选中值 */
		initial: {
			type: Object,
			default() {
				return {
					first: '',
					second: '',
					third: ''
				}
			}
		},
		/* 三级联动的数据*/
		data: {
			type: Array,
			required: true
		},
		/* 是否能够点击遮罩层关闭 */
		closeOnClickModal: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			pickerData: this.data,
			/* 通过一个开关来判断是否让三级联动，初始值传入会触发watch，此时不需要三级联动 */
			initalRender: true,
			pIndex: 0,
			cIndex: 0,
			tIndex: 0
		}
	},
	computed:{
		province(){
			return this.pickerData[this.pIndex].name;
		},
		city(){
			return this.pickerData[this.pIndex].list.length==1
				   ? this.pickerData[this.pIndex].list[0].secondList
				   : this.pickerData[this.pIndex].list;
		},
		town(){
			return this.pickerData[this.pIndex].list.length==1
			       ? []
				   : this.pickerData[this.pIndex].list[this.cIndex].secondList;
		},
		hasTown(){
			return this.pickerData[this.pIndex].list.length==1
		}
	},
	/* mounted之后先根据props的inital来初始化各个索引 */
	mounted() {
		this.resetIndex()
	},
	methods: {
		ok() {
			let first = this.province;
			let second = this.city[this.cIndex].name || this.city[this.cIndex]
			let third = this.town[this.tIndex]?this.town[this.tIndex]:''
			/* 每次点击确定事件，将地址选择器重置到初始状态 */
			this.resetIndex()
			this.$emit('input', false)
			this.$emit('ok',{ first, second, third})
		},
		cancel() {
			/* 每次点击取消事件，将地址选择器重置到初始状态 */
			this.resetIndex()
			this.$emit('input', false)
			this.$emit('cancel')
		},
		clickModal() {
			if(this.closeOnClickModal) {
				this.cancel()
			}
		},
		/* 重置所有索引值，会先取props的inital值，取不到则为0 */
		resetIndex() {
			this.initalRender = true
			const firstIndex = this.pickerData.findIndex(item => {
				return item.name == this.initial.first
			})
			/* 每获取到一个索引，必须赋值，这样才能触发computed的值！ */
			this.pIndex = firstIndex > 0
						? firstIndex
						: 0

			const secondIndex = this.city.findIndex(item => {
				const hasList = typeof item == 'object'
				return hasList
					? item.name == this.initial.second
					: item == this.initial.second
			})
			this.cIndex = secondIndex > 0
						? secondIndex
						: 0

			const thirdIndex = this.town.findIndex(item => {
				return item == this.initial.third
			})

			this.tIndex = thirdIndex > 0
						? thirdIndex
					    : 0
		},
		/* 和directive交互，获取当前的对应name索引 */
		get(name) {
			if(name == 'province'){
				return this.pIndex
			}else if(name == 'city'){
				return this.cIndex
			}else{
				return this.tIndex
			}
		},
		/* 和directive交互，设置当前的对应name索引 */
		set(name, index) {
			/* 每次手动触发索引变化，需要关闭initalRender，开启watch来三级联动 */
			this.initalRender = false
			if(name == 'province'){
				this.pIndex = index
			}else if(name == 'city'){
				this.cIndex = index
			}else{
				this.tIndex = index
			}
		}
	},
	watch:{
		/* 当picker节点初始渲染时，位移到指定索引位置 */
		value(val) { 
			if(val) {
				this.$nextTick(() => {
					this.$refs.province.children[0].style.transform = `translateY(${-this.pIndex}rem)`
					this.$refs.city.children[0].style.transform = `translateY(${-this.cIndex}rem)`
					this.$refs.town.children[0].style.transform = `translateY(${-this.tIndex}rem)`
				})
			}
		},
		/* 只让watch在非initalRender时才三级联动，因为初始值渲染时不需要联动 */
		pIndex(){
			if(!this.initalRender) { 
				this.cIndex = 0
				this.tIndex = 0
				this.$refs.city.children[0].style.transform = 'translateY(0)'
				this.$refs.town.children[0].style.transform = 'translateY(0)'
			}
		},
		cIndex(){
			if(!this.initalRender) {
				this.tIndex = 0
				this.$refs.town.children[0].style.transform = 'translateY(0)'
			}
		}
	},
	directives:{
		picker:{
			bind(el, binding){
				let startY = '',
					differY = '';
				let len = el.children[0].children.length
				let dom = el.children[0]
				let maxY = -(len-1)
				let r = Number.parseFloat(document.documentElement.style.fontSize)
				/* 初始idnex和初始位移先从props的initial取，没有则全为0 */
				let index, currentY

				/* 通过get方法通信，先获取当前索引 */
				if(binding.modifiers.province){
					index = binding.value.get('province')
				}else if(binding.modifiers.city){
					index = binding.value.get('city')
				}else if(binding.modifiers.town){
					index = binding.value.get('town')
				} 
				currentY = -index

				el.addEventListener('touchstart',(e)=>{
					e.preventDefault();
					if(dom.style.transform == 'translateY(0px)'){
						currentY = 0
						maxY = -(el.children[0].children.length-1)
					}
					let ev = e.touches[0]
					startY = ev.clientY
				});

				el.addEventListener('touchmove',(e)=>{
					e.preventDefault()
					let ev = e.touches[0]
					differY = ev.clientY - startY
					dom.style.transition = 'transform 0s'		
					dom.style.transform = `translateY(${currentY*r+differY}px)`
				});

				el.addEventListener('touchend',(e)=>{
					e.preventDefault()
					let ev = e.changedTouches[0]
					differY = ev.clientY - startY
					dom.style.transition = 'transform .3s'
					if(differY <= -r/2){
						currentY += Math.floor(differY/r)
						if(currentY<=maxY)currentY = maxY
					}
					else if(differY >= r/2){
						currentY += Math.floor(differY/r)
						if(currentY>=0)currentY = 0
					}
					dom.style.transform = `translateY(${currentY}rem)`
					/* 记录当前位移在数组中的索引,必须取整，否则会出现浮点数 */
					index = Math.floor(Math.abs(currentY/1))
					if(binding.modifiers.province){
						var name = 'province'
					}else if(binding.modifiers.city){
						var name = 'city'
					}else if(binding.modifiers.town){
						var name = 'town'
					}
					binding.value.set(name, index)
				});
			}
		}
	}
}
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{
	transition: all .3s;
}
.fade-enter,.fade-leave-to{
	opacity: 1;
}
.animate-enter-active,.animate-leave-active{
	transition: all .3s;
}
.animate-enter,.animate-leave-to{
	transform:translateY(100%);
}
.w50{
	width: 50% !important;
}
.w0{
	width:0% !important;
}
.mask{
	position:fixed;
	left: 0;
	bottom: 0;
	z-index: 10;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,.6);
}
.picker .color{
	color:#000;
	font-weight: bold;
}
.picker{
	position:fixed;
	left: 0;
	bottom: 0;
	z-index: 10;
	width: 100%;
	height: 5.5rem;
	background: #fff;
}
.picker-head{
	display: flex;
	justify-content: space-around;
	padding: 0 .3rem;
	height: .8rem;
	font-size: .3rem;
	color: #2395ff;
	background: #efefef;
}
.picker-head div{
	flex-grow: .4;
	line-height: .8rem;
}
.picker-head div:nth-child(1){
	text-align: left;
}
.picker-head div:nth-child(2){
	text-align: right;
}
.picker-wrap{
	position: relative;
	height: 4.7rem;
}
.content{
	display: flex;
	width:100%;
	height: 100%;
}
.content-item{
	width: 33.33%;
	height: 100%;
	overflow: hidden;
	transition:width .3s;
}
.picker-item{
	position: relative;
	z-index: 10;
	width:100%;
	top: 1.85rem;
}
.item{
	flex-grow: 3;
	height: 1rem;
	line-height: 1rem;
	font-size: .3rem;
	color:#707274;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-align: center;
}
.line{
	position: absolute;
	top:50%;
	left: 0;
	margin-top: -.5rem;
	width:100%;
	height: 1rem;
	border-top:.02rem solid #ddd ;
	border-bottom:.02rem solid #ddd ;
}
</style>
