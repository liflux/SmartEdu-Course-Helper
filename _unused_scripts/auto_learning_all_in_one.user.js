// ==UserScript==
// @name         智慧职教-全自动学习脚本 (v1.7 UI同步版)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  集自动点击、2.5倍速播放（UI同步显示）、2小时5分钟强力提醒于一体。
// @author       Felix
// @match        https://core.teacher.vocational.smartedu.cn/p/course/vocational/*
// @match        https://*.smartedu.cn/p/course/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // --- 用户配置 ---
    const DESIRED_PLAYBACK_SPEED = 2.5; // 在这里修改你想要的播放速度

    console.log(`【全自动学习脚本 v1.7】已启动。目标速度: ${DESIRED_PLAYBACK_SPEED}x，UI同步已激活。`);

    // --- 功能1：倍速播放与UI同步 (每秒检查并设置一次) ---
    const speedIntervalId = setInterval(function() {
        const videoElement = document.querySelector('video');
        const speedDisplayElement = document.querySelector('.xgplayer-playbackrate .name'); // 定位速度显示的 <p> 元素

        // 1. 设置视频播放速度
        if (videoElement && videoElement.playbackRate !== DESIRED_PLAYBACK_SPEED) {
            videoElement.playbackRate = DESIRED_PLAYBACK_SPEED;
            console.log(`【倍速模块】已将视频播放速度设置为: ${DESIRED_PLAYBACK_SPEED}x`);
        }

        // 2. 【新功能】同步更新UI界面上的速度显示
        const speedText = `${DESIRED_PLAYBACK_SPEED}x`;
        if (speedDisplayElement && speedDisplayElement.textContent !== speedText) {
            speedDisplayElement.textContent = speedText;
            console.log(`【UI同步模块】已将界面速度显示更新为: ${speedText}`);
        }
    }, 1000);


    // --- 功能2：自动点击确认按钮 (每3秒检查一次) ---
    const clickIntervalId = setInterval(function() {
        const confirmButton = document.querySelector('.layui-layer-btn0');
        if (confirmButton && confirmButton.offsetParent !== null) {
            console.log('【点击模块】检测到“确定”按钮，正在点击...');
            confirmButton.click();
            console.log('【点击模块】点击完成！');
        }
    }, 3000);


    // --- 功能3：2小时5分钟后，持续声音 + 弹窗提醒 ---
    const reminderDelay = (2 * 60 + 5) * 60 * 1000;
    const reminderTime = new Date(Date.now() + reminderDelay).toLocaleTimeString();
    console.log(`【提醒模块】已设置强力提醒，将在 ${reminderTime} 左右触发。`);

    setTimeout(function() {
        let beepIntervalId = null;
        function playBeep() {
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                gainNode.gain.value = 0.3;
                oscillator.frequency.value = 600;
                oscillator.type = 'sine';
                oscillator.start();
                setTimeout(() => oscillator.stop(), 500);
            } catch (e) {
                console.error('【提醒模块】无法播放提示音:', e);
                if(beepIntervalId) clearInterval(beepIntervalId);
            }
        }
        beepIntervalId = setInterval(playBeep, 2000);
        console.log('【提醒模块】时间到，已开始播放持续提示音...');
        alert('学习提醒：\n\n已经过去 2小时5分钟 啦！\n请注意休息一下眼睛哦！\n\n【点击“确定”按钮即可停止提示音】');
        clearInterval(beepIntervalId);
        console.log('【提醒模块】用户已确认提醒，提示音已停止。');
    }, reminderDelay);

})();