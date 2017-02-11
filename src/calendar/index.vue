<template>
    <div class="calendar" v-resize="resize">
        <div class="calendar-header" ref="calendarHeader">
            <div class="calendar-btn">
                <div class="calendar-btn-prev">
                    <a href="javascript:void(0)" @click="prevyear">
                        <span>&gt;</span>
                    </a>
                    <a href="javascript:void(0)" @click="prevmonth">
                        <span>&gt;</span>
                    </a>
                </div>
                <div class="calendar-btn-next">
                    <a href="javascript:void(0)" @click="nextmonth">
                        <span>&gt;</span>
                    </a>
                    <a href="javascript:void(0)" @click="nextyear">
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
        <table class="calendar-body" ref="calendarBody" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th v-for="weekday in WeekDays">{{ weekday }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="weeks in Dates">
                    <td v-for="date in weeks" @click="calendarSelect($event, date)" :style="{ width: `${cell.width}px`, height: `${cell.height}px`}">
                        <slot>
                            <div class="cell">{{ date }}</div>
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
            cellMaxHeight: {
                type: Number,
                default: 110,
            }
        },
        data() {
            return {
                WeekDays: WeekDays.fullname,
                Year: 1970,
                Month: 1,
                cell: {
                    width: 0,
                    height: 0
                }
            }
        },
        created() {
            this.Year = this.year;
            this.Month = this.month;
        },
        computed: {
            LastMonth() {
                let year = this.Year;
                let month = this.Month - 1;
                if (month < 1) {
                    month = 12;
                    year -= 1;
                }
                let days = new Date(year, month, 0).getDate();
                const Month = {
                    year: year,
                    month: month,
                    days: days
                };
                return Month;
            },
            ThisMonth() {
                let year = this.Year;
                let month = this.Month;
                let days = new Date(year, month, 0).getDate();
                const Month = {
                    year: year,
                    month: month,
                    days: days
                };
                return Month;
            },
            NextMonth() {
                let year = this.Year;
                let month = this.Month + 1;
                if (month > 12) {
                    month = 1;
                    year += 1;
                }
                let days = new Date(year, month, 0).getDate();
                const Month = {
                    year: year,
                    month: month,
                    days: days
                };
                return Month;
            },
            Dates() {
                const days = [];
                const dates = [];
                // 当前月第一天的星期数
                let ThisMonthFirstDayWeek = new Date(this.ThisMonth.year, this.ThisMonth.month - 1, 0).getDay();
                // 生成二维数组
                for (let i = 1; i <= 42; i++) {
                    let date = new Date(this.ThisMonth.year, this.ThisMonth.month - 1, i - ThisMonthFirstDayWeek).getDate();
                    days.push(date);
                    if (i % 7 === 0) {
                        dates.push(days.splice(0, 7));
                    }
                }
                return dates;
            }
        },
        methods: {
            prevyear(e) {
                let year = this.Year - 1;
                let month = this.Month;
                this.Year = year;
                this.Month = month;
                this.$emit('change', year, month);
            },
            prevmonth(e) {
                let year = this.Year;
                let month = this.Month - 1;
                if (month < 1) {
                    year -= 1;
                    month = 12;
                }
                this.Year = year;
                this.Month = month;
                this.$emit('change', year, month);
            },
            nextyear(e) {
                let year = this.Year + 1;
                let month = this.Month;
                this.Year = year;
                this.Month = month;
                this.$emit('change', year, month);
            },
            nextmonth(e) {
                let year = this.Year;
                let month = this.Month + 1;
                if (month > 12) {
                    month = 1;
                    year += 1;
                }
                this.Year = year;
                this.Month = month;
                this.$emit('change', year, month);
            },
            calendarSelect(e, date, data) {
                this.$emit('select', this.Year, this.Month, date);
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
<style lang="less" scoped>
.calendar {
    background-color: #fff;
    padding: 7px;
    overflow: auto;
}
.calendar *{
    box-sizing: border-box;
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
.cell {
     font-size: 20px;
}
</style>