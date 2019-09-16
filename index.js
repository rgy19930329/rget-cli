#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const os = require('os')
const download = require('./lib/download')
const generator = require('./lib/generator')

// 命令行交互工具
const program = require('commander')
// Match files using the patterns the shell uses, like stars and stuff.
const glob = require('glob')

// 终端交互工具
const inquirer = require('inquirer')

// Terminal string styling done right
const chalk = require('chalk')
// Colored symbols for various log levels
const logSymbols = require('log-symbols')

const init = (repository = 'https://github.com:rgy19930329/kyvue-start#template', {
  success, // 成功回调
  error, // 失败回调
}) => {
  program.usage('<project-name>')
    .option('-r, --repository [repository]', 'assign to repository', repository)
    .parse(process.argv);

  const list = glob.sync('*') // 遍历当前目录
  const projectName = path.basename(process.cwd()) // 获取执行当前命令的文件夹名称字符串

  let next = undefined
  if (list.length) { // 如果当前目录不为空
    if (list.filter(name => {
        const fileName = path.resolve(process.cwd(), path.join('.', name))
        const isDir = fs.statSync(fileName).isDirectory()
        return name.indexOf(projectName) !== -1 && isDir
      }).length !== 0) {
      console.log(`项目${projectName}已经存在`)
      return
    }
  }

  next = Promise.resolve(projectName)

  const config = require('./package.json')
  const latestVersion = require('latest-version')
  const versionCompare = require('./lib/versionCompare')
  const Ora = require('ora')
  const exec = require('child_process').exec

  const spinner = new Ora({
    text: 'Checking cli version'
  });

  const spinner2 = new Ora({
    text: 'Updating cli version'
  });

  spinner.start()

  console.log('\ncli current version: ' + config.version)

  latestVersion('rget-cli').then(version => {
    console.log('\ncli latest version: ' + version)
    // 
    spinner.frames = ['-', '+', '-']
    spinner.color = 'yellow'
    spinner.text = 'Checked cli version done'
    spinner.succeed()
    // 比较当前版本与最新版本
    var ret = versionCompare(config.version, version)
    if (ret === -1) { // 当前版本比最新版本小，则更新
      spinner2.start()
      exec('npm install rget-cli@latest -g --verbose', (err, stdout, stderr) => {
        if (err) {
          console.log('rget-cli silent install fail! please exec "npm install rget-cli -g --verbose" yourself')
          spinner2.fail()
        } else {
          console.log(stdout)
          //
          spinner2.frames = ['-', '+', '-']
          spinner2.color = 'yellow'
          spinner2.text = 'Updated cli version done'
          spinner2.succeed()
          //
          next && go()
        }
      })
    } else {
      next && go()
    }
  }).catch(err => {
    console.error('error: ' + err)
  })

  function go() {
    next.then(projectRoot => {
      return download('.', program.repository).then(target => {
        return {
          name: projectRoot,
          root: projectRoot,
          target: target
        }
      })
    }).then(context => {
      var hostname = os.hostname()
      return inquirer.prompt([{
        name: 'projectName',
        message: '项目的名称',
        default: context.name
      }, {
        name: 'projectVersion',
        message: '项目的版本号',
        default: '1.0.0'
      }, {
        name: 'projectDescription',
        message: '项目的简介',
        default: `A project named ${context.name}`
      }, {
        name: 'author',
        message: '项目的作者',
        default: hostname || ''
      }]).then(answers => {
        return {
          ...context,
          metadata: {
            ...answers
          }
        }
      })
    }).then(context => {
      // 添加生成的逻辑
      return generator(
        context.metadata,
        context.target,
        ['package.json', 'README.md', 'ua.json', 'template.html'],
        // path.parse(context.target).dir
      )
    }).then((res) => {
      // 成功用绿色显示，给出积极的反馈
      console.log(logSymbols.success, chalk.green('项目创建成功 ^_^'))
      console.log(chalk.green(`请执行 npm install 安装依赖`))
      success && success(res)
    }).catch(err => {
      // 失败了用红色，增强提示
      console.error(logSymbols.error, chalk.red(`创建失败：${err.message}`))
      error && error(err)
    })
  }
}

module.exports = init;