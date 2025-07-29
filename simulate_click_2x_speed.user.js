// ==UserScript==
// @name         智慧职教-模拟点击2x倍速 (示例脚本)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  通过模拟点击播放器UI按钮的方式实现2倍速播放。
// @author       Gemini
// @match        https://core.teacher.vocational.smartedu.cn/p/course/vocational/*
// @match        https://*.smartedu.cn/p/course/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    console.log('【模拟点击脚本】已启动，将尝试点击2x倍速按钮。');

    const clickSpeedButton = setInterval(function() {
        // 1. 找到显示当前速度的那个 <p> 元素
        const currentSpeedDisplay = document.querySelector('.xgplayer-playbackrate .name');
        
        // 2. 找到速度选项列表中代表 "2x" 的那个 <li> 元素
        const targetSpeedOption = document.querySelector('.xgplayer-playbackrate li[cname="2"]');

        // 3. 如果找到了这两个元素，并且当前显示的速度不是 "2x"
        if (currentSpeedDisplay && targetSpeedOption && !currentSpeedDisplay.textContent.includes('2x')) {
            
            // 4. 检查 "2x" 选项是否已经被选中 (是否有 'selected' class)
            //    如果没有被选中，才执行点击操作，避免不必要的重复点击
            if (!targetSpeedOption.classList.contains('selected')) {
                console.log('【模拟点击脚本】当前速度不是2x，正在执行点击操作...');
                
                // 关键操作：直接点击那个 "2x" 的列表项
                // XGPlayer的设计是，直接点击选项即可，无需先展开菜单
                targetSpeedOption.click();
                
                console.log('【模拟点击脚本】已成功点击 "2x" 按钮。');
            }
        }
    }, 2000); // 每2秒检查一次

})();
