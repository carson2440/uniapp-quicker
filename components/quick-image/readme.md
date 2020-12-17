quick-image 文件上传组件

---功能
1：支持图片压缩
2：支持添加水印
3：支持自定义图片大小

---参数与回调
@selectResult：图片最终的存储路径回调

sourceType：['album', 'camera']
imgMode：图片的填充样式，默认为'aspectFill'
size：图片的占位大小，内容自动转换为rpx，默认大小96
max：最多可以选择多少张图片，默认10张
mode：图片显示样式，square-带圆角方形，circle-圆形
showDelete：是否支持选择后删除功能，true or false
waterMark：是否添加水印 true or false
formData：json对象，水印的参数
				waterData:{
					"project":"这里是项目名称辣椒粉拉风拉夫,carson2440-carson",
					"devCompany":"这里是施工单位，深圳前海好工易网络科技有限公司",
					"author":"carson2440-岗位",
					"type":"安全问题",
					"address":"三栋一单元5F",
					"time":"2020.12.09 18:40"  //时间选填
				}

---使用
在vue界面的script作用域里面添加如下代码引入组件
import quickImage from '@/components/quick-image/quick-image.vue'
如果有数据需要回显，直接使用v-model=路径的数组对象即可
<quick-image :max="6" :sourceType="['album']" @selectResult="callback" v-model="showData" :formData="waterData"/>
<quick-image :size="96" :mode="'circle'" @selectResult="callback" v-model="showData" :formData="waterData"/>