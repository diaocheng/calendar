<template>
    <div
        class="calendar"
        v-resize="resize"
    >
        <div
            class="calendar-header"
            ref="calendarHeader"
        >
            <div class="calendar-nav">
                <div class="calendar-nav-prev">
                    <a
                        href="javascript:void(0)"
                        @click="prevyear"
                    >
                        <span class="el-icon-d-arrow-left"></span>
                    </a>
                    <a
                        href="javascript:void(0)"
                        v-show="view === 0"
                        @click="prevmonth"
                    >
                        <span class="el-icon-arrow-left"></span>
                    </a>
                </div>
                <div class="calendar-nav-next">
                    <a
                        v-show="view === 0"
                        href="javascript:void(0)"
                        @click="nextmonth"
                    >
                        <span class="el-icon-arrow-right"></span>
                    </a>
                    <a
                        href="javascript:void(0)"
                        @click="nextyear"
                    >
                        <span class="el-icon-d-arrow-right"></span>
                    </a>
                </div>
            </div>
            <div class="calendar-title">
                <a
                    href="javascript:void(0)"
                    @click="toYearsView"
                >
                    <span>{{ YearTitle }}</span>
                </a>
                <a
                    v-show="view === 0"
                    href="javascript:void(0)"
                    @click="toMonthsView"
                >
                    <span>{{ MonthTitle }}</span>
                </a>
            </div>
        </div>
        <table
            class="calendar-body"
            ref="calendarBody"
        >
            <thead>
                <tr v-show="view===0">
                    <th v-for="weekday in WeekDays">{{ weekday }}</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-show="view===0"
                    v-for="(rows, r) in Dates"
                >
                    <td
                        v-for="(col, c) in rows"
                        @click="selectdate($event, col,r, c)"
                        :style="cellsize"
                        :class="col.style"
                    >
                        <slot :calendar="col">
                            {{ col.date.getDate() }}
                        </slot>
                    </td>
                </tr>
                <tr
                    v-show="view===1"
                    v-for="(rows, r) in Months"
                >
                    <td
                        v-for="(col, c) in rows"
                        @click="selectmonth($event, (r+1)*(c+1))"
                        :style="cellsize"
                    >
                        {{ col }}
                    </td>
                </tr>
                <tr
                    v-show="view===2"
                    v-for="rows in Years"
                >
                    <td
                        v-for="col in rows"
                        @click="selectyear($event, col)"
                        :style="cellsize"
                    >
                        {{ col }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
    import Mixins from 'js/mixins';
    const WeekDays = {
        base: ['一', '二', '三', '四', '五', '六', '日'],
        fullname: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        abbreviation: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    };
    export default {
        name: 'calendar',
        mixins: [Mixins],
        props: {
            year: {
                type: Number,
                default() {
                    return new Date().getFullYear();
                }
            },
            month: {
                type: Number,
                default() {
                    return new Date().getMonth() + 1;
                }
            },
            calendar: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                Months: [],// 月份
                WeekDays: WeekDays.fullname, // 周信息
                y: new Date().getFullYear(), // 年
                m: new Date().getMonth() + 1, // 月
                d: new Date().getDate(), // 日
                // 视图模式
                //  0为月视图,1为年视图,2为10年显示视图
                view: 0,
                // 单元格大小
                cellsize: {
                    width: 0,
                    height: 0
                }
            }
        },
        created() {
            this.y = this.year;
            this.m = this.month;
            this.Months = [];
            const Months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
            // 设置月份视图显示数据
            while (Months.length) {
                this.Months.push(Months.splice(0, 4));
            }
        },
        computed: {
            // 年份标题
            YearTitle() {
                let title = `${this.y} 年`;
                if (this.view === 2) {
                    title = `${this.y - this.y % 10} 年 - ${this.y - this.y % 10 + 10} 年`;
                }
                return title;
            },
            // 月份标题
            MonthTitle() {
                return `${this.m} 月`;
            },
            // 年视图时的年份
            Years() {
                const Years = [];
                const years = [];
                for (let i = 0, length = 10; i < length; i++) {
                    years.push(this.y - this.y % 10 + i);
                }
                while (years.length) {
                    Years.push(years.splice(0, 4));
                }
                return Years;
            },
            // 上一个月
            LastMonth() {
                let year = this.y;
                let month = this.m - 1;
                if (month < 1) {
                    month = 12;
                    year -= 1;
                }
                let days = new Date(year, month, 0).getDate();
                return {
                    year: year,
                    month: month,
                    days: days
                };
            },
            // 当前月
            ThisMonth() {
                let year = this.y;
                let month = this.m;
                let days = new Date(year, month, 0).getDate();
                return {
                    year: year,
                    month: month,
                    days: days
                };
            },
            // 下一个月
            NextMonth() {
                let year = this.y;
                let month = this.m + 1;
                if (month > 12) {
                    month = 1;
                    year += 1;
                }
                let days = new Date(year, month, 0).getDate();
                return {
                    year: year,
                    month: month,
                    days: days
                };
            },
            // 渲染日程表天数
            Dates() {
                const days = [];
                const dates = [];
                const calendar = {};
                // 把本月日程转换为以时间为key的对象
                for (let i = 0, length = this.calendar.length; i < length; i++) {
                    let time = this.calendar[i].time.split(/-|\s/);
                    // 去掉前置0
                    time = `${parseInt(time[0])}${parseInt(time[1])}${parseInt(time[2])}`;
                    calendar[time] = this.calendar[i];
                }
                // 当前月第一天的星期数
                let LastMonthLastDayWeek = new Date(this.LastMonth.year, this.LastMonth.month, 0).getDay();
                // 生成显示日程的二维数组
                for (let i = 1; i <= 42; i++) {
                    // 获取日期
                    let date = new Date(this.ThisMonth.year, this.ThisMonth.month - 1, i - LastMonthLastDayWeek);
                    // 样式
                    let style = [];
                    if (i - LastMonthLastDayWeek <= 0) {
                        // 上一个月样式
                        style.push('last-month');
                    } else if (i - LastMonthLastDayWeek > new Date(this.ThisMonth.year, this.ThisMonth.month, 0).getDate()) {
                        // 下一个月样式
                        style.push('next-month');
                    } else {
                        // 本月样式
                        style.push('this-month');
                        const today = new Date();
                        // 让今天高亮
                        if (today.getFullYear() === date.getFullYear()
                            && today.getMonth() === date.getMonth()
                            && today.getDate() === date.getDate()) {
                            style.push('today');
                        }
                    }
                    // 日程对象的下标值(key)
                    let time = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
                    days.push({
                        date: date,
                        style: style,
                        calendar: calendar[time] || {}
                    });
                    // 每7天就添加到下一行
                    if (i % 7 === 0) {
                        dates.push(days.splice(0, 7));
                    }
                }
                return dates;
            }
        },
        watch: {
            // 视图类型改变时
            view(nVal, oVal) {
                let width = this.$refs.calendarBody.clientWidth;
                if (nVal === 0) {
                    width = (width / 7).toFixed(2);
                } else {
                    width = (width / 4).toFixed(2);
                }
                this.cellsize = {
                    width: `${width}px`,
                    height: `${width}px`
                }
            }
        },
        methods: {
            // 设置为年视图
            toYearsView(e) {
                this.view = 2;
            },
            // 设置为月视图
            toMonthsView(e) {
                this.view = 1;
            },
            // 切换年prev
            // 如果为年视图就调整10年否则就为1年
            prevyear(e) {
                let year = this.y - 1;
                if (this.view === 2) {
                    year = this.y - 10;
                }
                let month = this.m;
                this.y = year;
                this.m = month;
                if (this.view === 0) {
                    this.$emit('change', year, month);
                }
            },
            // 切换到上一个月
            prevmonth(e) {
                let year = this.y;
                let month = this.m - 1;
                if (month < 1) {
                    year -= 1;
                    month = 12;
                }
                this.y = year;
                this.m = month;
                this.$emit('change', year, month);
            },
            // 切换年next
            // 如果为年视图就调整10年否则就为1年
            nextyear(e) {
                let year = this.y + 1;
                if (this.view === 2) {
                    year = this.y + 10;
                }
                let month = this.m;
                this.y = year;
                this.m = month;
                if (this.view === 0) {
                    this.$emit('change', year, month);
                }
            },
            // 切换到下一个月
            nextmonth(e) {
                let year = this.y;
                let month = this.m + 1;
                if (month > 12) {
                    month = 1;
                    year += 1;
                }
                this.y = year;
                this.m = month;
                this.$emit('change', year, month);
            },
            // 选定年
            selectyear(e, year) {
                this.y = year;
                this.view = 1;
            },
            // 选定月
            selectmonth(e, month) {
                this.m = month;
                this.view = 0;
                this.$emit('change', this.y, this.m);
            },
            // 选择天
            selectdate(e, date, row, col) {
                const isThisMonth = date.date.getMonth() + 1 === this.m;
                this.y = date.date.getFullYear();
                this.m = date.date.getMonth() + 1;
                this.d = date.date.getDate();
                if (!isThisMonth) {
                    this.$emit('change', this.y, this.m);
                } else {
                    this.$emit('select', {
                        year: this.y,
                        month: this.m,
                        date: this.d
                    }, date.calendar);
                }
            },
            // v-resize指令函数
            resize(el) {
                this.$refs.calendarHeader.style.width = `${this.$refs.calendarBody.clientWidth}px`;
                let width = this.$refs.calendarBody.clientWidth;
                if (this.view === 0) {
                    width = (width / 7).toFixed(2);
                } else {
                    width = (width / 4).toFixed(2);
                }
                this.cellsize = {
                    width: `${width}px`,
                    height: `${width}px`
                }
                if (width >= 60 && width < 100) {
                    this.WeekDays = WeekDays.abbreviation;
                } else if (width < 60) {
                    this.WeekDays = WeekDays.base;
                } else {
                    this.WeekDays = WeekDays.fullname;
                }
            }
        }
    }
</script>
<style src="element-ui/lib/theme-default/index.css"></style>
<!-- 只把样式限定在本模块 -->
<style
    src="./calendar.less"
    lang="less"
></style>