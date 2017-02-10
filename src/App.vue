<template>
	<div id="app">
		<calendar
			@select="select" @change="change"
		></calendar>
	</div>
</template>
<script>
	import Calendar from 'components/calendar'
	export default {
		name: 'app',
		components: {
			Calendar
		},
		methods: {
			change(date, calendar) {
				console.log(date, calendar);
			},
			select(date, calendar) {
				console.log(date, calendar);
			}
		}
	}
</script>
<style>
* {
	box-sizing: border-box;
}
body {
	margin: 0;
	padding: 0;
	line-height: 1.5;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>