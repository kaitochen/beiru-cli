#!/usr/bin/env node
const commander = require('commander');
const inquirer = require('inquirer');
const program = new commander.Command();
const download = require('download-git-repo');
const ora = require('ora');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const logSymbols = require('log-symbols');

const initProject = function (projectDir) {
	inquirer.prompt([
		{
			type: 'input',
			name: 'projectName',
			message: `project name:(${projectDir})`
		}, {
			type: 'input',
			name: 'author',
			message: `author:`
		}, {
			type: 'input',
			name: 'description',
			message: `description:`
		}
	]).then((answers) => {
		let {projectName, author = '', description = ''} = answers;
		if(projectName.trim() === ''){
			projectName = projectDir;
		}
		const spinner = ora('Create Project...');
		spinner.start();
		download('direct:https://github.com/kaitochen/br-cli-template.git', projectDir, {clone: true}, function (err) {
			if (err) {
				spinner.fail();
			} else {
				spinner.succeed();
				console.log(logSymbols.success, chalk.green('Download Template Success'));
				const jsonTemplate = require(path.resolve('./') + '/' + projectDir + '/package-template.json');
				jsonTemplate.name = projectName;
				jsonTemplate.author = author;
				jsonTemplate.description = description;
				fs.writeFile(path.resolve('./') + '/' + projectDir + '/package.json', JSON.stringify(jsonTemplate), function (err) {
					if (err) {
						console.log(logSymbols.error, chalk.red('Create File "Package.json" Fail'));
					}else{
						fs.unlink(path.resolve('./') + '/' + projectDir + '/package-template.json',function(err){
							if(err){
								console.log(logSymbols.error, chalk.red('Create File "Package.json" Fail'));
							}else{
								console.log(logSymbols.success, chalk.green('Create Project Success'));
							}
						})
					}

				});
			}
		})
	})
};

program.version('0.1.0', '-V,--version')
	.command('init <name>')
	.action((name) => {
		let targetDir = path.resolve('./') + '/' + name;
		if (fs.existsSync(targetDir)) {
			console.log(logSymbols.error, chalk.red('Directory Is Existed'));
		} else {
			fs.mkdir('./' + name, function (err) {
				if (err) {
					console.error(chalk.red('Create Directory Fail'));
				} else {
					initProject(name);
				}
			})
		}
	});
program.on('command:*', function () {
	if (program.args.length <= 0) {
		console.error(logSymbols.warning, chalk.yellow('Invalid command: command can not be null'));
		process.exit(1);
	} else {
		if (program.args[0] !== 'init') {
			console.error(logSymbols.warning, chalk.yellow('Invalid command: command only can be "init"'));
			process.exit(1)
		} else {
			if (!program.args[1]) {
				console.error(logSymbols.warning, chalk.yellow('Invalid argument: argument "name" is required'));
				process.exit(1)
			}
		}
	}
});
program.parse(process.argv);
