// ==UserScript==
// @name         智慧职教-自动学习脚本 (v2.2 持续运行版)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  后台持续运行，自动点击、防暂停、屏幕计时，并在1小时5分钟后弹窗提醒（无声音）。
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
    let reminderFired = false; // 确保提醒只触发一次

    console.log(`【自动学习脚本 v2.2】已启动。提醒时长: ${REMINDER_HOURS}小时${REMINDER_MINUTES}分钟。脚本将在提醒后持续运行。`);

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
        // 功能1: 自动点击“确定”按钮
        const confirmButton = document.querySelector('.layui-layer-btn0');
        if (confirmButton && confirmButton.offsetParent !== null) {
            console.log('【点击模块】检测到“确定”按钮，正在点击...');
            confirmButton.click();
        }

        // 功能2: 保持播放状态 (用户需手动开始第一次播放)
        const videoElement = document.querySelector('video');
        if (videoElement && videoElement.paused && videoElement.currentTime > 0) { // 仅在视频已开始播放后才强制恢复
            videoElement.play();
            console.log('【播放模块】检测到视频暂停，已强制恢复播放。');
        }

        // 功能3: 更新屏幕上的计时器
        if (!timerDisplayElement) {
            timerDisplayElement = createTimerDisplay();
        }
        const elapsedTime = Date.now() - startTime;
        const remainingTime = reminderDelay - elapsedTime;
        const formatTime = (ms) => {
            if (ms < 0) ms = 0;
            const totalSeconds = Math.floor(ms / 1000);
            const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
            const s = (totalSeconds % 60).toString().padStart(2, '0');
            return `${h}:${m}:${s}`;
        };
        
        if (elapsedTime < reminderDelay) {
            timerDisplayElement.innerHTML = `已运行: <b>${formatTime(elapsedTime)}</b><br>剩余: <b>${formatTime(remainingTime)}</b>`;
        } else {
            timerDisplayElement.innerHTML = `已运行: <b>${formatTime(elapsedTime)}</b><br><b style="color:#ffc107;">提醒时间已过</b>`;
        }

        // 功能4: 到达预定时间后，弹窗提醒 (只提醒一次)
        if (elapsedTime >= reminderDelay && !reminderFired) {
            reminderFired = true; // 标记提醒已触发
            alert(`学习提醒：\n\n已经过去 ${REMINDER_HOURS}小时${REMINDER_MINUTES}分钟 啦！\n请注意休息一下眼睛哦！\n\n【脚本将继续在后台为您服务】`);
            console.log('【提醒模块】用户已确认提醒，脚本将继续运行。');
        }

    }, 3000); // 每3秒检查一次状态

})();