// ==UserScript==
// @name         智慧职教-全自动学习脚本 (v2.1 终极启动版)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  通过持续唤醒机制，实现真正的全自动播放、计时、防暂停、点击确认和可靠声音提醒。
// @author       Felix
// @match        https://core.teacher.vocational.smartedu.cn/p/course/vocational/*
// @match        https://*.smartedu.cn/p/course/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // --- 用户配置 ---
    const REMINDER_HOURS = 1;
    const REMINDER_MINUTES = 5;

    // --- 脚本初始化 ---
    const reminderDelay = (REMINDER_HOURS * 60 + REMINDER_MINUTES) * 60 * 1000;
    const startTime = Date.now();
    let timerDisplayElement = null;
    let audioCtx = null;

    console.log(`【全自动学习脚本 v2.1】已启动。提醒时长: ${REMINDER_HOURS}小时${REMINDER_MINUTES}分钟。`);

    // --- 音频解锁模块 ---
    function unlockAudioContext() {
        if (audioCtx && audioCtx.state !== 'closed') return;
        console.log('【音频模块】正在尝试解锁音频权限...');
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createBufferSource();
        source.buffer = audioCtx.createBuffer(1, 1, 22050);
        source.connect(audioCtx.destination);
        source.start(0);
        setTimeout(() => {
            if (audioCtx.state === 'running') console.log('【音频模块】音频权限已成功激活！');
        }, 500);
    }

    // --- 【核心改进】持续唤醒的启动模块 ---
    function initialPlayAndUnlock() {
        console.log('【启动模块】正在尝试启动视频...');
        const startButton = document.querySelector('.xgplayer-start');
        if (startButton) startButton.click();

        let attempts = 0;
        const ensurePlayingInterval = setInterval(() => {
            attempts++;
            const videoElement = document.querySelector('video');

            if (videoElement && !videoElement.paused) {
                console.log('【启动模块】视频已成功播放！启动程序结束。');
                unlockAudioContext();
                clearInterval(ensurePlayingInterval);
            } else if (videoElement && videoElement.paused) {
                console.log(`【启动模块】检测到视频暂停，尝试强制播放 (第${attempts}次)...`);
                videoElement.play().catch(e => {});
            }

            if (attempts > 15) { // 15秒后放弃，避免无限循环
                clearInterval(ensurePlayingInterval);
                console.warn('【启动模块】15秒后仍无法自动播放视频，可能需要您手动点击一次。');
            }
        }, 1000);
    }

    setTimeout(initialPlayAndUnlock, 2000);

    // --- 创建屏幕计时器的函数 ---
    function createTimerDisplay() {
        const display = document.createElement('div');
        display.id = 'gemini-timer-display';
        Object.assign(display.style, {
            position: 'fixed', bottom: '15px', right: '15px', zIndex: '99999',
            backgroundColor: 'rgba(0, 0, 0, 0.65)', color: 'white', padding: '8px 12px',
            borderRadius: '8px', fontFamily: 'Arial, sans-serif', fontSize: '14px',
            lineHeight: '1.5', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        });
        document.body.appendChild(display);
        return display;
    }

    // --- 核心监控定时器 ---
    const monitoringIntervalId = setInterval(() => {
        const confirmButton = document.querySelector('.layui-layer-btn0');
        if (confirmButton && confirmButton.offsetParent !== null) {
            console.log('【点击模块】检测到“确定”按钮，正在点击...');
            confirmButton.click();
        }

        const videoElement = document.querySelector('video');
        if (videoElement && videoElement.paused) {
            videoElement.play().catch(e => {});
        }

        if (!timerDisplayElement) timerDisplayElement = createTimerDisplay();
        const elapsedTime = Date.now() - startTime;
        const remainingTime = reminderDelay - elapsedTime;
        const formatTime = (ms) => {
            if (ms < 0) ms = 0;
            const s = Math.floor(ms / 1000);
            return `${Math.floor(s/3600).toString().padStart(2,'0')}:${Math.floor(s%3600/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
        };
        timerDisplayElement.innerHTML = `已运行: <b>${formatTime(elapsedTime)}</b><br>剩余: <b>${formatTime(remainingTime)}</b>`;
    }, 3000);

    // --- 强力提醒功能 ---
    setTimeout(function() {
        clearInterval(monitoringIntervalId);
        if (timerDisplayElement) timerDisplayElement.innerHTML = "<b>提醒时间到！</b>";

        let beepIntervalId = null;
        function playBeep() {
            if (!audioCtx || audioCtx.state === 'closed') {
                 console.error('【提醒模块】音频实例丢失，无法播放声音！');
                 clearInterval(beepIntervalId);
                 return;
            }
            const oscillator = audioCtx.createOscillator();
            oscillator.connect(audioCtx.destination);
            oscillator.frequency.value = 600;
            oscillator.type = 'sine';
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.5);
        }
        
        beepIntervalId = setInterval(playBeep, 2000);
        console.log('【提醒模块】时间到，已开始播放持续提示音...');
        alert(`学习提醒：\n\n已经过去 ${REMINDER_HOURS}小时${REMINDER_MINUTES}分钟 啦！\n请注意休息一下眼睛哦！\n\n【点击“确定”按钮即可停止提示音】`);
        clearInterval(beepIntervalId);
        if(audioCtx) audioCtx.close();
        console.log('【提醒模块】用户已确认提醒，脚本所有任务已结束。');
        if (timerDisplayElement) timerDisplayElement.style.display = 'none';

    }, reminderDelay);

})();