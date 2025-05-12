// OS識別用
let os;

// DOM構築完了イベントハンドラ登録
window.addEventListener("DOMContentLoaded", init);

let audioContext;

let start = document.getElementById("start");
start.addEventListener("click", function () {
    document.querySelector(".instruction").style.display = "none";
    startPlayingTone();
});
let soundPermit = document.getElementById("sound-permit");
soundPermit.addEventListener("click", function () {
    permitSound();
});

let Year = 1960;
let temp = 1;
let eho;
let condition = 0;
let intervalId = null; // 音を鳴らすためのインターバルID

/*
function playToneInterval() {
    if (condition != 0) {
        startPlayingTone(condition);
    } else {
        stopPlayingTone();
        playTone(getRandomInt(300,440), 5.0);
        playTone(getRandomInt(300,440), 5.0);
    }
    setTimeout(() => {
        playToneInterval()
    }, getRandomInt(4000, 5000));
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // 上限は除き、下限は含む
}
*/

// 初期化
function init() {

    // 簡易的なOS判定
    os = detectOSSimply();
    if (os == "iphone") {
        // safari用。DeviceOrientation APIの使用をユーザに許可して貰う
        document.querySelector("#permit").addEventListener("click", permitDeviceOrientationForSafari);

        window.addEventListener(
            "deviceorientation",
            orientation,
            true
        );
    } else if (os == "android") {
        window.addEventListener(
            "deviceorientationabsolute",
            orientation,
            true
        );
    } else {
        window.alert("このサイトは、スマートフォンでのみお楽しみいただけるサイトです。");
    }

    noScroll();
    createQuestion();
}
/*
function startPlayingTone(condition) {
    // すでにインターバルが設定されている場合は何もしない
    if (intervalId) return;

    if (condition == 1) {
        intervalId = setInterval(() => {
            playTone(getRandomInt(500,600), 5.0);
            playTone(getRandomInt(500, 600), 5.0);
            startPlayingTone(condition);
        }, getRandomInt(4000, 5000));
    } else if (condition == 2) {
        intervalId = setInterval(() => {
            playTone(getRandomInt(1000,1400), 5.0);
            playTone(getRandomInt(1000, 1400), 5.0);
            startPlayingTone(condition);
        }, getRandomInt(3000, 4000));
    } else if (condition == 3) {
        intervalId = setInterval(() => {
            playTone(getRandomInt(2600,3000), 5.0);
            playTone(getRandomInt(2600, 3000), 5.0);
            startPlayingTone(condition);
        }, getRandomInt(2000, 3000));
    } else {
        intervalId = setInterval(() => {
            playTone(getRandomInt(300,440), 5.0);
            playTone(getRandomInt(300,440), 5.0);
            startPlayingTone(condition);
        }, getRandomInt(4000, 5000));
    }
}

function stopPlayingTone() {
    // インターバルが設定されている場合はクリア
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null; // インターバルIDをリセット
    }
}
*/

let isPlaying = false; // 音再生の状態管理用フラグ

function startPlayingTone() {
    if (isPlaying) return;
    isPlaying = true;

    function playLoop() {
        if (!isPlaying) return;

        let freqRange;
        let delay;

        switch (condition) {
            case 1:
                freqRange = [500, 600];
                delay = getRandomInt(4000, 5000);
                break;
            case 2:
                freqRange = [1000, 1400];
                delay = getRandomInt(3000, 4000);
                break;
            case 3:
                freqRange = [2600, 3000];
                delay = getRandomInt(2000, 3000);
                break;
            default:
                freqRange = [300, 440];
                delay = getRandomInt(4000, 5000);
                break;
        }

        playTone(getRandomInt(...freqRange), 5.0);
        playTone(getRandomInt(...freqRange), 5.0);

        setTimeout(playLoop, delay); // 再帰的に次の音を鳴らす
    }

    playLoop();
}

function stopPlayingTone() {
    isPlaying = false;
}

// ジャイロスコープと地磁気をセンサーから取得
function orientation(event) {

    let alpha = event.alpha;
    let beta = event.beta; // 前後の傾き
    let gamma = event.gamma; // 左右の傾き
    let degrees;

    if(os == "iphone") {
        // webkitCompasssHeading値を採用
        degrees = event.webkitCompassHeading;

    }else{
        // deviceorientationabsoluteイベントのalphaを補正
        degrees = compassHeading(alpha, beta, gamma);
    }

    //恵方に近づいたら音を強くする
    if (temp == 4 || temp == 9) {
        if ((degrees < 15 && degrees >= 0) || (degrees < 360 && degrees >= 345) || (degrees >= 165 && degrees < 195)) {
            //近づいている
            condition = 1;
        }
        else if ((degrees < 45 && degrees >= 15) || (degrees >= 105 && degrees < 135)) {
            //まあまあ近づいてる
            condition = 2;
        }
        else if (degrees >= 45 && degrees < 105) {
            //とても近づいている
            condition = 3;
        } else {
            condition = 0;
        }
    }else if (temp == 1 || temp == 3 || temp == 6 || temp == 8) {
        if ((degrees < 105 && degrees >= 75) || (degrees >= 225 && degrees < 255)) {
            //近づいている
            condition = 1;
        }
        else if ((degrees < 135 && degrees >= 105) || (degrees >= 195 && degrees < 225)) {
            //まあまあ近づいてる
            condition = 2;
        }
        else if (degrees >= 135 && degrees < 195) {
            //とても近づいている
            condition = 3;
        } else {
            condition = 0;
        }
    }
    else if (temp == 0 || temp == 5) {
        if ((degrees < 195 && degrees >= 165) || (degrees >= 315 && degrees < 345)) {
            //近づいている
            condition = 1;
        }
        else if ((degrees < 225 && degrees >= 195) || (degrees >= 285 && degrees < 315)) {
            //まあまあ近づいてる
            condition = 2;
        }
        else if (degrees >= 225 && degrees < 285) {
            //とても近づいている
            condition = 3;
        } else {
            condition = 0;
        }
    }
    else if (temp == 2 || temp == 7) {
        if ((degrees < 285 && degrees >= 255) || (degrees >= 45 && degrees < 75)) {
            //近づいている
            condition = 1;
        }
        else if ((degrees < 315 && degrees >= 285) || (degrees >= 15 && degrees < 45)) {
            //まあまあ近づいてる
            condition = 2;
        }
        else if ((degrees >= 315 && degrees < 360) || (degrees >= 0 && degrees < 15)) {
            //とても近づいている
            condition = 3;
        } else {
            condition = 0;
        }
    }
    let conditionContainer = document.querySelector(".condition");
    conditionContainer.textContent = condition;
    if (degrees >= eho - 15 && degrees < eho + 15) {
        judgeAnswer();
    }
    //75, 165, 255, 345


    // 画面の回転
    let background = document.querySelector(".background");
    background.style.transform = `rotate(${-(degrees+45)}deg)`;
}

// 端末の傾き補正（Android用）
// https://www.w3.org/TR/orientation-event/
function compassHeading(alpha, beta, gamma) {
    var degtorad = Math.PI / 180; // Degree-to-Radian conversion

    var _x = beta ? beta * degtorad : 0; // beta value
    var _y = gamma ? gamma * degtorad : 0; // gamma value
    var _z = alpha ? alpha * degtorad : 0; // alpha value

    var cX = Math.cos(_x);
    var cY = Math.cos(_y);
    var cZ = Math.cos(_z);
    var sX = Math.sin(_x);
    var sY = Math.sin(_y);
    var sZ = Math.sin(_z);

    // Calculate Vx and Vy components
    var Vx = -cZ * sY - sZ * sX * cY;
    var Vy = -sZ * sY + cZ * sX * cY;

    // Calculate compass heading
    var compassHeading = Math.atan(Vx / Vy);

    // Convert compass heading to use whole unit circle
    if (Vy < 0) {
        compassHeading += Math.PI;
    } else if (Vx < 0) {
        compassHeading += 2 * Math.PI;
    }

    return compassHeading * (180 / Math.PI); // Compass Heading (in degrees)
}

// 簡易OS判定
function detectOSSimply() {
    let ret;
    if (
        navigator.userAgent.indexOf("iPhone") > 0 ||
        navigator.userAgent.indexOf("iPad") > 0 ||
        navigator.userAgent.indexOf("iPod") > 0
    ) {
        // iPad OS13のsafariはデフォルト「Macintosh」なので別途要対応
        ret = "iphone";
    } else if (navigator.userAgent.indexOf("Android") > 0) {
        ret = "android";
    } else {
        ret = "pc";
    }

    return ret;
}

// iPhone + Safariの場合はDeviceOrientation APIの使用許可をユーザに求める
function permitDeviceOrientationForSafari() {
    DeviceOrientationEvent.requestPermission()
        .then(response => {
            if (response === "granted") {
                window.addEventListener(
                    "deviceorientation",
                    orientation
                );
            }
        })
        .catch(console.error);
}

// スクロールを無効化する
function noScroll() {
    document.addEventListener("touchmove", preventScroll, { passive: false });
    document.addEventListener("wheel", preventScroll, { passive: false });
}

function preventScroll(event) {
    event.preventDefault();
}

//------問題生成関連------

//その年の恵方の判定
function createQuestion() {
    temp = Year % 10;
    if (temp == 4 || temp == 9) {
        eho = 75;
    }else if (temp == 1 || temp == 3 || temp == 6 || temp == 8) {
        eho = 165;
    }
    else if (temp == 0 || temp == 5) {
        eho = 255;
    }
    else if (temp == 2 || temp == 7) {
        eho = 345;
    }

    /*
    ⚪︎西暦の下一桁が「4、9」の年：甲（きのえ）の方角：東北東（よりやや東）
    ⚪︎西暦の下一桁が「0、5」の年：丙（ひのえ）の方角：南南東（よりやや南）
    ⚪︎西暦の下一桁が「2、7」の年：庚（かのえ）の方角：西南西（よりやや西）
    ⚪︎西暦の下一桁が「1、3、6、8」の年：壬（みずのえ）の方角：北北西（よりやや北）
    */
}

//------判定関連------

//恵方にたどり着いたらこの関数を呼ぶ
function judgeAnswer() {
    Year++;
    let yearContainer = document.querySelector(".year");
    yearContainer.textContent = Year;
    createQuestion();
}

//音の再生を許可
function permitSound() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    // iOS の場合、一時停止している場合は resume() を呼ぶ
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
    alert("音の再生を許可しました");
    playTone(440, 2.0); // A4の音を2秒鳴らす
}

// 音を再生する関数
function playTone(frequency, duration) {
    if (!audioContext) return; // AudioContext が初期化されていない場合は何もしない

    // AudioContext が "suspended" の場合は resume()
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine'; // サイン波
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime); // 周波数を設定

    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}