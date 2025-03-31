var output = document.getElementById("output");
var commandPrefix = document.getElementById("commandPrefix");
var commandInput = document.getElementById("commandInput");
commandInput.focus();

var commandBuffer = [];
var bufferIndex = 0;

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
			var arg1, arg2;
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
		default:
			printOutput(input+"<br>invalid command: \""+input+"\"");
			break;
	}
}

document.addEventListener("keydown", (e) => {
	if(e.code == "Escape") {
		commandInput.focus();
		commandInput.value = "";
	} else if(e.code == "Enter") {
		parseCommand(commandInput.value);
		var newPos = commandBuffer.push(commandInput.value);
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
