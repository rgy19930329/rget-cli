# rget-cli
cli for rget

## Version
```shell
node -v
#v8.9.3 up
npm -v
#5.6.0 up
```

## Installation

Using npm:

```shell
npm install -g rget-cli

## 初始化
rget init <project name>

## 指定仓库初始化 (注：仓库格式务必按照下面的要求；域名后用":"；分支使用"#"隔开)
rget init <project name> -r https://github.com:rgy19930329/kyvue-start#template
```

## Template explain

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
