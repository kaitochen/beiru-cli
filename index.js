#!/usr/bin/env node
const commander = require('commander');
const inquirer = require('inquirer');
const program = new commander.Command();
program.version('1.0.0','-V,--version')
	.command('init <name>')
	.action((name)=>{
		console.log(name);
		inquirer.prompt([
			{
				type: 'input',
				name: 'projectName',
				message: `project name:(${name})`
			},{
				type: 'input',
				name: 'author',
				message: `author:`
			}
		]).then((answers)=>{
			console.log(answers);
		})
	});
program.parse(process.argv);
