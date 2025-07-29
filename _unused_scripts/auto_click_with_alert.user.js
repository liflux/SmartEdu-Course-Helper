// ==UserScript==
// @name         智慧职教自动点击与定时提醒 (v1.4)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动点击“确定”按钮，并在学习2小时后发出声音和弹窗提醒。
// @author       Gemini
// @match        https://core.teacher.vocational.smartedu.cn/p/course/vocational/*
// @match        https://*.smartedu.cn/p/course/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // --- 功能1：自动点击确认按钮 (每3秒检查一次) ---
    console.log('【自动学习脚本 v1.4】已启动，自动点击和2小时提醒功能已激活。');
    const clickIntervalId = setInterval(function() {
        const confirmButton = document.querySelector('.layui-layer-btn0');
        if (confirmButton && confirmButton.offsetParent !== null) {
            console.log('【自动学习脚本】检测到“确定”按钮，正在点击...');
            confirmButton.click();
            console.log('【自动学习脚本】点击完成！');
        }
    }, 3000);


    // --- 功能2：2小时后声音 + 弹窗提醒 ---
    const twoHoursInMillis = 2 * 60 * 60 * 1000; // 2小时的毫秒数
    console.log(`【自动学习脚本】已设置2小时提醒，将在 ${new Date(Date.now() + twoHoursInMillis).toLocaleTimeString()} 左右触发。`);

    setTimeout(function() {
        // 播放提示音的函数
        function playBeep() {
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.05); // 声音渐强

                oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5音，比较悦耳
                oscillator.type = 'sine';
                oscillator.start();

                // 1秒后停止声音
                gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 1);
                oscillator.stop(audioCtx.currentTime + 1);
                console.log('【自动学习脚本】提示音已播放。');
            } catch (e) {
                console.error('【自动学习脚本】无法播放提示音:', e);
            }
        }

        // 1. 播放声音
        playBeep();

        // 2. 弹出提示框
        alert('学习提醒：\n\n已经过去2个小时啦！\n请注意休息一下眼睛哦！');

    }, twoHoursInMillis);

})();