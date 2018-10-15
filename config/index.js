/**
 * @module 调用npm命令的主要逻辑模块
 * @param {String} g 生成一个package.json缓存文件
 * @param {String} rm 删除已有的package.json缓存文件
 * @param {String} d 将缓存文件覆盖源package.json
 * @param {String} h 查看命令参数帮助
 */
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')


const ROOTPATH = process.cwd()
const config = require('./lib.config')
const sourcePath = path.join(ROOTPATH, 'package.json')
const copyPath = path.join(__dirname, 'temporary.json')

const CommandParam = process.argv[2]

// 显示帮助log
const showHelper = () => {
    console.log(chalk`
    {blue Usage:} 

        {green g}  {yellow generate the temporary.json, if there is already one it will be overlapped}
        {green rm}  {yellow remove the temporary.json}
        {green d}  {yellow apply the temporary.json to root path}
        {green h}  {yellow show the config command help} 
    `)
}

// 读取源package.json，然后修改，写入新的json到一个缓存文件
const modifyAndWriteJSON = () => {
    const version = config.version || '0.0.1'
    const keywords = config.keywords || []
    const author = config.author || 'Alan Chen'
    
    fs.readFile(sourcePath, 'utf8', (err, data) => {
        if(err) {
            // console.log(chalk.red(err))
            console.log(chalk`{yellow package.json源文件读取失败}`)
        }
        let copyPackageJson = JSON.parse(data)
    
        copyPackageJson.name = config.libraryName
        copyPackageJson.version = version
        copyPackageJson.description = config.description
        copyPackageJson.main = `dist/${config.bundleName}.js`
        copyPackageJson.keywords = keywords
        copyPackageJson.author = author
        copyPackageJson.repository = config.repository
        copyPackageJson.homepage = config.repository.url
        
        const newJson = JSON.stringify(copyPackageJson, null, 2) //格式化输出json文件
        
        fs.writeFile(copyPath, newJson, err => {
            if(err) {
                // console.log(chalk.red(err))
                console.log(chalk`{yellow package.json缓存文件写入失败}`)
            }
            else {
                console.log(chalk.green(`package.json缓存文件写入成功！`))
            }
        })
    })
}

// 调用unlink删除文件和remae改变路径之前必须先用access检测文件是否存在
const checkJSONExist = path => {
    return new Promise((resolve, reject) => {
        fs.access(path, fs.constants.F_OK, err => {
            if(err) {
                // console.log(chalk.red(err))
                console.log(chalk`{yellow 没有发现package.json缓存文件,请先yarn/npm run config g 生成缓存文件}`)
            }
            else {
                resolve()
            }
        })
    })
}

// 删除缓存文件
const removeJSON = () => {
    checkJSONExist(copyPath)
        .then(() => {
            fs.unlink(copyPath, err => {
                if(err) {
                    // console.log(chalk.red(err))
                    console.log(chalk`{yellow package.json缓存文件删除失败}`)
                }
                else {
                    console.log(chalk`{green package.json缓存文件删除成功！}`)
                }
            })
        })
}

// 覆盖源package.json
const deposit = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'deposit',
        message: chalk.green('此操作将会用缓存文件覆盖根目录下的package.json'),
        choices: [
            {name: '执行', value: true, short: chalk.green('覆盖源package.json')}, 
            {name: '取消', value: false, short: chalk.red('取消')}
        ]
    }])
    .then(answers => {
        if(answers.deposit) {
            checkJSONExist(copyPath)
                .then(() => {
                    fs.rename(copyPath, sourcePath, err => {
                        if(err) {
                            // console.log(chalk.red(err))
                            console.log(chalk`{yellow package.json文件覆盖失败}`)
                        }
                        else {
                            console.log(chalk.bgBlue(`package.json文件覆盖成功！ 可以使用npm run buil打包，然后npm publish发布`))
                        }
                    })
                }) 
        }

    })
}

switch (CommandParam) {
    case 'g':
        modifyAndWriteJSON()
        break
    case 'rm': 
        removeJSON()
        break
    case 'd': 
        deposit()
        break
    case 'h':
        showHelper()
        break
    default: 
        showHelper()
        break
}