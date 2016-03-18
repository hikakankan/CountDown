var f_i = 0;
var o_i = 0;

var msg_a: string[] = ["り", "っ", "ち", "ゃ", "ん", "★", "お", "め", "で", "と", "う", "★"];
var msg_s: string[] = ["★", "☆"];

var arg_i = 0;
var arg_s = 12.0 * 10;
var star_count = 6;
var star_period = 20;
var star_i = 0;

var risaImage = new Image();
risaImage.src = "image/okonomi.png";
var risaImage1 = new Image();
risaImage1.src = "image/okonomi1.png";
var risaImage2 = new Image();
risaImage2.src = "image/okonomi2.png";
var risa_width_org = 200;
var risa_height_org = 200;
var risa_count = 0;
var risa_period_1 = 100;
var risa_period_2 = 20;
var risa_period = risa_period_1 + risa_period_2;

var mamiriImage = new Image();
mamiriImage.src = "image/merlion.png";
var mamiri_count = 0;
var mamiri_period = 20;
var mamiri_period2 = 40;
var mamiri_period3 = 8;

var screen_width = 300;
var screen_height = 300;

class rect {
    public constructor(public x: number, public y: number, public width: number, public height: number) {
    }
}

// お好み焼きシーン１ その１
function risa_move_next_1(r) {
    var start_center_x = screen_width / 2;
    var start_center_y = screen_height / 2;
    var start_width = 12;
    var start_height = 20;
    var end_center_x = screen_width / 2;
    var end_center_y = screen_height / 2;
    var end_width = risa_width_org;
    var end_height = risa_height_org / 2;
    var amplitude = 1;
    var frequency = 1;
    var risa_width = start_width * (1 - r) + end_width * r;
    var risa_height = start_height * (1 - r) + end_height * r;
    var risa_x = start_center_x * (1 - r) + end_center_x * r - risa_width / 2;
    var risa_y = start_center_y * (1 - r) + end_center_y * r - risa_height / 2 + risa_height * amplitude * Math.sin(Math.PI * 2 * r * frequency);
    return new rect(risa_x, risa_y, risa_width, risa_height);
}

// お好み焼きシーン１ その２
function risa_move_next_2(r) {
    var start_center_x = screen_width / 2;
    var start_center_y = screen_height / 2;
    var risa_width = risa_width_org;
    var risa_height = risa_height_org * (1 - r * 0.9);
    var risa_x = start_center_x - risa_width / 2;
    var risa_y = start_center_y - risa_height / 2;
    return new rect(risa_x, risa_y, risa_width, risa_height);
}

// シーン１
function okonomi_move(a, a2, rc, context, img) {
    var cx = rc.x + rc.width / 2
    var cy = rc.y + rc.height / 2
    var sx = screen_width / 2;
    var sy = screen_height / 2;
    var cx_new = sx + (cx - sx) * Math.cos(a) + (cy - sy) * Math.sin(a);
    var cy_new = sy - (cx - sx) * Math.sin(a) + (cy - sy) * Math.cos(a);
    var cx_new2 = cx_new * Math.cos(a2) + cy_new * Math.sin(a2);
    var cy_new2 = - cx_new * Math.sin(a2) + cy_new * Math.cos(a2);
    context.rotate(a2);
    context.drawImage(img, rc.x + cx_new2 - cx, rc.y + cy_new2 - cy, rc.width, rc.height);
    context.rotate(-a2);
}

function risa_move_next(context) {
    if (risa_count < risa_period_1) {
        var risa_rect = risa_move_next_1(risa_count / risa_period_1);
        var r = ((risa_count * 4) % risa_period_1) / risa_period_1;
        var a = Math.PI * 2 * r;
        var r2 = ((risa_count * 20) % risa_period_1) / risa_period_1;
        var a2 = Math.PI * 2 * r2;
        okonomi_move(a, a2, risa_rect, context, risaImage1);
        okonomi_move(a + Math.PI * 1 / 3, a2, risa_rect, context, risaImage2);
        okonomi_move(a + Math.PI * 2 / 3, a2, risa_rect, context, risaImage1);
        okonomi_move(a + Math.PI * 3 / 3, a2, risa_rect, context, risaImage2);
        okonomi_move(a + Math.PI * 4 / 3, a2, risa_rect, context, risaImage1);
        okonomi_move(a + Math.PI * 5 / 3, a2, risa_rect, context, risaImage2);
    } else {
        var risa_rect = risa_move_next_2((risa_count - risa_period_1) / risa_period_2);
        context.drawImage(risaImage, risa_rect.x, risa_rect.y, risa_rect.width, risa_rect.height);
    }
    risa_count = (risa_count + 1) % risa_period;
}

// マーライオンシーン１
function mamiri_move_next(context) {
    var r = mamiri_count / mamiri_period;
    var mamiri_width = 100;
    var mamiri_height = 100;
    var mamiri1_x = mamiri_width * (1 - r) / 2;
    var mamiri2_x = screen_width - mamiri_width + mamiri_width * (1 - r) / 2;
    var mamiri_y = screen_height - mamiri_height + mamiri_height * (1 - r) / 2;
    mamiri_count = (mamiri_count + 1) % mamiri_period;
    context.drawImage(mamiriImage, mamiri1_x, mamiri_y, mamiri_width * r, mamiri_height * r);
    context.drawImage(mamiriImage, mamiri2_x, mamiri_y, mamiri_width * r, mamiri_height * r);
}

// マーライオンシーン２
function mamiri_move_next2(context) {
    var r = mamiri_count / mamiri_period2;
    var r3 = (mamiri_count % mamiri_period3) / mamiri_period3;
    var mamiri_width = 100;
    var mamiri_height = 100;
    var mamiri1_x = (screen_width - mamiri_width) * r;
    var mamiri2_x = (screen_width - mamiri_width) * (1 - r);
    var mamiri1_y = (screen_height - mamiri_height) - mamiri_height * (0.25 - (r3 - 0.5) * (r3 - 0.5)) * 4;
    var mamiri2_y = mamiri1_y;
    mamiri_count = (mamiri_count + 1) % mamiri_period2;
    context.drawImage(mamiriImage, mamiri1_x, mamiri1_y, mamiri_width, mamiri_height);
    context.drawImage(mamiriImage, mamiri2_x, mamiri1_y, mamiri_width, mamiri_height);
    context.drawImage(mamiriImage, mamiri1_x, mamiri2_y, mamiri_width, mamiri_height);
    context.drawImage(mamiriImage, mamiri2_x, mamiri2_y, mamiri_width, mamiri_height);
}

// シーン２
function okonomi_move2(sx, sy, a1, a2, r1, r2, s, context, img) {
    var cx_new = sx + r1 * Math.cos(a1) + r1 * Math.sin(a1);
    var cy_new = sy - r1 * Math.sin(a1) + r1 * Math.cos(a1);
    var cx_new2 = cx_new + r2 * Math.cos(a2) + r2 * Math.sin(a2);
    var cy_new2 = cy_new - r2 * Math.sin(a2) + r2 * Math.cos(a2);
    context.drawImage(img, cx_new2 - s, cy_new2 - s, s * 2, s * 2);
    //context.drawImage(img, sx - s, sy - s, s * 2, s * 2);
}

function happy_birthday(context) {
    //context.drawImage(risaImage, (screen_width - risa_width_org) / 2, (screen_height - risa_height_org) / 2, risa_width_org, risa_height_org);

    var center_x = screen_width / 2;
    var center_y = screen_height / 2;

    var a = arg_i / arg_s;

    okonomi_move2(center_x, center_y, - a * Math.PI * 4, - a * Math.PI * 24, 100, 20, 25, context, risaImage);
    okonomi_move2(center_x, center_y, Math.PI * 2 * 1 / 5 - a * Math.PI * 4, - a * Math.PI * 24, 100, 20, 25, context, risaImage);
    okonomi_move2(center_x, center_y, Math.PI * 2 * 2 / 5 - a * Math.PI * 4, - a * Math.PI * 24, 100, 20, 25, context, risaImage);
    okonomi_move2(center_x, center_y, Math.PI * 2 * 3 / 5 - a * Math.PI * 4, - a * Math.PI * 24, 100, 20, 25, context, risaImage);
    okonomi_move2(center_x, center_y, Math.PI * 2 * 4 / 5 - a * Math.PI * 4, - a * Math.PI * 24, 100, 20, 25, context, risaImage);

    // りっちゃんおめでとうの表示
    context.fillStyle = "#ff6600";
    for (var i = 0; i < 12; i++) {
        var arg = Math.PI * 2 * (-a + i / 12.0);
        var x = Math.cos(arg) * 120 + center_x;
        var y = Math.sin(arg) * 120 + center_y;
        context.fillText(msg_a[i], x, y);
    }

    // 星の表示
    context.fillStyle = "#ffff00";
    var star_radius = 140;
    var r = star_i / star_period;
    var fs = 10 * (1 - r) + 50 * r;
    context.font = String(Math.floor(fs)) + "px sans-serif";
    for (var i = 0; i < 24; i++) {
        var arg = Math.PI * 2 * (a + i / 24.0);
        var x = Math.cos(arg) * star_radius * r + center_x;
        var y = Math.sin(arg) * star_radius * r + center_y;
        context.fillText(msg_s[(Math.floor(f_i / star_count) + i) % 2], x, y);
    }

    var n = 7.0;
    var z = (o_i / n) - 1.0;
    var g = 255 - Math.floor(z * z * 255);
    context.fillStyle = "rgb(255," + g + ",0)";
    context.fillText("24歳", center_x, 200);

    f_i = (f_i + 1) % (star_count * 2);
    o_i = (o_i + 1) % 12;
    arg_i = (arg_i + 1) % arg_s;
    star_i = (star_i + 1) % star_period;
}

function go_next() {
    //var dbir = new Date(2015, 5, 12);
    var dbir = new Date(2016, 5, 12);
    if (new Date() > dbir) {

        var mc = <HTMLCanvasElement>document.getElementById("risa-canvas");
        var context = mc.getContext("2d");
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.shadowBlur = 0;
        context.font = "40px sans-serif";

        context.clearRect(0, 0, 320, 320);

        mamiri_move_next2(context);

        happy_birthday(context);

        setTimeout(go_next_loop, 40);
    } else {
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

        var msg_mino = "りっちゃん24歳まで…";
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

        mamiri_move_next(context);

        risa_move_next(context);

        context.font = "30px sans-serif";
        context.fillText(msg_mino, x_center, 40);
        context.font = "40px sans-serif";
        context.fillText(msg_days, x_center, 160);
        context.fillText(msg_time, x_center, 200);

        setTimeout(go_next_loop, 100);
    }
}

var loop_doing = false;

function go_next_loop() {
    if (loop_doing) {
        go_next();
    }
}

function start_loop() {
    if (!loop_doing) {
        loop_doing = true;
        go_next_loop();
    }
}

function stop_loop() {
    if (loop_doing) {
        loop_doing = false;
    }
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
