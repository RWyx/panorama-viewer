# 本地 360 全景浏览器（零付费版）

这是一个纯静态网页项目，包含三层房间、每个场景 6 张 cubemap 图片。

## 一、Windows 直接运行（零成本）
- 你已可以直接在有浏览器的任意 Windows 机器上打开项目目录中的 `index.html`。
- 如果图片都在本地，双击 `index.html` 即可离线浏览（建议用 Chrome/Edge）。

## 二、离线“桌面化”最省成本（不花钱）
- 不打包、不签名，直接用浏览器 + 收藏到桌面即可。
- 不需要 Node、也不需要安装任何开发环境。

## 三、鸿蒙系统（华为）最省成本方案
- 先把项目发布为“本地可访问网页”（例如你本机的 http://localhost:8000 或局域网 IP）。
- 在鸿蒙浏览器中打开后选择“添加到桌面/创建快捷方式”。
- 这样能像应用一样启动（仍基于网页），不需要付费开发者账号。

## 四、推荐免费体验链路
1. 保持项目纯静态（当前结构）。
2. 用本地局域网共享：`python3 -m http.server 8000`。
3. 手机/平板访问 `http://<你的电脑IP>:8000`。

## 五、GitHub Pages 部署（当前已配置）

### 1）第一次先准备仓库
- 在 GitHub 新建仓库，比如 `panorama-viewer`
- 在本地执行一次推送（以 `main` 分支为例）：
```bash
git init
git add .
git commit -m "feat: init panorama viewer"
git branch -M main
git remote add origin git@github.com:你的用户名/panorama-viewer.git
git push -u origin main
```

### 2）开启 Pages（你这个项目已带自动流程）
- 仓库设置中打开 **Settings > Pages**
- Source 选 `GitHub Actions`
- 推送到 `main` 后，Actions 会自动部署

### 3）拿链接给家人
- 部署完成后会生成站点地址，比如：
`https://你的用户名.github.io/panorama-viewer/`

### 4）家人访问说明
- 这是一个静态页面，支持 360 拖拽查看
- 只要家人能访问这个 URL，即可直接打开查看
