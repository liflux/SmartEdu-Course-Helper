// ==UserScript==
// @name         智慧职教-自动点击与强力定时提醒 (v1.5)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动点击“确定”按钮，并在学习1小时5分钟后，发出持续的声音和弹窗提醒，直到用户介入。
// @author       Felix
// @match        https://core.teacher.vocational.smartedu.cn/p/course/vocational/*
// @match        https://*.smartedu.cn/p/course/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // --- 功能1：自动点击确认按钮 (每3秒检查一次) ---
    console.log('【自动学习脚本 v1.5】已启动，自动点击和1小时5分钟强力提醒功能已激活。');
    const clickIntervalId = setInterval(function() {
        const confirmButton = document.querySelector('.layui-layer-btn0');
        if (confirmButton && confirmButton.offsetParent !== null) {
            console.log('【自动学习脚本】检测到“确定”按钮，正在点击...');
            confirmButton.click();
            console.log('【自动学习脚本】点击完成！');
        }
    }, 3000);


    // --- 功能2：1小时5分钟后，持续声音 + 弹窗提醒 ---
    const reminderDelay = (1 * 60 + 5) * 60 * 1000; // 2小时5分钟的毫秒数
    const reminderTime = new Date(Date.now() + reminderDelay).toLocaleTimeString();
    console.log(`【自动学习脚本】已设置强力提醒，将在 ${reminderTime} 左右触发。`);

    setTimeout(function() {
        let beepIntervalId = null;

        // 播放提示音的函数
        function playBeep() {
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                gainNode.gain.value = 0.3; // 设置一个合适的音量
                oscillator.frequency.value = 600; // 设置一个清晰的频率
                oscillator.type = 'sine';
                oscillator.start();
                setTimeout(() => oscillator.stop(), 500); // 响0.5秒
            } catch (e) {
                console.error('【自动学习脚本】无法播放提示音:', e);
                // 如果音频播放失败，则停止循环，避免空耗资源
                if(beepIntervalId) clearInterval(beepIntervalId);
            }
        }

        // 开始每隔2秒循环播放一次提示音
        beepIntervalId = setInterval(playBeep, 2000);
        console.log('【自动学习脚本】提醒时间到，已开始播放持续提示音...');

        // 弹出一个阻塞式提示框。代码会在这里暂停，直到用户点击“确定”
        alert('学习提醒：\n\n已经过去 1小时5分钟 啦！\n请注意休息一下眼睛哦！\n\n【点击“确定”按钮即可停止提示音】');

        // 用户点击“确定”后，代码才会继续执行到这里
        clearInterval(beepIntervalId); // 停止循环播放提示音
        console.log('【自动学习脚本】用户已确认提醒，提示音已停止。');

    }, reminderDelay);

})();
