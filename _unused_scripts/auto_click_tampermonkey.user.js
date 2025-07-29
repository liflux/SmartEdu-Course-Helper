// ==UserScript==
// @name         智慧职教自动点击确认 (v1.2 兼容版)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在视频播放结束后，自动点击“您已学完本资源内容”弹窗的“确定”按钮。增强了网址匹配规则。
// @author       Gemini
// @match        https://core.teacher.vocational.smartedu.cn/p/course/vocational/*
// @match        https://*.smartedu.cn/p/course/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    console.log('【自动学习脚本 v1.2】已启动，每3秒检查一次“确定”按钮...');

    const intervalId = setInterval(function() {
        // 查找“确定”按钮，它的特征是 <a class="layui-layer-btn0">
        const confirmButton = document.querySelector('.layui-layer-btn0');

        // 检查按钮是否存在，并且它所在的弹窗是可见的 (offsetParent不为null)
        if (confirmButton && confirmButton.offsetParent !== null) {
            console.log('【自动学习脚本】检测到“确定”按钮，正在点击...');
            confirmButton.click();
            console.log('【自动学习脚本】点击完成！');
        }
    }, 3000); // 每3秒检查一次

})();
