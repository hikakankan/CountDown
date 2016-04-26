var Rect = (function () {
    function Rect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Rect.prototype.move = function (diffRect, r) {
        var rx = this.x + diffRect.x * r;
        var ry = this.y + diffRect.y * r;
        var rw = this.width + diffRect.width * r;
        var rh = this.height + diffRect.height * r;
        return new Rect(rx, ry, rw, rh);
    };
    Rect.prototype.moveTo = function (destRect, r) {
        var rx = this.x * (1 - r) + destRect.x * r;
        var ry = this.y * (1 - r) + destRect.y * r;
        var rw = this.width * (1 - r) + destRect.width * r;
        var rh = this.height * (1 - r) + destRect.height * r;
        return new Rect(rx, ry, rw, rh);
    };
    Rect.prototype.drawImage = function (image) {
        var mc = document.getElementById("risa-canvas");
        var context = mc.getContext("2d");
        context.drawImage(image, this.x, this.y, this.width, this.height);
    };
    Rect.prototype.clear = function () {
        var mc = document.getElementById("risa-canvas");
        var context = mc.getContext("2d");
        context.clearRect(this.x, this.y, this.width, this.height);
    };
    return Rect;
}());
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var LoopCounter = (function () {
    function LoopCounter(period1, period2, period3) {
        this.count = 0;
        if (!period2) {
            this.period = period1;
            this.periods = [period1];
        }
        else if (!period3) {
            this.period = period1 + period2;
            this.periods = [period1, period2];
        }
        else {
            this.period = period1 + period2 + period3;
            this.periods = [period1, period2, period3];
        }
    }
    LoopCounter.prototype.getIndex = function () {
        var c = this.count;
        for (var i = 0; i < this.periods.length; i++) {
            if (c < this.periods[i]) {
                return i;
            }
            c -= this.periods[i];
        }
        return this.periods.length - 1;
    };
    LoopCounter.prototype.getValue = function (index, mult) {
        if (!index) {
            index = 0;
        }
        if (!mult) {
            mult = 1;
        }
        if (index >= this.periods.length) {
            return 0;
        }
        var c = this.count;
        for (var i = 0; i < index; i++) {
            c -= this.periods[i];
        }
        return (c * mult) / this.periods[index];
    };
    LoopCounter.prototype.next = function () {
        this.count = (this.count + 1) % this.period;
    };
    return LoopCounter;
}());
var CountDownMain = (function () {
    function CountDownMain(dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    CountDownMain.prototype.show = function () {
        var dnow = new Date();
        var diff = Math.floor((this.dateOfBirth.getTime() - dnow.getTime()) / 1000);
        var sec = diff % 60;
        diff = Math.floor(diff / 60);
        var min = diff % 60;
        diff = Math.floor(diff / 60);
        var hour = diff % 24;
        var day = Math.floor(diff / 24);
        var days = "";
        if (day > 0) {
            days = String(day);
        }
        var hour_s = String(hour);
        if (hour < 10) {
            hour_s = "0" + hour_s;
        }
        var min_s = String(min);
        if (min < 10) {
            min_s = "0" + min_s;
        }
        var sec_s = String(sec);
        if (sec < 10) {
            sec_s = "0" + sec_s;
        }
        var msg_mino = "りっちゃん25歳まで…";
        var msg_days = "";
        if (day > 0) {
            msg_days = days + "日";
        }
        var msg_time = hour_s + "時間" + min_s + "分" + sec_s + "秒";
        var x_center = 150;
        var mc = document.getElementById("risa-canvas");
        var context = mc.getContext("2d");
        context.textAlign = "center";
        context.shadowColor = "#993300";
        context.shadowBlur = 6;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.fillStyle = "#ffff00";
        context.font = "30px sans-serif";
        context.fillText(msg_mino, x_center, 40);
        context.font = "40px sans-serif";
        context.fillText(msg_days, x_center, 160);
        context.fillText(msg_time, x_center, 200);
    };
    return CountDownMain;
}());
var CountDownOkonomi = (function () {
    function CountDownOkonomi(risaImage, risaImage1, risaImage2) {
        this.risaImage = risaImage;
        this.risaImage1 = risaImage1;
        this.risaImage2 = risaImage2;
        this.risa_width_org = 200;
        this.risa_height_org = 200;
        this.screen_width = 300;
        this.screen_height = 300;
        this.loop = new LoopCounter(100, 20);
    }
    // お好み焼きシーン１ その１
    CountDownOkonomi.prototype.risa_move_next_1 = function (r) {
        var start_center_x = this.screen_width / 2;
        var start_center_y = this.screen_height / 2;
        var start_width = 12;
        var start_height = 20;
        var end_center_x = this.screen_width / 2;
        var end_center_y = this.screen_height / 2;
        var end_width = this.risa_width_org;
        var end_height = this.risa_height_org / 2;
        var amplitude = 1;
        var frequency = 1;
        var risa_width = start_width * (1 - r) + end_width * r;
        var risa_height = start_height * (1 - r) + end_height * r;
        var risa_x = start_center_x * (1 - r) + end_center_x * r - risa_width / 2;
        var risa_y = start_center_y * (1 - r) + end_center_y * r - risa_height / 2 + risa_height * amplitude * Math.sin(Math.PI * 2 * r * frequency);
        return new Rect(risa_x, risa_y, risa_width, risa_height);
    };
    // お好み焼きシーン１ その２
    CountDownOkonomi.prototype.risa_move_next_2 = function (r) {
        var start_center_x = this.screen_width / 2;
        var start_center_y = this.screen_height / 2;
        var risa_width = this.risa_width_org;
        var risa_height = this.risa_height_org * (1 - r * 0.9);
        var risa_x = start_center_x - risa_width / 2;
        return new Rect(risa_x, start_center_y - this.risa_height_org / 2, risa_width, this.risa_height_org).move(new Rect(0, this.risa_height_org / 2, 0, -this.risa_height_org), r * 0.9);
    };
    // シーン１
    CountDownOkonomi.prototype.okonomi_move = function (a, a2, rc, context, img) {
        var cx = rc.x + rc.width / 2;
        var cy = rc.y + rc.height / 2;
        var sx = this.screen_width / 2;
        var sy = this.screen_height / 2;
        var cx_new = sx + (cx - sx) * Math.cos(a) + (cy - sy) * Math.sin(a);
        var cy_new = sy - (cx - sx) * Math.sin(a) + (cy - sy) * Math.cos(a);
        var cx_new2 = cx_new * Math.cos(a2) + cy_new * Math.sin(a2);
        var cy_new2 = -cx_new * Math.sin(a2) + cy_new * Math.cos(a2);
        context.rotate(a2);
        context.drawImage(img, rc.x + cx_new2 - cx, rc.y + cy_new2 - cy, rc.width, rc.height);
        context.rotate(-a2);
    };
    CountDownOkonomi.prototype.show = function () {
        var mc = document.getElementById("risa-canvas");
        var context = mc.getContext("2d");
        if (this.loop.getIndex() == 0) {
            var r = this.loop.getValue(0, 4);
            var r2 = this.loop.getValue(0, 20);
            var risa_rect = this.risa_move_next_1(this.loop.getValue(0));
            var a = Math.PI * 2 * r;
            var a2 = Math.PI * 2 * r2;
            this.okonomi_move(a, a2, risa_rect, context, this.risaImage1);
            this.okonomi_move(a + Math.PI * 1 / 3, a2, risa_rect, context, this.risaImage2);
            this.okonomi_move(a + Math.PI * 2 / 3, a2, risa_rect, context, this.risaImage1);
            this.okonomi_move(a + Math.PI * 3 / 3, a2, risa_rect, context, this.risaImage2);
            this.okonomi_move(a + Math.PI * 4 / 3, a2, risa_rect, context, this.risaImage1);
            this.okonomi_move(a + Math.PI * 5 / 3, a2, risa_rect, context, this.risaImage2);
        }
        else {
            var risa_rect = this.risa_move_next_2(this.loop.getValue(1));
            risa_rect.drawImage(this.risaImage);
        }
        this.loop.next();
    };
    return CountDownOkonomi;
}());
var CountDownMerlion = (function () {
    // マーライオンシーン１
    function CountDownMerlion(mamiriImage) {
        this.mamiriImage = mamiriImage;
        this.screen_width = 300;
        this.screen_height = 300;
        this.mamiri_width = 100;
        this.mamiri_height = 100;
        var x1 = this.mamiri_width / 2;
        var x2 = this.screen_width - this.mamiri_width + this.mamiri_width / 2;
        var y = this.screen_height - this.mamiri_height + this.mamiri_height / 2;
        this.init_rect1 = new Rect(x1, y, 0, 0);
        this.init_rect2 = new Rect(x2, y, 0, 0);
        this.diff_rect = new Rect(-this.mamiri_width / 2, -this.mamiri_height / 2, this.mamiri_width, this.mamiri_height);
        this.loop = new LoopCounter(20);
    }
    CountDownMerlion.prototype.show = function () {
        var r = this.loop.getValue();
        this.loop.next();
        this.init_rect1.move(this.diff_rect, r).drawImage(this.mamiriImage);
        this.init_rect2.move(this.diff_rect, r).drawImage(this.mamiriImage);
    };
    return CountDownMerlion;
}());
var CountDownScene = (function () {
    function CountDownScene(risaImage, risaImage1, risaImage2, mamiriImage, dateOfBirth) {
        this.risaImage = risaImage;
        this.risaImage1 = risaImage1;
        this.risaImage2 = risaImage2;
        this.mamiriImage = mamiriImage;
        this.dateOfBirth = dateOfBirth;
        this.screenRect = new Rect(0, 0, 320, 320);
        this.countDownMain = new CountDownMain(this.dateOfBirth);
        this.countDownOkonnomi = new CountDownOkonomi(this.risaImage, this.risaImage, this.risaImage2);
        this.countDownMerlion = new CountDownMerlion(this.mamiriImage);
    }
    CountDownScene.prototype.show = function () {
        this.screenRect.clear();
        this.countDownMerlion.show();
        this.countDownOkonnomi.show();
        this.countDownMain.show();
    };
    return CountDownScene;
}());
var HappyBirthdayMain = (function () {
    function HappyBirthdayMain(risaImage) {
        this.risaImage = risaImage;
        this.f_i = 0;
        this.o_i = 0;
        this.arg_i = 0;
        this.arg_s = 12.0 * 10;
        this.msg_a = ["り", "っ", "ち", "ゃ", "ん", "★", "お", "め", "で", "と", "う", "★"];
        this.msg_s = ["★", "☆"];
        this.star_count = 6;
        this.star_period = 20;
        this.star_i = 0;
        this.mamiri_count = 0;
        this.mamiri_period2 = 40;
        this.mamiri_period3 = 8;
        this.screen_width = 300;
        this.screen_height = 300;
    }
    HappyBirthdayMain.prototype.show = function () {
        var mc = document.getElementById("risa-canvas");
        var context = mc.getContext("2d");
        var center_x = this.screen_width / 2;
        var center_y = this.screen_height / 2;
        var a = this.arg_i / this.arg_s;
        // りっちゃんおめでとうの表示
        context.fillStyle = "#ff6600";
        for (var i = 0; i < 12; i++) {
            var arg = Math.PI * 2 * (-a + i / 12.0);
            var x = Math.cos(arg) * 120 + center_x;
            var y = Math.sin(arg) * 120 + center_y;
            context.fillText(this.msg_a[i], x, y);
        }
        // 星の表示
        context.fillStyle = "#ffff00";
        var star_radius = 140;
        var r = this.star_i / this.star_period;
        var fs = 10 * (1 - r) + 50 * r;
        context.font = String(Math.floor(fs)) + "px sans-serif";
        for (var i = 0; i < 24; i++) {
            var arg = Math.PI * 2 * (a + i / 24.0);
            var x = Math.cos(arg) * star_radius * r + center_x;
            var y = Math.sin(arg) * star_radius * r + center_y;
            context.fillText(this.msg_s[(Math.floor(this.f_i / this.star_count) + i) % 2], x, y);
        }
        var n = 7.0;
        var z = (this.o_i / n) - 1.0;
        var g = 255 - Math.floor(z * z * 255);
        context.fillStyle = "rgb(255," + g + ",0)";
        context.fillText("25歳", center_x, 200);
        this.f_i = (this.f_i + 1) % (this.star_count * 2);
        this.o_i = (this.o_i + 1) % 12;
        this.arg_i = (this.arg_i + 1) % this.arg_s;
        this.star_i = (this.star_i + 1) % this.star_period;
    };
    return HappyBirthdayMain;
}());
var HappyBirthdayOkonomi = (function () {
    function HappyBirthdayOkonomi(risaImage) {
        this.risaImage = risaImage;
        this.arg_i = 0;
        this.arg_s = 12.0 * 10;
        this.screen_width = 300;
        this.screen_height = 300;
    }
    // シーン２
    HappyBirthdayOkonomi.prototype.okonomi_move2 = function (sx, sy, a1, a2, r1, r2, s, context, img) {
        var cx_new = sx + r1 * Math.cos(a1) + r1 * Math.sin(a1);
        var cy_new = sy - r1 * Math.sin(a1) + r1 * Math.cos(a1);
        var cx_new2 = cx_new + r2 * Math.cos(a2) + r2 * Math.sin(a2);
        var cy_new2 = cy_new - r2 * Math.sin(a2) + r2 * Math.cos(a2);
        context.drawImage(img, cx_new2 - s, cy_new2 - s, s * 2, s * 2);
    };
    HappyBirthdayOkonomi.prototype.show = function () {
        var mc = document.getElementById("risa-canvas");
        var context = mc.getContext("2d");
        var center_x = this.screen_width / 2;
        var center_y = this.screen_height / 2;
        var a = this.arg_i / this.arg_s;
        this.okonomi_move2(center_x, center_y, -a * Math.PI * 4, -a * Math.PI * 24, 100, 20, 25, context, this.risaImage);
        this.okonomi_move2(center_x, center_y, Math.PI * 2 * 1 / 5 - a * Math.PI * 4, -a * Math.PI * 24, 100, 20, 25, context, this.risaImage);
        this.okonomi_move2(center_x, center_y, Math.PI * 2 * 2 / 5 - a * Math.PI * 4, -a * Math.PI * 24, 100, 20, 25, context, this.risaImage);
        this.okonomi_move2(center_x, center_y, Math.PI * 2 * 3 / 5 - a * Math.PI * 4, -a * Math.PI * 24, 100, 20, 25, context, this.risaImage);
        this.okonomi_move2(center_x, center_y, Math.PI * 2 * 4 / 5 - a * Math.PI * 4, -a * Math.PI * 24, 100, 20, 25, context, this.risaImage);
        this.arg_i = (this.arg_i + 1) % this.arg_s;
    };
    return HappyBirthdayOkonomi;
}());
var HappyBirthdayMerlion = (function () {
    function HappyBirthdayMerlion(mamiriImage) {
        this.mamiriImage = mamiriImage;
        this.mamiri_count = 0;
        this.mamiri_period2 = 40;
        this.mamiri_period3 = 8;
        this.screen_width = 300;
        this.screen_height = 300;
    }
    HappyBirthdayMerlion.prototype.show = function () {
        var mc = document.getElementById("risa-canvas");
        var context = mc.getContext("2d");
        var r = this.mamiri_count / this.mamiri_period2;
        var r3 = (this.mamiri_count % this.mamiri_period3) / this.mamiri_period3;
        var mamiri_width = 100;
        var mamiri_height = 100;
        var mamiri1_x = (this.screen_width - mamiri_width) * r;
        var mamiri2_x = (this.screen_width - mamiri_width) * (1 - r);
        var mamiri1_y = (this.screen_height - mamiri_height) - mamiri_height * (0.25 - (r3 - 0.5) * (r3 - 0.5)) * 4;
        var mamiri2_y = mamiri1_y;
        this.mamiri_count = (this.mamiri_count + 1) % this.mamiri_period2;
        context.drawImage(this.mamiriImage, mamiri1_x, mamiri1_y, mamiri_width, mamiri_height);
        context.drawImage(this.mamiriImage, mamiri2_x, mamiri1_y, mamiri_width, mamiri_height);
        context.drawImage(this.mamiriImage, mamiri1_x, mamiri2_y, mamiri_width, mamiri_height);
        context.drawImage(this.mamiriImage, mamiri2_x, mamiri2_y, mamiri_width, mamiri_height);
    };
    return HappyBirthdayMerlion;
}());
var HappyBirthdayScene = (function () {
    function HappyBirthdayScene(risaImage, mamiriImage) {
        this.risaImage = risaImage;
        this.mamiriImage = mamiriImage;
        this.happyBirthdayMain = new HappyBirthdayMain(this.risaImage);
        this.happyBirthdayOkonomi = new HappyBirthdayOkonomi(this.risaImage);
        this.happyBirthdayMerlion = new HappyBirthdayMerlion(this.mamiriImage);
        this.f_i = 0;
        this.o_i = 0;
        this.msg_a = ["り", "っ", "ち", "ゃ", "ん", "★", "お", "め", "で", "と", "う", "★"];
        this.msg_s = ["★", "☆"];
        this.arg_i = 0;
        this.arg_s = 12.0 * 10;
        this.star_count = 6;
        this.star_period = 20;
        this.star_i = 0;
        this.mamiri_count = 0;
        this.mamiri_period2 = 40;
        this.mamiri_period3 = 8;
        this.screen_width = 300;
        this.screen_height = 300;
    }
    // マーライオンシーン２
    HappyBirthdayScene.prototype.mamiri_move_next2 = function (context) {
        var r = this.mamiri_count / this.mamiri_period2;
        var r3 = (this.mamiri_count % this.mamiri_period3) / this.mamiri_period3;
        var mamiri_width = 100;
        var mamiri_height = 100;
        var mamiri1_x = (this.screen_width - mamiri_width) * r;
        var mamiri2_x = (this.screen_width - mamiri_width) * (1 - r);
        var mamiri1_y = (this.screen_height - mamiri_height) - mamiri_height * (0.25 - (r3 - 0.5) * (r3 - 0.5)) * 4;
        var mamiri2_y = mamiri1_y;
        this.mamiri_count = (this.mamiri_count + 1) % this.mamiri_period2;
        context.drawImage(this.mamiriImage, mamiri1_x, mamiri1_y, mamiri_width, mamiri_height);
        context.drawImage(this.mamiriImage, mamiri2_x, mamiri1_y, mamiri_width, mamiri_height);
        context.drawImage(this.mamiriImage, mamiri1_x, mamiri2_y, mamiri_width, mamiri_height);
        context.drawImage(this.mamiriImage, mamiri2_x, mamiri2_y, mamiri_width, mamiri_height);
    };
    HappyBirthdayScene.prototype.show = function () {
        var mc = document.getElementById("risa-canvas");
        var context = mc.getContext("2d");
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.shadowBlur = 0;
        context.font = "40px sans-serif";
        context.clearRect(0, 0, 320, 320);
        this.happyBirthdayMerlion.show();
        this.happyBirthdayOkonomi.show();
        this.happyBirthdayMain.show();
    };
    return HappyBirthdayScene;
}());
var CountDown2016 = (function () {
    function CountDown2016() {
        this.risaImage = new Image();
        this.risaImage1 = new Image();
        this.risaImage2 = new Image();
        this.mamiriImage = new Image();
        //private dateOfBirth: Date = new Date(2015, 5, 12);
        this.dateOfBirth = new Date(2016, 5, 12);
        this.countDownScene = new CountDownScene(this.risaImage, this.risaImage1, this.risaImage2, this.mamiriImage, this.dateOfBirth);
        this.happyBirthdayScene = new HappyBirthdayScene(this.risaImage, this.mamiriImage);
        this.risaImage.src = "image/okonomi.png";
        this.risaImage1.src = "image/okonomi1.png";
        this.risaImage2.src = "image/okonomi2.png";
        this.mamiriImage.src = "image/merlion.png";
    }
    CountDown2016.prototype.go_next = function (setTimeout) {
        if (new Date() > this.dateOfBirth) {
            this.happyBirthdayScene.show();
            setTimeout(40);
        }
        else {
            this.countDownScene.show();
            setTimeout(100);
        }
    };
    return CountDown2016;
}());
var Timer = (function () {
    function Timer() {
        this.loop_doing = false;
        this.timer = this;
    }
    Timer.prototype.setTimeout = function (time) {
        setTimeout(timer.go_next_loop, time);
    };
    Timer.prototype.go_next = function () {
        countdown.go_next(this.setTimeout);
    };
    Timer.prototype.go_next_loop = function () {
        if (timer.loop_doing) {
            timer.go_next();
        }
    };
    Timer.prototype.start = function () {
        if (!this.loop_doing) {
            this.loop_doing = true;
            this.go_next_loop();
        }
    };
    Timer.prototype.stop = function () {
        if (this.loop_doing) {
            this.loop_doing = false;
        }
    };
    return Timer;
}());
var countdown = new CountDown2016();
var timer = new Timer();
function start_loop() {
    timer.start();
}
//var mmr_sound = new Audio("risa/risa13-3-4.mp3");
//mmr_sound.loop = true;
//function mmr_sound_on()
//{
//	mmr_sound.play();
//}
//function mmr_sound_off()
//{
//	mmr_sound.pause();
//}
//var mmr_sound_on_state = false;
//function mmr_sound_go()
//{
//	if ( mmr_sound_on_state ) {
//		mmr_sound_off();
//		mmr_sound_on_state = false;
//	} else {
//		mmr_sound_on();
//		mmr_sound_on_state = true;
//	}
//}
//# sourceMappingURL=CountDown2016.js.map