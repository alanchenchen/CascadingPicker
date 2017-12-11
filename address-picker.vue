/*
*author :Alan Chen
*e-mail: 739709491@qq.com
*/
<template>
	<div class="address-picker">
		<transition name="fade">
			<div class="mask" @click="cancel" v-if="addressShow"></div>
		</transition>
		<transition name="animate">
			<div class="picker" v-if="addressShow">
				<div class="picker-head">
					<div>
						<span @click="cancel">取消</span>
					</div>
					<div>
						<span @click="ok">确定</span>
					</div>
				</div>
				<div class="picker-wrap">
					<div class="content">
						<div class="content-item" :class="{w50:hasTown}" v-picker.province="{set:set}" ref="province">
							<div class="picker-item">
								<div class="item" v-for="(val,index) of address" :class="{color:index==pIndex}" :key="val.name">{{val.name}}</div>
							</div>
						</div>
						<div class="content-item" :class="{w50:hasTown}" v-picker.city="{set:set}" ref="city">
							<div class="picker-item">
								<div class="item" v-for="(val,index) of city" :class="{color:index==cIndex}" :key="index">{{val.name?val.name:val}}</div>
							</div>
						</div>
						<div class="content-item" :class="{w0:hasTown}" v-picker.town="{set:set}" ref="town">
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
import address from './address-data'
export default{
	/**
	 * 使用：
	 * 1.必须传一个props:'addressShow'，布尔值，控制地址选择器显示与否
	 * 2.自定义ok和cancel事件，表示当address-picker组件点击确定按钮和取消按钮的操作，
	 * 3.ok事件将当前选中的省市区传给父组件事件，cancel事件让父组件的addressShow值变为false
	 */
	props:['addressShow'],
	data(){
		return{
			address:address,
			pIndex:0,
			cIndex:0,
			tIndex:0
		}
	},
	computed:{
		province(){
			return this.address[this.pIndex].name;
		},
		city(){
			return this.address[this.pIndex].cityList.length==1?this.address[this.pIndex].cityList[0].areaList:this.address[this.pIndex].cityList;
		},
		town(){
			return this.address[this.pIndex].cityList.length==1?[]:this.address[this.pIndex].cityList[this.cIndex].areaList;
		},
		hasTown(){
			return this.address[this.pIndex].cityList.length==1
		}
	},
	methods:{
		ok(){
			let pro = this.province;
			let cit = this.city[this.cIndex].name || this.city[this.cIndex];
			let tow = this.town[this.tIndex]?this.town[this.tIndex]:'';
			//每次点击确定事件，将地址选择器重置到初始状态
			this.pIndex = 0;
			this.cIndex = 0;
			this.$emit('ok',{province:pro,city:cit,town:tow});
		},
		cancel(){
			//每次点击取消事件，将地址选择器重置到初始状态
			this.pIndex = 0;
			this.cIndex = 0;
			this.$emit('cancel');
		},
		set(name,index){
			if(name == 'province'){
				this.pIndex = index;
			}else if(name == 'city'){
				this.cIndex = index;
			}else{
				this.tIndex = index;
			}
		}
	},
	watch:{
		pIndex(){
			this.cIndex = 0;
			this.tIndex = 0;
			this.$refs.city.children[0].style.transform = 'translateY(0)';
			this.$refs.town.children[0].style.transform = 'translateY(0)';
		},
		cIndex(){
			this.tIndex = 0;
			this.$refs.town.children[0].style.transform = 'translateY(0)';
		}
	},
	directives:{
		picker:{
			bind(el,binding){
				let startY = '',
					differY = '';
				let currentY = 0;
				let len = el.children[0].children.length;
				let dom = el.children[0];
				let index = 0;
				let maxY = -(len-1);
				let r = Number.parseFloat(document.documentElement.style.fontSize);
				el.addEventListener('touchstart',(e)=>{
					e.preventDefault();
					if(dom.style.transform == 'translateY(0px)'){
						currentY = 0;
						maxY = -(el.children[0].children.length-1);
					}
					let ev = e.touches[0];
					startY = ev.clientY;
				});
				el.addEventListener('touchmove',(e)=>{
					e.preventDefault();
					let ev = e.touches[0];
					differY = ev.clientY - startY;
					dom.style.transition = 'transform 0s';			
					dom.style.transform = `translateY(${currentY*r+differY}px)`;
				});
				el.addEventListener('touchend',(e)=>{
					e.preventDefault();
					let ev = e.changedTouches[0];
					differY = ev.clientY - startY;
					dom.style.transition = 'transform .3s';
					if(differY <= -r/2){
						currentY += Math.floor(differY/r);
						if(currentY<=maxY)currentY = maxY;
					}
					else if(differY >= r/2){
						currentY += Math.floor(differY/r);
						if(currentY>=0)currentY = 0;
					}
					dom.style.transform = `translateY(${currentY}rem)`;
					index = Math.floor(Math.abs(currentY/1));//记录当前位移在数组中的索引,必须取整，否则会出现浮点数
					if(binding.modifiers.province){
						var name = 'province';
					}else if(binding.modifiers.city){
						var name = 'city';
					}else if(binding.modifiers.town){
						var name = 'town';
					}
					binding.value.set(name,index);
				});
			}
		}
	}
}
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{
	transition: all .3s linear;
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
