var DateCore = function (config) {
    this.config = config;
    this.init();
    //console.log(this.Datepanel(this.currentDate.year,this.currentDate.month,this.currentDate.date));
};

DateCore.prototype.init = function () {
    var me = this;
    var nowDate = new Date();
    me.currentDate = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        day: nowDate.getDay(),
        date: nowDate.getDate(),
        hour: nowDate.getHours(),
        minute: nowDate.getMinutes()
    };
};

DateCore.prototype.Datepanel = function (year, month, date, num) {
    
    var me = this;
    var myDate = new Date(year, month-1);
    var firstDay = myDate.getDay();
    var monthDayNum = monthDays(year,month-1);
    var dateArray = new Array(42);
    var loop = false;
    for (var i = firstDay,startDate = 1; i < dateArray.length; i++) {
        if(startDate > monthDayNum){
            startDate = 1;
            loop = true;
        }
        loop?dateArray[i] = {'date':startDate++,'modal':'new'}:dateArray[i] = {'date':startDate++,'modal':''};
    };
    
   for (var i = firstDay-1,startDate = monthDays(year,(month-2)<0?11:(month-2)); i >= 0; i--) {
       dateArray[i] = {'date':startDate--,'modal':'old'};
   };
    return dateArray;
};

DateCore.prototype.getDates = function (year, month, num) {
    var me = this;
    var monthDayNum = new Date(year, month, 0).getDate();

   // return new Date(year,month-1);
};

DateCore.prototype.getMonths = function (year, num) {
    var me = this;
    var monthNum = num || 12;
    var monthStart = 1;
    var monthPanel = [];
    for (var i = 0; i < monthNum; i++) {
        monthPanel.push(monthStart++);
    }
    return monthPanel;
};


DateCore.prototype.getYears = function (startYear, num) {
    var me = this;
    var yearNum = num || 12;
    var yearStart = startYear || (me.currentDate.year - Math.floor(yearNum / 2));
    var yearPanel = [];
    for (var i = 0; i < yearNum; i++) {
        yearPanel.push(yearStart++);
    }
    return yearPanel;
};

/**
 * 闰二月天数
 * @param yearNum 年
 * @param month 月
 * @return {*}
 */
function monthDays(yearNum, month) {
    var monthArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (((yearNum % 4 == 0) && (yearNum % 100 != 0)) || (yearNum % 400 == 0)) {
        monthArray[1] = 29;
    }
    if (month >= 0) {
        return monthArray[month];
    } else {
        return monthArray;
    }
}