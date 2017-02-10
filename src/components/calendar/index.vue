<template>
    <div
        class="calendar"
        v-resize="resize"
    >
        <div
            class="calendar-header"
            ref="calendarHeader"
        >
            <div class="calendar-btn">
                <div class="calendar-btn-prev">
                    <a
                        href="javascript:void(0)"
                        @click="prevyear"
                    >
                        <span>&lt;&lt;</span>
                    </a>
                    <a
                        href="javascript:void(0)"
                        @click="prevmonth"
                    >
                        <span>&lt;</span>
                    </a>
                </div>
                <div class="calendar-btn-next">
                    <a
                        href="javascript:void(0)"
                        @click="nextmonth"
                    >
                        <span>&gt;</span>
                    </a>
                    <a
                        href="javascript:void(0)"
                        @click="nextyear"
                    >
                        <span>&gt;&gt;</span>
                    </a>
                </div>
            </div>
            <div class="calendar-month">
                <span>{{ this.ThisMonth.year }}</span>
                <span>年</span>
                <span>{{ this.ThisMonth.month }}</span>
                <span>月</span>
            </div>
        </div>
        <table
            class="calendar-body"
            ref="calendarBody"
            cellspacing="0"
            cellpadding="0"
        >
            <thead>
                <tr>
                    <th v-for="weekday in WeekDays">{{ weekday }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="weeks in Dates">
                    <td
                        v-for="date in weeks"
                        @click="select($event, date)"
                        :style="{ width: `${cell.width}px`, height: `${cell.height}px`}"
                        :class="{ active: date.date.getTime() === new Date(y, m - 1, d).getTime() }"
                    >
                        <slot>
                            <div class="cell">{{ date.date.getDate() }}</div>
                        </slot>
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
            },
            cellMaxHeight: {
                type: Number,
                default: 110,
            }
        },
        data() {
            return {
                WeekDays: WeekDays.fullname,
                y: new Date().getFullYear(),
                m: new Date().getMonth() + 1,
                d: new Date().getDate(),
                cell: {
                    width: 0,
                    height: 0
                }
            }
        },
        created() {
            this.y = this.year;
            this.m = this.month;
        },
        computed: {
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
            Dates() {
                const days = [];
                const dates = [];
                // 当前月第一天的星期数
                let ThisMonthFirstDayWeek = new Date(this.ThisMonth.year, this.ThisMonth.month - 1, 0).getDay();
                // 生成二维数组
                for (let i = 1; i <= 42; i++) {
                    let date = new Date(this.ThisMonth.year, this.ThisMonth.month - 1, i - ThisMonthFirstDayWeek);
                    days.push({
                        date: date,
                        calendar: {}
                    });
                    if (i % 7 === 0) {
                        dates.push(days.splice(0, 7));
                    }
                }
                return dates;
            }
        },
        methods: {
            prevyear(e) {
                let year = this.y - 1;
                let month = this.m;
                this.y = year;
                this.m = month;
                this.$emit('change', year, month);
            },
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
            nextyear(e) {
                let year = this.y + 1;
                let month = this.m;
                this.y = year;
                this.m = month;
                this.$emit('change', year, month);
            },
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
            select(e, date) {
                this.y = date.date.getFullYear();
                this.m = date.date.getMonth() + 1;
                this.d = date.date.getDate();
                this.$emit('select', {
                    year: this.y,
                    month: this.m,
                    date: this.d
                }, date.calendar);
            },
            resize(el) {
                this.$refs.calendarHeader.style.width = `${this.$refs.calendarBody.clientWidth}px`;
                const width = (this.$refs.calendarBody.clientWidth / 7).toFixed(2);
                this.cell = {
                    width: width,
                    height: Math.min(width, this.cellMaxHeight)
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
    // calendar.getCalendar(new Date());
</script>
<!-- 只把样式限定在本模块 -->
<style scoped>
.calendar,.calendar *{
    box-sizing: border-box;
}
.calendar {
    background-color: #fff;
    padding: 7px;
    overflow: auto;
}
.calendar-header {
    min-width: 100%;
    padding: 10px;
    font-size: 20px;
    color: #8391a5;
    text-align: center;
}
.calendar-btn {
    height: 30px;
    line-height: 30px;
}
.calendar-btn-prev {
    float: left;
}
.calendar-btn-next {
    float: right;
}
.calendar-btn a {
    display: inline-block;
    width: 30px;
    height: 30px;
    margin: 0;
    padding: 0;
    color: #8391a5;
}
.calendar-btn a:hover {
    color: #20a0ff;
}
.calendar-month {
    height: 30px;
    line-height: 30px;
    margin: -30px 80px 0 80px;
}
.calendar-body {
    width: 100%;
    text-align: center;
}
.calendar-body > thead th {
    padding: 10px;
    color: #8391a5;
    font-weight: 400;
    font-size: 18px;
}
.calendar-body > tbody td {
    color: #48576a;
    padding: 10px;
    text-align: center;
    cursor: pointer;
}
.calendar-body > tbody td:hover {
    background-color: #e4e8f1;
    color: #20a0ff;    
}
.calendar-body > tbody td.active {
    background-color: #20a0ff;
    color: #fff;
}
.cell {
     font-size: 20px;
}
</style>