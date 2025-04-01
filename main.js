/*
 * todo:
 *   - fix the ls command creating an extra blank line
 *       -this occurs because the last file also has a <br> appended to it
 *   -
 */

var output = document.getElementById("output");
var commandPrefix = document.getElementById("commandPrefix");
var commandInput = document.getElementById("commandInput");
commandInput.focus();

var commandBuffer = [];
var bufferIndex = 0;

var fsData, currentDir;
const fileJson = fetch("info.json")
	.then(response => response.json())
	.then(data => {
		fsData = data;
		currentDir = fsData;
		console.log(data);
	})
	.catch(error => console.error("Error fetching info.json: ", error));

const commands = {
	help: "help goes here",
	theme: "themes are not implemented yet"
}

function printOutput(s) {
	output.insertAdjacentHTML(
		'beforeend',
		commandPrefix.innerHTML+" "+s+"<br><br>"
	)
}

function updateTheme(bg, text) {
	document.documentElement.style.setProperty("--background-color", bg);
	document.documentElement.style.setProperty("--text-color", text);
}

function parseCommand(input) {
	const regex = /(\ )/g;
	const index = input.search(regex);
	var command;
	var args;

	if(index != -1) {
		command = input.slice(0, index);
		args = input.slice(index+1);
	} else {
		command = input;
		args = "";
	}

	switch(command) {
		case "help":
			printOutput("help<br>" + commands[input]);
			break;
		case "clear":
			output.innerHTML = ""
			break;
		case "ls":
			if(!currentDir.files) {
				printOutput("No files here ;)");
				return;
			}

			let directories = [];
			let files = "";

			for(let name in currentDir) {
				if(currentDir[name].type == "directory") {
					directories.push(name + "/<br>");
				}
			}

			for(let file in currentDir.files) {
				files = files + file + "<br>";
			}

			printOutput("ls<br>" + directories.concat(files).join(" "));
			break;
		case "cd":
			if(currentDir[args]) {
				currentDir = currentDir[args];
				printOutput("cd " + args);
				commandPrefix.innerHTML = "djaysky/" + args + "/>";
			} else {
				printOutput("cd " + args + "<br>Directory \"" + args + "\" could not be found");
			}
			break;
		case "read":
			if(currentDir.files[args]) {
				printOutput("read " + args + "<br>" + currentDir.files[args]);
			} else {
				printOutput("read " + args + "<br>File \"" + args + "\" could not be found.");
			}
			break;
		case "theme":
			switch(args) {
				case "1":
					updateTheme("black", "white");
					break;
				case "2":
					updateTheme("#002b59", "#9ff4e5");
					break;
				case "3":
					updateTheme("#18131e", "#c36ec4");
					break;
				default:
					updateTheme("black", "white");
					break;
			}
			printOutput("theme "+args);
			break;
		case "color":
			const argIndex = args.search(regex);
			let arg1, arg2;
			if(argIndex != -1) {
				arg1 = args.slice(0, argIndex);
				arg2 = args.slice(argIndex);
			} else {
				arg1 = args;
				arg2 = getComputedStyle(document.documentElement)
					.getPropertyValue("--text-color");
			}

			updateTheme(arg2, arg1);
			printOutput("color "+args);
			break;
		case "exit":
			window.location.href = "https://github.com/DJaySky";
			break;
		default:
			printOutput(input+"<br>Invalid command: \""+input+"\"");
			break;
	}
}

document.addEventListener("keydown", (e) => {
	if(e.code == "Escape") {
		commandInput.focus();
		commandInput.value = "";
	} else if(
		e.code == "Enter" &&
		document.activeElement == commandInput
	) {
		parseCommand(commandInput.value);
		let newPos = commandBuffer.push(commandInput.value);
		bufferIndex = newPos;
		commandInput.value = "";
	} else if(e.code == "ArrowUp" && bufferIndex > 0) {
		bufferIndex -= 1;
			commandInput.value = commandBuffer[bufferIndex];
	} else if(e.code == "ArrowDown" && bufferIndex < commandBuffer.length-1) {
		bufferIndex += 1;
		commandInput.value = commandBuffer[bufferIndex];
	}
});
