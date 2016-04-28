enum MoveType { Up, Down, Sin, Cos };

class Rect {
    public constructor(public x: number, public y: number, public width: number, public height: number) {
    }
    public move(moveType: MoveType, diffRect: Rect, a: number): Rect {
        var r: number;
        switch (moveType) {
            case MoveType.Up:
                r = a;
                break;
            case MoveType.Down:
                r = -a;
                break;
            case MoveType.Sin:
                r = Math.sin(Math.PI * 2 * a);
                break;
            case MoveType.Cos:
                r = Math.cos(Math.PI * 2 * a);
                break;
        }
        var rx = this.x + diffRect.x * r;
        var ry = this.y + diffRect.y * r;
        var rw = this.width + diffRect.width * r;
        var rh = this.height + diffRect.height * r;
        return new Rect(rx, ry, rw, rh);
    }
    public moveTo(destRect: Rect, r: number): Rect {
        return this.move(MoveType.Up, new Rect(destRect.x - this.x, destRect.y - this.y, destRect.width - this.width, destRect.height - this.height), r);
    }
    public drawImage(image: HTMLImageElement): void {
        var mc: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("risa-canvas");
        var context: CanvasRenderingContext2D = mc.getContext("2d");
        context.drawImage(image, this.x, this.y, this.width, this.height);
    }
    public clear(): void {
        var mc: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("risa-canvas");
        var context: CanvasRenderingContext2D = mc.getContext("2d");
        context.clearRect(this.x, this.y, this.width, this.height);
    }
}

class Point {
    public constructor(public x: number, public y: number) {
    }
}

class LoopCounter {
    public constructor(period1: number, period2?: number, period3?: number) {
        if (!period2) {
            this.period = period1;
            this.periods = [period1];
        } else if (!period3) {
            this.period = period1 + period2;
            this.periods = [period1, period2];
        } else {
            this.period = period1 + period2 + period3;
            this.periods = [period1, period2, period3];
        }
    }
    private period: number;
    private periods: number[];
    private count: number = 0;
    public getIndex(): number {
        var c: number = this.count;
        for (var i: number = 0; i < this.periods.length; i++) {
            if (c < this.periods[i]) {
                return i;
            }
            c -= this.periods[i];
        }
        return this.periods.length - 1;
    }
    public getValue(index?: number, mult?: number): number {
        if (!index) {
            index = 0;
        }
        if (!mult) {
            mult = 1;
        }
        if (index >= this.periods.length) {
            return 0;
        }
        var c: number = this.count;
        for (var i: number = 0; i < index; i++) {
            c -= this.periods[i];
        }
        return (c * mult) / this.periods[index];
    }
    public next(): void {
        this.count = (this.count + 1) % this.period;
    }
}

class CountDownMain {
    public constructor(private dateOfBirth: Date) {
    }

    public show(): void {
        var dnow: Date = new Date();
        var diff: number = Math.floor((this.dateOfBirth.getTime() - dnow.getTime()) / 1000);
        var sec: number = diff % 60;
        diff = Math.floor(diff / 60);
        var min: number = diff % 60;
        diff = Math.floor(diff / 60);
        var hour: number = diff % 24;
        var day: number = Math.floor(diff / 24);
        var days: string = "";
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

        var msg_mino: string = "りっちゃん25歳まで…";
        var msg_days: string = "";
        if (day > 0) {
            msg_days = days + "日"
        }
        var msg_time: string = hour_s + "時間" + min_s + "分" + sec_s + "秒";

        var x_center: number = 150;
        var mc: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("risa-canvas");
        var context: CanvasRenderingContext2D = mc.getContext("2d");
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
    }
}

class CountDownOkonomi {
    public constructor(private risaImage: HTMLImageElement, private risaImage1: HTMLImageElement, private risaImage2: HTMLImageElement) {
        this.loop = new LoopCounter(100, 20);
    }

    private loop: LoopCounter;

    private risa_width_org: number = 200;
    private risa_height_org: number = 200;

    private screen_width: number = 300;
    private screen_height: number = 300;

    // お好み焼きシーン１ その１
    private risa_move_next_1(r: number): Rect {
        var start_center_x: number = this.screen_width / 2;
        var start_center_y: number = this.screen_height / 2;
        var start_width: number = 12;
        var start_height: number = 20;
        var end_center_x: number = this.screen_width / 2;
        var end_center_y: number = this.screen_height / 2;
        var end_width: number = this.risa_width_org;
        var end_height: number = this.risa_height_org / 2;
        var amplitude: number = 1;
        var frequency: number = 1;

        var start_rect = new Rect(start_center_x - start_width / 2, start_center_y - start_height / 2, start_width, start_height);
        var end_rect = new Rect(end_center_x - end_width / 2, end_center_y - end_height / 2, end_width, end_height);
        var moving_rect = start_rect.moveTo(end_rect, r);

        var r_rect = new Rect(0, start_height * amplitude, 0, 0).moveTo(new Rect(0, end_height * amplitude, 0, 0), r);

        return moving_rect.move(MoveType.Sin, r_rect, r * frequency);
    }

    // シーン１
    // (0, 0) を中心とした 角度 α の回転を R(α) とする。
    // (a, b) を中心として (c, d) を角度 α 回転させると R(α)(c - a, d - b) + (a, b) に写る。
    // (0, 0) を中心として (x, y) を角度 α 回転させると R(α)(x, y) に写る。
    // R(α)(x, y) = R(α)(c - a, d - b) + (a, b) とすると
    // (x, y) = R(-α)(R(α)(c - a, d - b) + (a, b)) = (c, d) - (a, b) + R(-α)(a, b)
    private okonomi_move(a: number, a2: number, rc: Rect, context: CanvasRenderingContext2D, img: HTMLImageElement): void {
        // (cx, cy) 図形の中心
        var cx: number = rc.x + rc.width / 2
        var cy: number = rc.y + rc.height / 2
        // (sx, sy) 画面の中心
        var sx: number = this.screen_width / 2;
        var sy: number = this.screen_height / 2;
        // (cx_new, cy_new) = (sx, sy) - R(a)((cx, cy) - (sx, sy))
        var cx_new: number = sx + (cx - sx) * Math.cos(a) + (cy - sy) * Math.sin(a);
        var cy_new: number = sy - (cx - sx) * Math.sin(a) + (cy - sy) * Math.cos(a);
        // (cx_new2, cy_new2) = - R(a2)(cx_new, cy_new)
        var cx_new2: number = cx_new * Math.cos(a2) + cy_new * Math.sin(a2);
        var cy_new2: number = - cx_new * Math.sin(a2) + cy_new * Math.cos(a2);
        context.rotate(a2);
        context.drawImage(img, rc.x + cx_new2 - cx, rc.y + cy_new2 - cy, rc.width, rc.height);
        context.rotate(-a2);
    }

    // お好み焼きシーン１ その２
    private risa_move_next_2(r: number): Rect {
        var start_center_x: number = this.screen_width / 2;
        var start_center_y: number = this.screen_height / 2;
        var risa_width: number = this.risa_width_org;
        var risa_height: number = this.risa_height_org * (1 - r * 0.9);
        var risa_x: number = start_center_x - risa_width / 2;
        var start_rect = new Rect(risa_x, start_center_y - this.risa_height_org / 2, risa_width, this.risa_height_org);
        var diff_rect = new Rect(0, this.risa_height_org / 2, 0, -this.risa_height_org);
        return start_rect.move(MoveType.Up, diff_rect, r * 0.9);
    }

    public show(): void {
        var mc: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("risa-canvas");
        var context: CanvasRenderingContext2D = mc.getContext("2d");
        if (this.loop.getIndex() == 0) {
            var r: number = this.loop.getValue(0, 4);
            var r2: number = this.loop.getValue(0, 20);
            var risa_rect: Rect = this.risa_move_next_1(this.loop.getValue(0));
            var a: number = Math.PI * 2 * r;
            var a2: number = Math.PI * 2 * r2;
            this.okonomi_move(a, a2, risa_rect, context, this.risaImage1);
            this.okonomi_move(a + Math.PI * 1 / 3, a2, risa_rect, context, this.risaImage2);
            this.okonomi_move(a + Math.PI * 2 / 3, a2, risa_rect, context, this.risaImage1);
            this.okonomi_move(a + Math.PI * 3 / 3, a2, risa_rect, context, this.risaImage2);
            this.okonomi_move(a + Math.PI * 4 / 3, a2, risa_rect, context, this.risaImage1);
            this.okonomi_move(a + Math.PI * 5 / 3, a2, risa_rect, context, this.risaImage2);
        } else {
            var risa_rect: Rect = this.risa_move_next_2(this.loop.getValue(1));
            risa_rect.drawImage(this.risaImage);
        }
        this.loop.next();
    }
}

class CountDownMerlion {
    // マーライオンシーン１
    public constructor(private mamiriImage: HTMLImageElement) {
        var x1: number = this.mamiri_width / 2;
        var x2: number = this.screen_width - this.mamiri_width + this.mamiri_width / 2;
        var y: number = this.screen_height - this.mamiri_height + this.mamiri_height / 2;
        this.init_rect1 = new Rect(x1, y, 0, 0);
        this.init_rect2 = new Rect(x2, y, 0, 0);
        this.diff_rect = new Rect(-this.mamiri_width / 2, -this.mamiri_height / 2, this.mamiri_width, this.mamiri_height);
        this.loop = new LoopCounter(20);
    }

    private screen_width: number = 300;
    private screen_height: number = 300;

    private mamiri_width: number = 100;
    private mamiri_height: number = 100;

    private init_rect1: Rect;
    private init_rect2: Rect;
    private diff_rect: Rect;

    private loop: LoopCounter;

    public show(): void {
        var r: number = this.loop.getValue();
        this.loop.next();
        this.init_rect1.move(MoveType.Up, this.diff_rect, r).drawImage(this.mamiriImage);
        this.init_rect2.move(MoveType.Up, this.diff_rect, r).drawImage(this.mamiriImage);
    }
}

class CountDownScene {
    public constructor(private risaImage: HTMLImageElement, private risaImage1: HTMLImageElement, private risaImage2: HTMLImageElement, private mamiriImage: HTMLImageElement, private dateOfBirth: Date) {
    }

    private screenRect = new Rect(0, 0, 320, 320);

    private countDownMain = new CountDownMain(this.dateOfBirth);
    private countDownOkonnomi = new CountDownOkonomi(this.risaImage, this.risaImage, this.risaImage2);
    private countDownMerlion = new CountDownMerlion(this.mamiriImage);

    public show(): void {
        this.screenRect.clear();
        this.countDownMerlion.show();
        this.countDownOkonnomi.show();
        this.countDownMain.show();
    }
}

class HappyBirthdayMain {
    public constructor(private risaImage: HTMLImageElement) {
    }

    private f_i: number = 0;
    private o_i: number = 0;

    private arg_i: number = 0;
    private arg_s: number = 12.0 * 10;

    private msg_a: string[] = ["り", "っ", "ち", "ゃ", "ん", "★", "お", "め", "で", "と", "う", "★"];
    private msg_s: string[] = ["★", "☆"];

    private star_count: number = 6;
    private star_period: number = 20;
    private star_i: number = 0;

    private mamiri_count: number = 0;
    private mamiri_period2: number = 40;
    private mamiri_period3: number = 8;

    private screen_width: number = 300;
    private screen_height: number = 300;

    public show(): void {
        var mc: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("risa-canvas");
        var context: CanvasRenderingContext2D = mc.getContext("2d");

        var center_x: number = this.screen_width / 2;
        var center_y: number = this.screen_height / 2;

        var a: number = this.arg_i / this.arg_s;

        // りっちゃんおめでとうの表示
        context.fillStyle = "#ff6600";
        for (var i: number = 0; i < 12; i++) {
            var arg: number = Math.PI * 2 * (-a + i / 12.0);
            var x: number = Math.cos(arg) * 120 + center_x;
            var y: number = Math.sin(arg) * 120 + center_y;
            context.fillText(this.msg_a[i], x, y);
        }

        // 星の表示
        context.fillStyle = "#ffff00";
        var star_radius: number = 140;
        var r: number = this.star_i / this.star_period;
        var fs: number = 10 * (1 - r) + 50 * r;
        context.font = String(Math.floor(fs)) + "px sans-serif";
        for (var i: number = 0; i < 24; i++) {
            var arg: number = Math.PI * 2 * (a + i / 24.0);
            var x: number = Math.cos(arg) * star_radius * r + center_x;
            var y: number = Math.sin(arg) * star_radius * r + center_y;
            context.fillText(this.msg_s[(Math.floor(this.f_i / this.star_count) + i) % 2], x, y);
        }

        var n: number = 7.0;
        var z: number = (this.o_i / n) - 1.0;
        var g: number = 255 - Math.floor(z * z * 255);
        context.fillStyle = "rgb(255," + g + ",0)";
        context.fillText("25歳", center_x, 200);

        this.f_i = (this.f_i + 1) % (this.star_count * 2);
        this.o_i = (this.o_i + 1) % 12;
        this.arg_i = (this.arg_i + 1) % this.arg_s;
        this.star_i = (this.star_i + 1) % this.star_period;
    }
}

class HappyBirthdayOkonomi {
    public constructor(private risaImage: HTMLImageElement) {
    }

    private arg_i: number = 0;
    private arg_s: number = 12.0 * 10;

    private screen_width: number = 300;
    private screen_height: number = 300;

    // シーン２
    private okonomi_move2(sx: number, sy: number, a1: number, a2: number, r1: number, r2: number, s: number, context: CanvasRenderingContext2D, img: HTMLImageElement): void {
        var cx_new: number = sx + r1 * Math.cos(a1) + r1 * Math.sin(a1);
        var cy_new: number = sy - r1 * Math.sin(a1) + r1 * Math.cos(a1);
        var cx_new2: number = cx_new + r2 * Math.cos(a2) + r2 * Math.sin(a2);
        var cy_new2: number = cy_new - r2 * Math.sin(a2) + r2 * Math.cos(a2);
        context.drawImage(img, cx_new2 - s, cy_new2 - s, s * 2, s * 2);
    }

    public show(): void {
        var mc: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("risa-canvas");
        var context: CanvasRenderingContext2D = mc.getContext("2d");

        var center_x: number = this.screen_width / 2;
        var center_y: number = this.screen_height / 2;

        var a: number = this.arg_i / this.arg_s;

        this.okonomi_move2(center_x, center_y, - a * Math.PI * 4, - a * Math.PI * 24, 100, 20, 25, context, this.risaImage);
        this.okonomi_move2(center_x, center_y, Math.PI * 2 * 1 / 5 - a * Math.PI * 4, - a * Math.PI * 24, 100, 20, 25, context, this.risaImage);
        this.okonomi_move2(center_x, center_y, Math.PI * 2 * 2 / 5 - a * Math.PI * 4, - a * Math.PI * 24, 100, 20, 25, context, this.risaImage);
        this.okonomi_move2(center_x, center_y, Math.PI * 2 * 3 / 5 - a * Math.PI * 4, - a * Math.PI * 24, 100, 20, 25, context, this.risaImage);
        this.okonomi_move2(center_x, center_y, Math.PI * 2 * 4 / 5 - a * Math.PI * 4, - a * Math.PI * 24, 100, 20, 25, context, this.risaImage);

        this.arg_i = (this.arg_i + 1) % this.arg_s;
    }
}

class HappyBirthdayMerlion {
    public constructor(private mamiriImage: HTMLImageElement) {
    }

    private mamiri_count: number = 0;
    private mamiri_period2: number = 40;
    private mamiri_period3: number = 8;

    private screen_width: number = 300;
    private screen_height: number = 300;

    public show(): void {
        var mc: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("risa-canvas");
        var context: CanvasRenderingContext2D = mc.getContext("2d");
        var r: number = this.mamiri_count / this.mamiri_period2;
        var r3: number = (this.mamiri_count % this.mamiri_period3) / this.mamiri_period3;
        var mamiri_width: number = 100;
        var mamiri_height: number = 100;
        var mamiri1_x: number = (this.screen_width - mamiri_width) * r;
        var mamiri2_x: number = (this.screen_width - mamiri_width) * (1 - r);
        var mamiri1_y: number = (this.screen_height - mamiri_height) - mamiri_height * (0.25 - (r3 - 0.5) * (r3 - 0.5)) * 4;
        var mamiri2_y: number = mamiri1_y;
        this.mamiri_count = (this.mamiri_count + 1) % this.mamiri_period2;
        context.drawImage(this.mamiriImage, mamiri1_x, mamiri1_y, mamiri_width, mamiri_height);
        context.drawImage(this.mamiriImage, mamiri2_x, mamiri1_y, mamiri_width, mamiri_height);
        context.drawImage(this.mamiriImage, mamiri1_x, mamiri2_y, mamiri_width, mamiri_height);
        context.drawImage(this.mamiriImage, mamiri2_x, mamiri2_y, mamiri_width, mamiri_height);
    }
}

class HappyBirthdayScene {
    public constructor(private risaImage: HTMLImageElement, private mamiriImage: HTMLImageElement) {
    }

    private happyBirthdayMain: HappyBirthdayMain = new HappyBirthdayMain(this.risaImage);
    private happyBirthdayOkonomi: HappyBirthdayOkonomi = new HappyBirthdayOkonomi(this.risaImage);
    private happyBirthdayMerlion: HappyBirthdayMerlion = new HappyBirthdayMerlion(this.mamiriImage);

    private f_i: number = 0;
    private o_i: number = 0;

    private msg_a: string[] = ["り", "っ", "ち", "ゃ", "ん", "★", "お", "め", "で", "と", "う", "★"];
    private msg_s: string[] = ["★", "☆"];

    private arg_i: number = 0;
    private arg_s: number = 12.0 * 10;
    private star_count: number = 6;
    private star_period: number = 20;
    private star_i: number = 0;

    private mamiri_count: number = 0;
    private mamiri_period2: number = 40;
    private mamiri_period3: number = 8;

    private screen_width: number = 300;
    private screen_height: number = 300;

    // マーライオンシーン２
    private mamiri_move_next2(context: CanvasRenderingContext2D): void {
        var r: number = this.mamiri_count / this.mamiri_period2;
        var r3: number = (this.mamiri_count % this.mamiri_period3) / this.mamiri_period3;
        var mamiri_width: number = 100;
        var mamiri_height: number = 100;
        var mamiri1_x: number = (this.screen_width - mamiri_width) * r;
        var mamiri2_x: number = (this.screen_width - mamiri_width) * (1 - r);
        var mamiri1_y: number = (this.screen_height - mamiri_height) - mamiri_height * (0.25 - (r3 - 0.5) * (r3 - 0.5)) * 4;
        var mamiri2_y: number = mamiri1_y;
        this.mamiri_count = (this.mamiri_count + 1) % this.mamiri_period2;
        context.drawImage(this.mamiriImage, mamiri1_x, mamiri1_y, mamiri_width, mamiri_height);
        context.drawImage(this.mamiriImage, mamiri2_x, mamiri1_y, mamiri_width, mamiri_height);
        context.drawImage(this.mamiriImage, mamiri1_x, mamiri2_y, mamiri_width, mamiri_height);
        context.drawImage(this.mamiriImage, mamiri2_x, mamiri2_y, mamiri_width, mamiri_height);
    }

    public show(): void {
        var mc: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("risa-canvas");
        var context: CanvasRenderingContext2D = mc.getContext("2d");
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.shadowBlur = 0;
        context.font = "40px sans-serif";

        context.clearRect(0, 0, 320, 320);

        this.happyBirthdayMerlion.show();
        this.happyBirthdayOkonomi.show();
        this.happyBirthdayMain.show();
    }
}

class CountDown2016 {
    public constructor() {
        this.risaImage.src = "image/okonomi.png";
        this.risaImage1.src = "image/okonomi1.png";
        this.risaImage2.src = "image/okonomi2.png";
        this.mamiriImage.src = "image/merlion.png";
    }

    private risaImage: HTMLImageElement = new Image();
    private risaImage1: HTMLImageElement = new Image();
    private risaImage2: HTMLImageElement = new Image();
    private mamiriImage: HTMLImageElement = new Image();

    //private dateOfBirth: Date = new Date(2015, 5, 12);
    private dateOfBirth: Date = new Date(2016, 5, 12);

    private countDownScene: CountDownScene = new CountDownScene(this.risaImage, this.risaImage1, this.risaImage2, this.mamiriImage, this.dateOfBirth);
    private happyBirthdayScene: HappyBirthdayScene = new HappyBirthdayScene(this.risaImage, this.mamiriImage);

    public go_next(setTimeout: (number) => void): void {
        if (new Date() > this.dateOfBirth) {
            this.happyBirthdayScene.show();
            setTimeout(40);
        } else {
            this.countDownScene.show();
            setTimeout(100);
        }
    }
}

class Timer {
    private loop_doing: boolean = false;
    private timer: Timer = this;

    public setTimeout(time: number): void {
        setTimeout(timer.go_next_loop, time);
    }

    private go_next(): void {
        countdown.go_next(this.setTimeout);
    }

    private go_next_loop(): void {
        if (timer.loop_doing) {
            timer.go_next();
        }
    }

    public start(): void {
        if (!this.loop_doing) {
            this.loop_doing = true;
            this.go_next_loop();
        }
    }

    public stop(): void {
        if (this.loop_doing) {
            this.loop_doing = false;
        }
    }
}

var countdown: CountDown2016 = new CountDown2016();
var timer: Timer = new Timer();

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
