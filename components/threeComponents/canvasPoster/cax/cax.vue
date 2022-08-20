<template>
		<canvas :canvas-id="caxId" class="test" :style="{'width': canvaseW + 'px', 'height': canvaseH + 'px'}">
		</canvas>
</template>
<script>
	export default {
		props: {
			canvaseW: {
				type: Number
			},
			canvaseH: {
				type: Number
			},
		},
		watch: {
			'canvaseW': {
				handler(newData, oldData) {
					if (typeof newData === 'number') {
						this.width = newData
					}
				},
				immediate: true,
				deep: false
			},
			'canvaseH': {
				handler(newData, oldData) {
					if (typeof newData === 'number') {
						this.height = newData
					}
				},
				immediate: true,
				deep: false
			}
		},
		data() {
			return {
				caxId: 'caxId',
				width: 375,
				height: 600
			}
		},
		mounted() {
			
		},
		methods: {
			getCaxCanvasId: function() {
				return this.caxId
			}
		},
	}
</script>
<style>
	.test{
		position: absolute;
		bottom: -999999px;
		opacity: 0;
		visibility: hidden;
		z-index: -999;
	}
</style>