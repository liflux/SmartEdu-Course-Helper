### **假期教师研修全自动学习脚本使用指南**

#### **1. 方案简介**

本方案由两个独立的、功能专注的油猴脚本构成。您可以根据自己的需求，选择安装一个或两个，以实现最佳的自动化学习体验。

*   **主脚本 (推荐必装)**: `auto_learning_final.user.js`
    *   **功能**: 负责核心的挂机任务，包括**自动点击确认**、**防意外暂停**、**屏幕计时**和**无声弹窗提醒**。这是确保长时间稳定挂机的基石。

*   **倍速脚本 (可选安装)**: `simulate_click_2x_speed.user.js`
    *   **功能**: 专门负责将视频**播放速度设置为2倍**。它通过模拟用户点击播放器上的“2x”按钮来实现，非常高效。

#### **2. 文件位置**

*   **主脚本**: 位于项目主目录中，名为 `auto_learning_final.user.js`。
*   **倍速脚本**: **同样位于项目主目录中**，名为 `simulate_click_2x_speed.user.js`。

#### **3. 安装与使用**

**第一步：安装 Tampermonkey  扩展** (如果已安装请跳过)

*   **Chrome / Edge**: [点击安装](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
*   **Firefox**: [点击安装](https://addons.mozilla.org/firefox/addon/tampermonkey/)

**第二步：安装脚本**

1.  打开 Tampermonkey 的“**管理面板**”。
2.  将主目录下的 `auto_learning_final.user.js` 和 `simulate_click_2x_speed.user.js` 文件**依次拖拽**到管理面板窗口中，并分别点击“**安装**”。

**第三步：开始使用**

1.  打开您的在线学习课程页面。
2.  **手动点击播放第一个视频**。
3.  **确认脚本已运行**：
    *   查看浏览器右上角的 Tampermonkey 图标。如果您只安装了主脚本，它会显示红色数字 `1`；如果两个都安装了，会显示 `2`。
    *   主脚本的屏幕计时器会出现在页面右下角。
    *   倍速脚本会自动将播放器速度设置为 `2x`。

#### **4. 常见问题 (FAQ)**

*   **问：倍速播放有风险吗？**
    *   **答：** **有风险！** 学习平台服务器可能会检测学习时长。例如，用2倍速看完10分钟视频，服务器记录时长可能只有5分钟，这有可能会导致**学时无效**。请自行权衡风险。

*   **问：脚本不工作怎么办？**
    *   **答：** 请按顺序检查：① Tampermonkey 图标上是否有红色数字？ ② 脚本开关是否已在管理面板中打开？ ③ 是否已按 `Ctrl + F5` 强制刷新页面？

---