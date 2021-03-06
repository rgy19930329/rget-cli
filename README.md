# rget-cli

cli for rget

## Version

```shell
$ node -v # v8.9.3 up

$ npm -v # 5.6.0 up

```

## Installation

Using npm:

```shell
$ npm install -g rget-cli
```

## Usage

用法1：

```shell
## 新建项目目录

$ mkdir demo && cd demo

## 在空项目目录下执行初始化

$ rget init 

## 指定仓库初始化 (注：仓库格式务必按照下面的要求；域名后用":"；分支使用"#"隔开)

$ rget init -r https://github.com:rgy19930329/kyvue-start#template
```

用法2：

```shell
require('rget-cli')('https://github.com:rgy19930329/ky-react-template#master', {
    replaceFiles: ['package.json', 'README.md', 'ua.json', 'template.html'],
    success: (res) => console.log(res),
    error: (err) => console.log(err)
});
```

## Template Explain

```
## 项目名称
{{projectName}}

## 项目版本号
{{projectVersion}}

## 项目简介
{{projectDescription}}

## 项目作者
{{author}}
```
