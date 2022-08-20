<!-- 
	自定义表单页面
-->
<template>
	<view class="" :style="themeColor">
		<view class="form-main" :style="diyWidth">
			<block v-for="(item,itemIndex) in diyDatasNew" :key="itemIndex">
				
				<!-- field_type: 1// 类型  字段类型1单行文本 2多行文本 3身份证字段 4下拉框 5多选框 6单选框 6图片 7日期 8日期范围 9时间 10时间范围 11城市 -->
				<!-- 单行文本 -->
				<block v-if="item.field_type==='1' || item.field_type==='3'">
					<view class="dis-flex flex-x-between flex-y-center form-item" :style="{background:bgColor}">
						 <view class="col-3 f-28 f-title num-height-1"><text v-if="item.required==='1'" class="f-28 form-require">*</text>{{item.name}}</view>
						 <view class="form-input">
							<input 
							:type="item.field_type==='1'?'text':'idcard'"
							@change="getFormItemVal(itemIndex,$event)" 
							:placeholder="item.tips" 
							cursor="4" 
							:style="{'text-align':textAlign}" 
							v-model="item.default" 
							class="custom-form-input f-28"/>
							<view class="col-9 f-28 view-rt">
								<text class="iconfont icon-write f-28" style="margin-left:10rpx;"></text>
							</view>
						 </view>
					</view>
				</block>
				
				
				
				<!-- 多行文本 -->
				<block v-if="item.field_type==='2'">
					<view class="form-item" :style="{height:'auto',background:bgColor}">
						<view class="col-3 f-28 one-title"><text v-if="item.required==='1'" class="f-28 form-require">*</text>{{item.name}}</view>
						<view class="form-input" style="width:100%;padding:20rpx 0;">
							<!--  -->
							<textarea 
							:focus="isShowTextare" 
							v-if="isShowTextare || !item.default"
							class="f-28" 
							@blur="getFormTextAreItemVal(itemIndex,$event)"  
							:placeholder="item.tips" 
							:value="item.default" 
							style="width: 100%;height:160rpx;line-height:40rpx;" />
							<text 
							v-else 
							class="f-28 textarea-text" 
							@click="isShowTextare=true">{{item.default}}</text>
							<text class="iconfont icon-write f-28 col-9" style="margin-left:4rpx;position:absolute;right:0;bottom:20rpx;"></text>
						</view>
					</view>
				</block>
				
				
				
				<!-- 下拉框(普通) -->
				<block v-if="item.field_type==='4'">
					<view class="dis-flex flex-x-between flex-y-center form-item" :style="{background:bgColor}">
						<view class="col-3 f-28 f-title num-height-1"><text v-if="item.required==='1'" class="f-28 form-require">*</text>{{item.name}}</view>
						<view class="form-input">
							<picker 
							mode="selector" 
							:range="item.meal" 
							range-key="balanceone" 
							:value="index" 
							class="f-28"
							@change="getPickerVal(item.meal,itemIndex,$event)">
								<view class="picker-view">{{ idToBalanceone(item.field_type,item.default,item.meal) }}</view>
							</picker>
							<view class="col-9 f-28 view-rt">
								<text v-if="!item.default">{{ item.tips }}</text>
								<text class="m-left12">></text>
							</view>
						</view>
					</view>
				</block>
				
				
				<!-- 多选 -->
				<block v-if="item.field_type==='5'">
					<view class="form-item form-item-more" :style="{background:bgColor}">
						<view class="col-3 f-28 one-title"><text v-if="item.required==='1'" class="f-28 form-require">*</text>{{item.name}}</view>
						<view class="form-input" style="width:100%;padding:20rpx 0;">
							<checkbox-group class="dis-flex  flex-y-center flex-warp" @change="getFormItemVal(itemIndex,$event,item.field_type)" v-model="item.default">
								<label style="width: 33.3%;overflow: hidden;display: inline-block;" class="f-28 m-top10 num-height-1" v-for="(it,index) in item.meal">
									<checkbox 
									:value="it.id" 
									:checked="isChecked(item.field_type,item.default,it)"
									class="custom_checkbox" 
									color="#FFCC33" 
									style="transform:scale(0.7)" />
									{{ it.balanceone }}
								</label>
							</checkbox-group>
						</view>
					</view>
				</block>
				
				
				
				<!-- 单选 -->
				<block v-if="item.field_type==='6'">
					<view class="form-item form-item-more" :style="{background:bgColor}">
						<view class="col-3 f-28 one-title"><text v-if="item.required==='1'" class="f-28 form-require">*</text>{{item.name}}</view>
						<view class="form-input" style="width:100%;padding:20rpx 0;">
							<radio-group class="dis-flex  flex-y-center flex-warp" @change="getFormItemVal(itemIndex,$event,item.field_type)" v-model="item.default">
								<label style="width: 33.3%;overflow: hidden;display: inline-block;" class="f-28 m-top10 num-height-1" v-for="(it,index) in item.meal">
									<radio  
									:value="it.id" 
									:checked="isChecked(item.field_type,item.default,it)"
									class="custom_radio" 
									color="#FFCC33" 
									style="transform:scale(0.7)" />
									{{ it.balanceone }}
								</label>
							</radio-group>
						</view>
					</view>
				</block>
				
				
				<!-- 下拉框(日期) -->
				<block v-if="item.field_type==='7'">
					<view class="dis-flex flex-x-between flex-y-center form-item" :style="{background:bgColor}">
						<view class="col-3 f-28 f-title num-height-1"><text v-if="item.required==='1'" class="f-28 form-require">*</text>{{item.name}}</view>
						<view class="form-input">
							<picker 
							mode="date" 
							class="f-28" 
							:value="item.default" 
							@change="getFormItemVal(itemIndex,$event)">
								<view class="picker-view">{{ item.default }}</view>
							</picker>
							<view class="col-9 f-28 view-rt">
								<text v-if="!item.default">{{ item.tips }}</text>
								<text class="m-left12">></text>
							</view>
						</view>
					</view>
				</block>
				
				
				<!-- 日期范围 -->
				<block v-if="item.field_type==='8'">
					<view class="dis-flex flex-x-between flex-y-center form-item" :style="{background:bgColor}">
						<view class="col-3 f-28 f-title num-height-1"><text v-if="item.required==='1'" class="f-28 form-require">*</text>{{item.name.startname}}</view>
						<view class="form-input">
							<picker 
							mode="date" 
							class="f-28" 
							:value="item.default.startappointdata" 
							@change="getFormItemVal(itemIndex,$event,item.field_type,'start')">
								<view class="picker-view">{{ item.default.startappointdata }}</view>
							</picker>
							<view class="col-9 f-28 view-rt">
								<text v-if="!item.default.startappointdata">{{ item.tips.starttips }}</text>
								<text class="m-left12">></text>
							</view>
						</view>
					</view>
					<view class="dis-flex flex-x-between flex-y-center form-item" :style="{background:bgColor}">
						<view class="col-3 f-28 f-title num-height-1"><text v-if="item.required==='1'" class="f-28 form-require">*</text>{{item.name.endname}}</view>
						<view class="form-input">
							<picker 
							mode="date" 
							class="f-28" 
							:value="item.default.endappointdata" 
							@change="getFormItemVal(itemIndex,$event,item.field_type,'end')">
								<view class="picker-view">{{ item.default.endappointdata }}</view>
							</picker>
							<view class="col-9 f-28 view-rt">
								<text v-if="!item.default.endappointdata">{{ item.tips.endtips }}</text>
								<text class="m-left12">></text>
							</view>
						</view>
					</view>
				</block>
				
				
				<!-- 时间 -->
				<block v-if="item.field_type==='9'">
					<view class="dis-flex flex-x-between flex-y-center form-item" :style="{background:bgColor}">
						<view class="col-3 f-28 f-title num-height-1"><text v-if="item.required==='1'" class="f-28 form-require">*</text>{{item.name}}</view>
						<view class="form-input" @click="showpicker('time',itemIndex)">
							<view class="col-9 f-28 view-rt">
								<text class="col-3 f-28 pd-rt" v-if="item.default">{{item.default}}</text>
								<text class="col-9 f-28 pd-rt" v-else>{{ item.tips }}</text>
								<text class="m-left12">></text>
							</view>
						</view>
					</view>
				</block>
				
			
				
				<!-- 时间范围 -->
				<block v-if="item.field_type==='10'">
					<view class="dis-flex flex-x-between flex-y-center form-item" :style="{background:bgColor}">
						<view class="col-3 f-28 f-title num-height-1"><text v-if="item.required==='1'" class="f-28 form-require">*</text>{{item.name.startname}}</view>
						<view class="form-input" @click="showpicker('time',itemIndex,'',item.field_type,'start')">
							<view class="col-9 f-28 view-rt">
								<text class="col-3 f-28 pd-rt" v-if="item.default.startappointdata">{{item.default.startappointdata}}</text>
								<text class="col-9 f-28 pd-rt" v-else>{{ item.tips.starttips }}</text>
								<text class="m-left12">></text>
							</view>
						</view>
					</view>
					<view class="dis-flex flex-x-between flex-y-center form-item" :style="{background:bgColor}">
						<view class="col-3 f-28 f-title num-height-1"><text v-if="item.required==='1'" class="f-28 form-require">*</text>{{item.name.endname}}</view>
						<view class="form-input" @click="showpicker('time',itemIndex,'',item.field_type,'end')">
							<view class="col-9 f-28 view-rt">
								<text class="col-3 f-28 pd-rt" v-if="item.default.endappointdata">{{item.default.endappointdata}}</text>
								<text class="col-9 f-28 pd-rt" v-else>{{ item.tips.endtips }}</text>
								<text class="m-left12">></text>
							</view>
						</view>
					</view>
				</block>
				
			
				
				<!-- 省市区 -->
				<block v-if="item.field_type==='11'">
					<view class="dis-flex flex-x-between flex-y-center form-item" :style="{background:bgColor}">
						<view class="col-3 f-28 f-title num-height-1"><text v-if="item.required==='1'" class="f-28 form-require">*</text>{{item.name}}</view>
						<view class="form-input" @click="showpicker('city',itemIndex,item.citytype)">
							<view class="col-9 f-28 view-rt">
								<text class="col-3 f-28 pd-rt" v-if="region.length>0">{{region[0]}}{{region[1]}}{{region[2]}}</text>
								<text class="col-9 f-28 pd-rt" v-else>{{ item.tips }}</text>
								<text class="m-left12">></text>
							</view>
						</view>
					</view>
				</block>
				
				
				
				<!-- 上传图片 -->
				<block v-if="item.field_type==='12'">
					<view class="form-image" :style="{height:'auto',background:bgColor}">
						<view class="one-title">
							<text class="f-28 col-3"><text v-if="item.required==='1'" class="f-28 form-require">*</text>{{item.name}}</text>
						</view>
						<view class="dis-flex flex-warp">
							<image src="../../static/images/goods/jiahao.png" mode="" @click="addImage(itemIndex,item.number)" class="m-top20"></image>
							<view class="image-part m-left20 m-top20" v-for="(it,index) in item.default" :key='index'>
								<image :src="it" mode="" class="" class="display-image"></image>
								<image src="../../static/images/goods/del.png" mode="" class="del" @click="delImage(index,item.default,itemIndex)"></image>
							</view>
						</view>
					</view>
				</block>
			
			</block>
			
			
			
		 
			
			 <!-- 自定义下拉选择框 -->
			<block v-if="pickerTimeVisibility" ref="mpvueTimePicker">
			 <view class="mpvue-picker-time">
				<view :class="{'pickerMask':showTimePicker}" @click.stop="pickerTimeCancel" catchtouchmove="true"></view>
				<view class="mpvue-picker-content " :class="{'mpvue-picker-view-show':showTimePicker}">
					<view class="mpvue-picker__hd" catchtouchmove="true">
						<view class="mpvue-picker__action" @click.stop="pickerTimeCancel">取消</view>
						<view class="mpvue-picker__action" :style="{color:themeColor}" @click.stop="pickerTimeConfirm">确定</view>
					</view>
					<!-- 时分秒 -->
					<picker-view indicator-style="height: 40px;" class="mpvue-picker-view" :value="pickerTimeValueInfo()"  @change="pickerTimeChange">
						<picker-view-column>
							<view class="picker-item f-28" v-for="(item,index) in 24" :key="index">{{ index<10?'0'+index:index }}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="picker-item f-28" v-for="(item,index) in 60" :key="index">{{index<10?'0'+index:index}}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="picker-item f-28" v-for="(item,index) in 60" :key="index">{{index<10?'0'+index:index}}</view>
						</picker-view-column>
					</picker-view>
				</view>
			 </view>
			</block>
		</view>
		<!-- 省市区三级联动 -->
		<view style="width: 750rpx;">
			<CityPicker
			ref="mpvueCityPicker" 
			:cityType="cityType==='1'?'pc':'pca'" 
			:pickerValueDefault="cityPickerValueDefault" 
			@onConfirm="onCityConfirm">
			</CityPicker>
		</view>
	</view>
</template>

<script>
	import PopupView from "@/components/template/PopManager.vue"
	import App from "@/common/js/app.js" 
	import cityList from "@/common/js/cityData.js"
	import CityPicker from "@/components/threeComponents/mpvueCityPicker.vue"
	const {
		provinceData,
		cityData,
		areaData
	} = cityList;
	
	export default {
		data() {
			return {
				showTimePicker: false,
				cityType: '',   // 1省市 2省市区
				isShowTextare: false,
				region: [],  //省市区
				code: [],  //省市区编码
				// themeColor: '#007AFF', //颜色
				cityPickerValueDefault: [0, 0, 0], //默认选项
				cityIndex: 0,
				
				time: '',
				timeIndex: 0,
				pickerTimeValue: "00:00:00",
				// 时间范围
				timeFieldType: '',
				timeStatus: '',
				
				diyDatasNew: [],
				chooseImgArr: [],
				localIds: [],
				textAlign: 'right',
				cityPickerVisibility:false
			}
		},
		computed:{
			// 下拉框id置换文本信息
			idToBalanceone(){
				return function(field_type,id,meal){
					if( field_type === '4' ){
						let balanceone=''							
						meal.map(item=>{	
							if(item.id === id){
								balanceone = item.balanceone
							}
						})
						return balanceone
					}
				}
			},
			// 多/单选框选中回显
			isChecked(){
				return function(field_type,id,meal){
					// 多选
					if( field_type === '5' ){
						if( id ){
							id = id.split(',')
							return id.includes(meal.id)
						}
					}
					// 单选
					else if( field_type === '6' ){
						return id === meal.id
					}
				}
			},
			// 时间回显
			pickerTimeValueInfo(){
				return function(){
					let itemDefault = this.diyDatasNew[this.timeIndex].default
					if( this.timeFieldType === '9' ){
						this.pickerTimeValue = itemDefault || '00:00:00'
						return this.pickerTimeValue
					}
					else if( this.timeFieldType === '10' ){
						if( this.timeStatus == 'start' ){
							this.pickerTimeValue = itemDefault.startappointdata || '00:00:00'
						}
						else{
							this.pickerTimeValue = itemDefault.endappointdata || '00:00:00'
						}
						return this.pickerTimeValue
					}
				}
			}
		},
		components:{
			PopupView,
			CityPicker
		},
		props:{
			diyDatas: Array,
			bgColor:{
				type: String,
				default: "#FAFAFA"
			},
			formId:{
				type: String,
				default: ""
			},
			pickerTimeVisibility: {
				type: Boolean,
				default:true
			},
		},
		created(){
			this.diyDatasNew = this.diyDatas
		},
		mounted(){
		},
		methods:{
			
			/**省市区**/
			// 显示弹窗 省市区/时分秒
			showpicker(name,index,cityType='',field_type='',status='') {
				if( name === 'city' ){
					this.cityType = cityType
					this.cityIndex = index
					this.cityPickerVisibility = true
					this.$refs.mpvueCityPicker.show();
				}
				else if( name === 'time' ){
					this.timeIndex = index
					this.showTimePicker = true;
					this.timeFieldType = field_type
					this.timeStatus = status
				}
			},
			// 关闭弹窗
			onCityConfirm(e) {
				// console.log('省市区',e)
				let region = e.label.split("-");
				this.region = [...region];
				this.code = e.cityCode.map(val=>val+="");
				this.val = this.code
				// 处理省市二级联动
				if( this.cityType === '1' ){
					let code = this.code
					this.region.splice(2,1,'')
					code.splice(2,1,'0')
					this.val = code
				}
				// console.log(this.region)
				// 省市区数组转字符串
				this.val = this.val.join(',')
				// console.log('shiajin**************',this.val)
				this.getInputVal(this.cityIndex)
			},

			/**时分秒**/
			// 确定
			pickerTimeConfirm(e){
				// 时间范围
				if( this.timeFieldType == '10' ){
					let timeObj= this.diyDatasNew[this.timeIndex].default || {}
					// console.log('timeObj',timeObj,this.timeIndex)
					if( this.timeStatus == 'start' ){
						timeObj['startappointdata'] = this.time || this.pickerTimeValue
					}
					else{
						timeObj['endappointdata'] = this.time || this.pickerTimeValue
					}
					this.val = timeObj
					this.timeFieldType = ''
				}
				else{
					this.val = this.time || this.pickerTimeValue
				}
				this.getInputVal(this.timeIndex)
				this.pickerTimeCancel()
			},
			// 取消
			pickerTimeCancel(){
				this.val = this.diyDatasNew[this.timeIndex].default
				this.showTimePicker = false
			},
			// 选择
			pickerTimeChange(e){
				let time = e.target.value,
					newTime=[]
				time.map(item=>{
					newTime.push(item<10?('0'+item):item)
				})
				this.time = newTime.join(':')
			},
			
			
			getInputVal(index){
				// console.log('c-------',this.val,index)
				// this.diyDatasNew[index].default = this.val
				this.diyDatasNew[index] = {
					...this.diyDatasNew[index],
					default: this.val
				}
				this.diyDatasNew = [...this.diyDatasNew]
				this.$emit('changeFormDatas',this.diyDatasNew)
				// console.log(this.diyDatasNew)
			},
			// 获取选择框的值
			getPickerVal(meal,index,e){
				this.val = meal[e.target.value].id
				this.getInputVal(index)
			},
			
			// 文本特殊处理
			getFormTextAreItemVal(index,e){
				this.isShowTextare = false
				this.getFormItemVal(index,e)
			},
			// 获取值
			getFormItemVal(index,e,field_type='',status='') {
				this.val = e.target.value
				// 日期范围
				if( field_type === '8' ){
					let dateObj= this.diyDatasNew[index].default || {}
					if( status == 'start' ){
						dateObj['startappointdata'] = e.target.value
					}
					else{
						dateObj['endappointdata'] = e.target.value
					}
					this.val = dateObj
				}
				// 多选
				else if( field_type === '5' ){
					this.val = this.val.join(',')
				}
				this.getInputVal(index)
			},
			
			
			// 上传图片
			addImage(index,imgNumber){
				let _this = this;
				App.chooseImage({
					count: imgNumber, //图片上传最大数量
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						let tempFilePaths = res.tempFilePaths,
							chooseImgNum = tempFilePaths.length;
						if (_this.chooseImgArr.length < imgNumber) {
							if (_this.chooseImgArr.length + chooseImgNum > imgNumber) {
								_this.localIds.push(...res.localIds.splice(0, imgNumber - chooseImgNum));
								if (_this.appClientType === "4") {
									_this.chooseImgArr.push(...tempFilePaths.splice(0, imgNumber - chooseImgNum));
								}
							} else {
								chooseImgNum > 0 && _this.chooseImgArr.push(...tempFilePaths);
								
								if (_this.appClientType === "4") {
									chooseImgNum > 0 && _this.localIds.push(...res.localIds);
								}
							}
							_this.val = _this.chooseImgArr
							_this.getInputVal(index)
						} else {
							App.showError('最多上传'+imgNumber+'张图')
						}
					}
				})
			},
			
			// 删除选择的照片
			delImage(index,chooseImgArr,itemIndex){
				chooseImgArr.splice(index,1)
				this.val = chooseImgArr
				this.chooseImgArr = chooseImgArr
				this.getInputVal(itemIndex)
			},
			
			// 校验必填字段
			RegForm(){
				return new Promise((resolve,reject)=>{
					// console.log('提交的表单数据')
					// console.log(this.diyDatasNew)
					// 遍历必填字段
					for( let i in this.diyDatasNew ){
						let item = this.diyDatasNew[i]
						if( item.required === '1' ){
							
							if( Object.prototype.toString.call(item.default) === '[object Object]' && ( !item.default.startappointdata || !item.default.endappointdata ) ){
								App.showError( (!item.default.startappointdata ? item.name.startname : item.name.endname) + '不能为空' )
								resolve(0)
								return false
							}
							else if( !item.default || (Array.isArray(item.default) && item.default.length === 0) ){
								App.showError( item.name + '不能为空' )
								resolve(0)
								return false
							}
						}
					}
					resolve(1) 
				})
			},
			
			
			// 提交自定义表单
			saveFormInfo(){
				return new Promise((resolve,reject)=>{
					this.RegForm().then(isRequiredAll=>{
						if( isRequiredAll === 1 ){
							let merchantImage = [],pros=[]
							this.diyDatasNew.map((item,i)=>{
								if( item.field_type == '12' && item.default ){
									pros[i] = new Promise(reslove1=>{
										// 过滤已经上传的文件
										let filterDefault = []
										if (item.default.length > 0) {
											item.default.filter(val => {
												if( val.indexOf("http://tmp/") !== -1 || val.indexOf("wxfile://tmp") !== -1 ){
													filterDefault = [...filterDefault,val]
												}
												else{
													merchantImage = [...merchantImage,val]
												}
											})
										}
										// console.log('filterDefault----',filterDefault)
										if( filterDefault.length > 0 ){
											App._upLoadAll(filterDefault,'not').then(options => {
												let imgsPath = options.map(val => {
													if (!!val) {
														return val.file_path
													}
												});
												let newimgsPath = imgsPath.filter(val => val);
												merchantImage.push(...newimgsPath);
												this.diyDatasNew[i].default = merchantImage
												reslove1(i)
											})
										}
										else{
											reslove1(i)
										}
									})
									 
								}
							})
							this.diyDatasNew = [...this.diyDatasNew]
							// console.log('00000',this.diyDatasNew)
							Promise.all(pros).then(re=>{
								setTimeout(()=>{
									let Base64 = this.$util.Base64,
										value = new Base64().encode(JSON.stringify(this.diyDatasNew)),
										form_id = this.formId;
									App._post_form('form.form/goodsFormSubmit', {
										value,
										form_id 
									},res=>{
										if(res.code == 1){
											resolve(res)
											return false
										}
										else{
											resolve({})
											App.showError( res.msg )
											return false
										}
									})
								},200)
							})
						}
						else{
							resolve({})
							return false
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
		height: 100vh;
	}
	.form-main {
		.one-title{
			padding-top: 20rpx;
		}
		.save-btn {
			position: fixed;
			bottom: 30rpx;
			width: 80%;
			left: 10%;
			height: 90rpx;
			z-index: 20;
			border-radius: 50rpx;
		}
		.form-image {
			padding: 0 20rpx;
			padding-bottom: 20rpx;
			margin-bottom: 20rpx;
			box-sizing: border-box;
			background-color: #fff;
			image {
				width: 200rpx;
				height: 200rpx;
			}
			.image-part {
				width: 200rpx;
				height: 200rpx;
				
				position: relative; 
				.display-image {
					width: 100%;
					height: 100%;
					border-radius: 6rpx;
					position: absolute;
					top: 0;
					left: 0;
				}
				.del {
					position: absolute;
					top: 0;
					right: 0;
					width: 40rpx;
					height: 40rpx;
				}
			}
		}
		.form-item {
			height:80rpx;
			margin-bottom: 20rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			border-radius: 10rpx;
			&.form-item-more{
				height: auto;
			}
			.f-title{
				width: 180rpx;
			}
			.form-input {
				width: 76%;
				height: 100%;
				position: relative;
				.m-left12 {
					margin-left: 10rpx;
				}
				input{
					padding:0 40rpx;
				}
				input ,picker{
					width: 100%;
					box-sizing: border-box;
					height: 100%;
					color: #333333;
					position: relative;
					z-index: 3;
				}
				picker{
					position: relative;
					z-index: 2;
					padding:0 36rpx;
				}
				.picker-view{
					width: 100%;
					height: 100%;
					height:80rpx;
					line-height:80rpx;
					text-align: right;
				}
				.view-rt {
					// width: 100%;
					// height: 100%;
					line-height:80rpx ;
					text-align: right;
					position: absolute;
					top: 0;
					right: 0;
					z-index: 1;
					// border: 1rpx solid #f00;
				}
				.pd-rt{
					padding-right: 4px;
				}
			}
			.f-title+.form-input{
				flex: 1;
				width: auto;
			}
		}
		.form-require{
			color: #f00;
			position: relative;
			top: 6rpx;
			left: -2rpx;
		}
		/* #ifdef H5 */
		.custom-form-input{
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			padding-right: 40rpx;
			position: relative;
			z-index: 1;
			outline: none;
			border: none;
			background: transparent;
		}
		
		.icon-write{
			position: relative;
			z-index: 1;
			// border: 1px solid #F00;
		}
		/* #endif */
	}
	
	.mpvue-picker-time {
		.pickerMask {
			position: fixed;
			z-index: 100;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.6);
		}
		.mpvue-picker-content {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			transition: all 0.3s ease;
			transform: translateY(100%);
			z-index: 100000;
		}
		
		.mpvue-picker-view-show {
			transform: translateY(0);
		}
		.mpvue-picker__hd{
			display: flex;
			padding: 9px 15px;
			background-color: #fff;
			position: relative;
			text-align: center;
			font-size: 17px;
		}
		.mpvue-picker__hd:after {
			content: ' ';
			position: absolute;
			left: 0;
			bottom: 0;
			right: 0;
			height: 1px;
			border-bottom: 1px solid #e5e5e5;
			color: #e5e5e5;
			transform-origin: 0 100%;
			transform: scaleY(0.5);
		}
		.mpvue-picker__action {
			display: block;
			flex: 1;
			color: #1aad19 !important;
		}
		.mpvue-picker__action:first-child {
			text-align: left;
			color: #888 !important;
		}
		.mpvue-picker__action:last-child {
			text-align: right;
		}
		.picker-item {
			text-align: center;
			height: 40px !important;
			line-height: 40px;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 24rpx;
		}
		.mpvue-picker-view {
			position: relative;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 238px;
			background-color: rgba(255, 255, 255, 1);
		}
	}
	.f-28{
		font-size: 28rpx !important;
	}
	.textarea-text{
		width: 100%;
		display:block;
		text-align:left;
		word-wrap: break-word;
		word-break: normal;
		line-height:40rpx;
		height:160rpx;
	}
</style>

