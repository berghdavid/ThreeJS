export class Timer {
  constructor() {
    this.start = new Date('2022-11-15T06:00:00Z')
    this.sec = new Date().getSeconds();
  }

  isNewTime() {
    new Date().getSeconds() != this.sec;
  }

  timeLeft() {
    let timeLeft = ''
    let now = new Date()

    let timeDiff = this.start.getTime() - now.getTime()
    let daysLeft = Math.floor(timeDiff / (1000 * 3600 * 24));
    timeDiff -= daysLeft * 1000 * 3600 * 24;
    let hoursLeft = Math.floor(timeDiff / (1000 * 3600));
    timeDiff -= hoursLeft * 1000 * 3600;
    let minLeft = Math.floor(timeDiff / (1000 * 60));
    timeDiff -= minLeft * 1000 * 60;
    let secLeft = Math.floor(timeDiff / 1000);

    timeLeft = daysLeft.toString() + '  ' + hoursLeft.toString() + '  ' + minLeft.toString() + '  ' + secLeft.toString()
    this.sec = now.getSeconds();
    return timeLeft
  }


}