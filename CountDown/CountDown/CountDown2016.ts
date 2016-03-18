class Rect {
    public constructor(public x: number, public y: number, public width: number, public height: number) {
    }
}

class CountDownScene {
    public constructor(private risaImage, private risaImage1, private risaImage2, private mamiriImage) {
    }

    private risa_width_org = 200;
    private risa_height_org = 200;
    private risa_count = 0;
    private risa_period_1 = 100;
    private risa_period_2 = 20;
    private risa_period = this.risa_period_1 + this.risa_period_2;

    private mamiri_count = 0;
    private mamiri_period = 20;

    private screen_width = 300;
    private screen_height = 300;

    // お好み焼きシーン１ その１
    private risa_move_next_1(r) {
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
    }

    // お好み焼きシーン１ その２
    private risa_move_next_2(r) {
        var start_center_x = this.screen_width / 2;
        var start_center_y = this.screen_height / 2;
        var risa_width = this.risa_width_org;
        var risa_height = this.risa_height_org * (1 - r * 0.9);
        var risa_x = start_center_x - risa_width / 2;
        var risa_y = start_center_y - risa_height / 2;
        return new Rect(risa_x, risa_y, risa_width, risa_height);
    }

    // シーン１
    private okonomi_move(a, a2, rc, context, img) {
        var cx = rc.x + rc.width / 2
        var cy = rc.y + rc.height / 2
        var sx = this.screen_width / 2;
        var sy = this.screen_height / 2;
        var cx_new = sx + (cx - sx) * Math.cos(a) + (cy - sy) * Math.sin(a);
        var cy_new = sy - (cx - sx) * Math.sin(a) + (cy - sy) * Math.cos(a);
        var cx_new2 = cx_new * Math.cos(a2) + cy_new * Math.sin(a2);
        var cy_new2 = - cx_new * Math.sin(a2) + cy_new * Math.cos(a2);
        context.rotate(a2);
        context.drawImage(img, rc.x + cx_new2 - cx, rc.y + cy_new2 - cy, rc.width, rc.height);
        context.rotate(-a2);
    }

    private risa_move_next(context) {
        if (this.risa_count < this.risa_period_1) {
            var risa_rect = this.risa_move_next_1(this.risa_count / this.risa_period_1);
            var r = ((this.risa_count * 4) % this.risa_period_1) / this.risa_period_1;
            var a = Math.PI * 2 * r;
            var r2 = ((this.risa_count * 20) % this.risa_period_1) / this.risa_period_1;
            var a2 = Math.PI * 2 * r2;
            this.okonomi_move(a, a2, risa_rect, context, this.risaImage1);
            this.okonomi_move(a + Math.PI * 1 / 3, a2, risa_rect, context, this.risaImage2);
            this.okonomi_move(a + Math.PI * 2 / 3, a2, risa_rect, context, this.risaImage1);
            this.okonomi_move(a + Math.PI * 3 / 3, a2, risa_rect, context, this.risaImage2);
            this.okonomi_move(a + Math.PI * 4 / 3, a2, risa_rect, context, this.risaImage1);
            this.okonomi_move(a + Math.PI * 5 / 3, a2, risa_rect, context, this.risaImage2);
        } else {
            var risa_rect = this.risa_move_next_2((this.risa_count - this.risa_period_1) / this.risa_period_2);
            context.drawImage(this.risaImage, risa_rect.x, risa_rect.y, risa_rect.width, risa_rect.height);
        }
        this.risa_count = (this.risa_count + 1) % this.risa_period;
    }

    // マーライオンシーン１
    private mamiri_move_next(context) {
        var r = this.mamiri_count / this.mamiri_period;
        var mamiri_width = 100;
        var mamiri_height = 100;
        var mamiri1_x = mamiri_width * (1 - r) / 2;
        var mamiri2_x = this.screen_width - mamiri_width + mamiri_width * (1 - r) / 2;
        var mamiri_y = this.screen_height - mamiri_height + mamiri_height * (1 - r) / 2;
        this.mamiri_count = (this.mamiri_count + 1) % this.mamiri_period;
        context.drawImage(this.mamiriImage, mamiri1_x, mamiri_y, mamiri_width * r, mamiri_height * r);
        context.drawImage(this.mamiriImage, mamiri2_x, mamiri_y, mamiri_width * r, mamiri_height * r);
    }

    public movePicture(dbir: Date) {
        var dnow = new Date();
        var diff: number = Math.floor((dbir.getTime() - dnow.getTime()) / 1000);
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
        var hour_s: string = String(hour);
        if (hour < 10) {
            hour_s = "0" + hour_s;
        }
        var min_s: string = String(min);
        if (min < 10) {
            min_s = "0" + min_s;
        }
        var sec_s: string = String(sec);
        if (sec < 10) {
            sec_s = "0" + sec_s;
        }

        var msg_mino = "りっちゃん25歳まで…";
        var msg_days = "";
        if (day > 0) {
            msg_days = days + "日"
        }
        var msg_time = hour_s + "時間" + min_s + "分" + sec_s + "秒";

        var x_center = 150;
        var mc = <HTMLCanvasElement>document.getElementById("risa-canvas");
        var context = mc.getContext("2d");
        context.textAlign = "center";
        context.shadowColor = "#993300";
        context.shadowBlur = 6;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.fillStyle = "#ffff00";
        context.clearRect(0, 0, 320, 320);

        this.mamiri_move_next(context);

        this.risa_move_next(context);

        context.font = "30px sans-serif";
        context.fillText(msg_mino, x_center, 40);
        context.font = "40px sans-serif";
        context.fillText(msg_days, x_center, 160);
        context.fillText(msg_time, x_center, 200);
    }
}

class HappyBirthdayScene {
    public constructor(private risaImage, private mamiriImage) {
    }

    private f_i = 0;
    private o_i = 0;

    private msg_a: string[] = ["り", "っ", "ち", "ゃ", "ん", "★", "お", "め", "で", "と", "う", "★"];
    private msg_s: string[] = ["★", "☆"];

    private arg_i = 0;
    private arg_s = 12.0 * 10;
    private star_count = 6;
    private star_period = 20;
    private star_i = 0;

    private mamiri_count = 0;
    private mamiri_period2 = 40;
    private mamiri_period3 = 8;

    private screen_width = 300;
    private screen_height = 300;

    // マーライオンシーン２
    private mamiri_move_next2(context) {
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
    }

    // シーン２
    private okonomi_move2(sx, sy, a1, a2, r1, r2, s, context, img) {
        var cx_new = sx + r1 * Math.cos(a1) + r1 * Math.sin(a1);
        var cy_new = sy - r1 * Math.sin(a1) + r1 * Math.cos(a1);
        var cx_new2 = cx_new + r2 * Math.cos(a2) + r2 * Math.sin(a2);
        var cy_new2 = cy_new - r2 * Math.sin(a2) + r2 * Math.cos(a2);
        context.drawImage(img, cx_new2 - s, cy_new2 - s, s * 2, s * 2);
    }

    private happy_birthday(context) {
        var center_x = this.screen_width / 2;
        var center_y = this.screen_height / 2;

        var a = this.arg_i / this.arg_s;

        this.okonomi_move2(center_x, center_y, - a * Math.PI * 4, - a * Math.PI * 24, 100, 20, 25, context, this.risaImage);
        this.okonomi_move2(center_x, center_y, Math.PI * 2 * 1 / 5 - a * Math.PI * 4, - a * Math.PI * 24, 100, 20, 25, context, this.risaImage);
        this.okonomi_move2(center_x, center_y, Math.PI * 2 * 2 / 5 - a * Math.PI * 4, - a * Math.PI * 24, 100, 20, 25, context, this.risaImage);
        this.okonomi_move2(center_x, center_y, Math.PI * 2 * 3 / 5 - a * Math.PI * 4, - a * Math.PI * 24, 100, 20, 25, context, this.risaImage);
        this.okonomi_move2(center_x, center_y, Math.PI * 2 * 4 / 5 - a * Math.PI * 4, - a * Math.PI * 24, 100, 20, 25, context, this.risaImage);

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
        context.fillText("24歳", center_x, 200);

        this.f_i = (this.f_i + 1) % (this.star_count * 2);
        this.o_i = (this.o_i + 1) % 12;
        this.arg_i = (this.arg_i + 1) % this.arg_s;
        this.star_i = (this.star_i + 1) % this.star_period;
    }

    public movePicture() {

        var mc = <HTMLCanvasElement>document.getElementById("risa-canvas");
        var context = mc.getContext("2d");
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.shadowBlur = 0;
        context.font = "40px sans-serif";

        context.clearRect(0, 0, 320, 320);

        this.mamiri_move_next2(context);

        this.happy_birthday(context);
    }
}

class CountDown2016 {
    constructor() {
        this.risaImage.src = "image/okonomi.png";
        this.risaImage1.src = "image/okonomi1.png";
        this.risaImage2.src = "image/okonomi2.png";
        this.mamiriImage.src = "image/merlion.png";
    }

    private risaImage = new Image();
    private risaImage1 = new Image();
    private risaImage2 = new Image();
    private mamiriImage = new Image();

    private countDownScene = new CountDownScene(this.risaImage, this.risaImage1, this.risaImage2, this.mamiriImage);
    private happyBirthdayScene = new HappyBirthdayScene(this.risaImage, this.mamiriImage);

    public go_next(setTimeout) {
        var dbir = new Date(2016, 5, 12);
        if (new Date() > dbir) {
            this.happyBirthdayScene.movePicture();
            setTimeout(40);
        } else {
            this.countDownScene.movePicture(dbir);
            setTimeout(100);
        }
    }
}

class Timer {
    private loop_doing = false;
    private timer = this;

    public setTimeout(time) {
        setTimeout(timer.go_next_loop, time);
    }

    private go_next() {
        countdown.go_next(this.setTimeout);
    }

    private go_next_loop() {
        if (timer.loop_doing) {
            timer.go_next();
        }
    }

    public start() {
        if (!this.loop_doing) {
            this.loop_doing = true;
            this.go_next_loop();
        }
    }

    public stop() {
        if (this.loop_doing) {
            this.loop_doing = false;
        }
    }
}

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
