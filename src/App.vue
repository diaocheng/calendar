<template>
	<div id="app">
		<calendar
			:year="year"
			:month="month"
			:calendar="calendar"
			@select="select" @change="change"
		>
			<template scope="date">
				<div
					class="date" :class="{ active: date.calendar.calendar.data}"
				>
					<span>{{ date.calendar.date.getDate() }}</span>
					<span class="el-icon-star-on"></span>
				</div>
			</template>
		</calendar>
	</div>
</template>
<script>
	import Calendar from 'components/calendar';
	import data from './calendar.json';
	export default {
		name: 'app',
		data() {
			return {
				year: 2017,
				month: 2,
				calendar: data
			}
		},
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
.date {
	display: block;
}
.date>.el-icon-star-on {
	display: none;
}
.date.active {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0; 
}
.date.active:after{
	content: ' ';
	width:0;
	height:100%;
	display:inline-block;
	vertical-align:middle;
}
.date.active>.el-icon-star-on {
	display: block;
	color: #f00;
	position: absolute;
	right: 0;
	top: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>