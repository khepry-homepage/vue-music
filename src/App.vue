<template>
  <div id="app">
    <Header />
    <Main />
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Main from '@/components/Main'
export default {
  name: 'App',
  components: {
    Header,
    Main,
    Footer
  },
}
</script>

<style>
html{
  height:100%;
  margin: 0;
}
body {
  height:100%;
  margin-top: 0;
  margin-bottom: 0;
  margin-right: 1px;
  margin-left: 1px;
}
/* 浏览器窗口缩放时重新计算html字体标准大小 */
@media screen {
  /* 设计稿大小: 1280 * 1120 */
  html {
    font-size: 1.25vw;
    min-width: 620px;
    min-height: 600px;
  }
}
p {
  display: block;
  -webkit-margin-before: 0rem;
  -webkit-margin-after: 0rem;
  -webkit-margin-start: 0px;
  -webkit-margin-end: 0px;
}


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}
#app > div:nth-child(even) {
  width: 100%;
  height: 0;
  flex: 1 0;
}
#app > div:nth-child(odd) {
  width: 100%;
  height: 5em;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

/* 隐藏element横向滚动条 */
.el-scrollbar__wrap {
  overflow-x: hidden!important;
}

.el-table .odd-row {
  background-color: rgb(250, 250, 250);
}
/* 标签统一样式 */
.select-tag {
  padding: 0.2rem 0.5rem 0.2rem 0.5rem;
  font-size: 1rem;
  border-radius: 1rem;
}
.activate-tag {
  background-color: rgb(246, 204, 189) !important;
  color: red !important;  
}

.cursor {
  cursor : pointer;
}
.font-size-title {
  font-size: 1.5rem;
}
.font-size-nav {
  font-size: 1.5rem;
}
.font-size-08 {
  font-size: 0.8rem;
}
.addition-font {
  color: rgb(160, 159, 159);
}
.info-font {
  color: rgb(73, 73, 73);
}
.info-font:hover {
  color: black;
}
.red-font {
  color: red;
}
.blue-font {
  color: rgb(85, 85, 241);
}
.white-font {
  color: white;
  font-weight: bold;
}
.black-weight {
  color: black;
  font-weight: bold;
}
/* 文本同行溢出用省略号替换 */
.overflow-replace-ellipsis {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* 文本水平居中 */
.font-horCenter {
  text-align: center;
}
/* 左对齐间距1rem */
.flush-left {
  margin-left: 1rem;
}
.el-scrollbar__view {
  margin-right: 0.5rem;
}
.el-scrollbar {
  height: 100%;
}
.el-scrollbar__wrap {
  overflow-y: scroll;
  overflow-x: hidden;
}
.gray-hover:hover {
  background: rgb(243, 241, 241)!important;
}
.current-row {
  background: rgb(209, 209, 209)!important;
}
.list-row {
  font-size: 0.8rem;
  height: 2rem;
  display: flex;
  align-items: center;
}
.flex-col-vertical-center {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; 
}
.flex-row-center {
  display: flex;
  justify-content: center; /* 主轴居中 */
  align-items: center; /* 侧轴居中 */
}
.flex-row-vertical-center {
  width: 100%;
  display: flex;
  align-items: center;
}
/* 固定盒子左右外间距 */
.box-margin-LR {
  margin-left: 1rem !important;
  margin-right: 1rem !important;
}
.margin-2 {
  margin-left: 2rem;
}
.common-button {
  display: inline-flex;
  justify-content:center;
  align-items:center;
  border:1px solid rgb(224, 224, 224);
  border-radius:0.5rem;
  height:2rem;
  background: none;
}
.common-button:hover {
  background-color: rgb(243, 241, 241);
}
</style>
