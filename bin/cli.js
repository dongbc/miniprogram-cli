#!/usr/bin/env node

const program = require('commander')
const download = require('download-git-repo')
const inrequirer = require('inquirer')
const fs = require('fs')
const handlebars = require('handlebars')
const ora = require('ora')
const chalk = require('chalk')
const symbols = require('log-symbols')

program.version('1.0.0', '-v, --version')
  .command('init <name>')
  .action(name => {
    if(!fs.existsSync(name)){
      inrequier.prompt([
        {
          type: 'input',
          name: 'description',
          message: '请输入项目描述'
        },
        {
          type: 'input',
          name: 'author',
          message: '请输入项目作者'
        },
        {
          type: 'input',
          name: 'repository',
          message: '请输入项目仓库'
        }
      ])
        .then(answers => {
          const spinner = ora('正在下载模板...')
          spinner.start()
          download('https://', name, { clone: true }, err => {
            if (err) {
              spinner.fail();
              console.log(symbols.error, chalk.red(err));
            }else {
              spinner.succeed();
              const fileName = `${name}/package.json`
              const meta = {
                name,
                description: answers.description,
                author: answers.author,
                repository: answers.repository,
              }
              if (fs.existsSync(fileName)) {
                const content = fs.readFileSync(fileName).toString();
                const result = handlebars.compile(content)(meta);
                fs.writeFileSync(fileName, result);
              }
            }
            console.log(symbols.success, chalk.green('项目初始化完成'));
          })
        })
    }else{
      // 错误提示项目已存在，避免覆盖原有项目
      console.log(symbols.error, chalk.red('项目已存在'));
    }
    
  })

program.parse(process.argv)