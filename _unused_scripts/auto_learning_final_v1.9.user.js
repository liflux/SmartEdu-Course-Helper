// ==UserScript==
// @name         智慧职教-全自动学习脚本 (v1.9 最终版)
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  集自动播放、屏幕计时、防暂停、自动点击、可靠声音提醒于一体的终极解决方案。
// @author       Gemini
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

    console.log(`【全自动学习脚本 v1.9】已启动。提醒时长: ${REMINDER_HOURS}小时${REMINDER_MINUTES}分钟。`);

    // --- 新功能：页面加载2秒后，尝试自动播放 ---
    setTimeout(() => {
        const startButton = document.querySelector('.xgplayer-start');
        if (startButton) {
            console.log('【自动播放模块】检测到初始播放按钮，正在点击...');
            startButton.click();
        }
    }, 2000); // 延迟2秒执行，等待播放器加载

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

    // --- 核心功能：一个定时器处理所有周期性任务 ---
    const monitoringIntervalId = setInterval(() => {
        // 自动点击“确定”
        const confirmButton = document.querySelector('.layui-layer-btn0');
        if (confirmButton && confirmButton.offsetParent !== null) {
            console.log('【点击模块】检测到“确定”按钮，正在点击...');
            confirmButton.click();
        }

        // 保持播放状态
        const videoElement = document.querySelector('video');
        if (videoElement && videoElement.paused) {
            videoElement.play();
            console.log('【播放模块】检测到视频暂停，已强制恢复播放。');
        }

        // 更新屏幕计时器
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
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                oscillator.connect(audioCtx.destination);
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
        alert(`学习提醒：\n\n已经过去 ${REMINDER_HOURS}小时${REMINDER_MINUTES}分钟 啦！\n请注意休息一下眼睛哦！\n\n【点击“确定”按钮即可停止提示音】`);
        clearInterval(beepIntervalId);
        console.log('【提醒模块】用户已确认提醒，脚本所有任务已结束。');
        if (timerDisplayElement) timerDisplayElement.style.display = 'none';

    }, reminderDelay);

})();